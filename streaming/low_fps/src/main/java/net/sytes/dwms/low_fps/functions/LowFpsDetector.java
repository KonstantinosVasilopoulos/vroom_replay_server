package net.sytes.dwms.low_fps.functions;

import net.sytes.dwms.decode_lib.models.CanonicTotal;
import net.sytes.dwms.low_fps.Utils;
import net.sytes.dwms.low_fps.models.LowFpsEvent;
import net.sytes.dwms.low_fps.models.LowFpsEventTypes;
import org.apache.flink.api.common.state.ValueState;
import org.apache.flink.api.common.state.ValueStateDescriptor;
import org.apache.flink.api.common.typeinfo.Types;
import org.apache.flink.configuration.Configuration;
import org.apache.flink.streaming.api.functions.KeyedProcessFunction;
import org.apache.flink.util.Collector;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class LowFpsDetector extends KeyedProcessFunction<String, CanonicTotal, LowFpsEvent> {
    private static final Logger LOG = LoggerFactory.getLogger(LowFpsDetector.class);
    private static final Properties properties = Utils.loadProperties();
    private static final LowFpsEventTypes[] eventTypes = {
            LowFpsEventTypes.SIGN,
            LowFpsEventTypes.OBSTACLE,
            LowFpsEventTypes.LANE,
            LowFpsEventTypes.HORIZONTAL_LANE,
            LowFpsEventTypes.VEHICLE,
    };
    private long eventMinTime;
    private long eventMaxTime;
    private transient ValueState<Map<LowFpsEventTypes, Boolean>> inEventState;
    private transient ValueState<Map<LowFpsEventTypes, Long>> startTimeState;

    @Override
    public void open(Configuration parameters) throws Exception {
        ValueStateDescriptor<Map<LowFpsEventTypes, Boolean>> inEventDescriptor = new ValueStateDescriptor<>("in-event", Types.MAP(Types.ENUM(LowFpsEventTypes.class), Types.BOOLEAN));
        inEventState = getRuntimeContext().getState(inEventDescriptor);

        ValueStateDescriptor<Map<LowFpsEventTypes, Long>> startTimeDescriptor = new ValueStateDescriptor<>("start-time", Types.MAP(Types.ENUM(LowFpsEventTypes.class), Types.LONG));
        startTimeState = getRuntimeContext().getState(startTimeDescriptor);

        eventMinTime = Integer.parseInt(properties.getProperty("LOW_FPS_EVENT_TIMER_SEC")) * 1000L;
        eventMaxTime = Integer.parseInt(properties.getProperty("LOW_FPS_EVENT_MAX_TIME_SEC")) * 1000L;

        // Ensure that the max time is greater than or equal to the min time needed for an event
        if (eventMaxTime < eventMinTime) {
            String errorMsg = "LOW_FPS_EVENT_MAX_TIME_SEC has to be greater than or equal to LOW_FPS_EVENT_TIMER_SEC";
            LOG.error(errorMsg);
            throw new Exception(errorMsg);
        }
    }

    @Override
    public void processElement(CanonicTotal total, Context context, Collector<LowFpsEvent> collector) throws Exception {
        // Get the current state indicating whether the previous message had low FPS
        Map<LowFpsEventTypes, Boolean> inEvent = inEventState.value();
        Map<LowFpsEventTypes, Long> startTime = startTimeState.value();

        if (inEvent == null) {
            // Create map with all event types
            Map<LowFpsEventTypes, Boolean> typesBooleanMap = new HashMap<>();
            Map<LowFpsEventTypes, Long> typesTimeMap = new HashMap<>();
            for (LowFpsEventTypes type : eventTypes) {
                typesBooleanMap.put(type, false);
                typesTimeMap.put(type, null);
            }

            inEvent = typesBooleanMap;
            inEventState.update(typesBooleanMap);

            startTime = typesTimeMap;
            startTimeState.update(typesTimeMap);
        }

        // Identify whether an FPS channel is in event by checking each channel individually
        for (LowFpsEventTypes type : inEvent.keySet()) {
            int currentFps = (int) total.getAdditional().get(LowFpsEventTypes.getTypeSource(type));
            boolean eventCondition = currentFps < Integer.parseInt(properties.getProperty("LOW_FPS_EVENT_THRESHOLD"));
            if (inEvent.get(type)) {
                long start = startTime.get(type);
                if (!eventCondition) {
                    // Check if the minimum time has passed to create an event
                    if (total.getTimestamp() - start >= eventMinTime) {
                        createEvent(total, start, type, collector);
                    } else {
                        // Reset state
                        Map<LowFpsEventTypes, Boolean> newInEvent = inEventState.value();
                        newInEvent.put(type, false);
                        inEventState.update(newInEvent);

                        Map<LowFpsEventTypes, Long> newStartTime = startTimeState.value();
                        newStartTime.put(type, null);
                        startTimeState.update(newStartTime);
                    }

                // Close all events after a set amount of time
                } else if (total.getTimestamp() - start >= eventMaxTime) {
                    createEvent(total, start, type, collector);
                }

            } else {
                // Check if an event has to be started
                if (eventCondition) {
                    LOG.info("Starting event for timestamp: " + total.getTimestamp() + ", type: " + LowFpsEventTypes.getTypeString(type));
                    inEvent.put(type, true);
                    inEventState.update(inEvent);
                    startTime.put(type, total.getTimestamp());
                    startTimeState.update(startTime);
                }
            }
        }
    }

    // Creates a new event
    private void createEvent(CanonicTotal total, Long start, LowFpsEventTypes type, Collector<LowFpsEvent> collector) throws IOException {
        LOG.info("Creating event for timestamp: " + total.getTimestamp() + ", type: " + LowFpsEventTypes.getTypeString(type));
        LowFpsEvent event = new LowFpsEvent(total.getCarId(), start, total.getTimestamp(), type);
        collector.collect(event);

        // Reset state
        Map<LowFpsEventTypes, Boolean> inEvent = inEventState.value();
        inEvent.put(type, false);
        inEventState.update(inEvent);

        Map<LowFpsEventTypes, Long> startTime = startTimeState.value();
        startTime.put(type, null);
        startTimeState.update(startTime);
    }
}
