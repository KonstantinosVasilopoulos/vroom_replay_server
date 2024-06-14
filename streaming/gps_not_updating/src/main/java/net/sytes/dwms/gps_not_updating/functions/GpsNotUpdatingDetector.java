package net.sytes.dwms.gps_not_updating.functions;

import net.sytes.dwms.gps_not_updating.Utils;
import net.sytes.dwms.gps_not_updating.models.GpsNotUpdatingEvent;
import net.sytes.dwms.decode_lib.models.CanonicTotal;
import org.apache.flink.api.common.state.ValueState;
import org.apache.flink.api.common.state.ValueStateDescriptor;
import org.apache.flink.api.common.typeinfo.Types;
import org.apache.flink.configuration.Configuration;
import org.apache.flink.streaming.api.functions.KeyedProcessFunction;
import org.apache.flink.util.Collector;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Properties;

public class GpsNotUpdatingDetector extends KeyedProcessFunction<String, CanonicTotal, GpsNotUpdatingEvent> {
    private static final Logger LOG = LoggerFactory.getLogger(GpsNotUpdatingDetector.class);
    private static final Properties properties = Utils.loadProperties();
    private long eventMinTime;
    private long eventMaxTime;
    private transient ValueState<Boolean> inEventState;
    private transient ValueState<Double> previousXState;
    private transient ValueState<Double> previousYState;
    private transient ValueState<Long> startTimeState;

    @Override
    public void open(Configuration parameters) throws Exception {
        ValueStateDescriptor<Boolean> inEventDescriptor = new ValueStateDescriptor<>("in-event", Types.BOOLEAN);
        inEventState = getRuntimeContext().getState(inEventDescriptor);

        ValueStateDescriptor<Double> previousXDescriptor = new ValueStateDescriptor<>("previous-x", Types.DOUBLE);
        previousXState = getRuntimeContext().getState(previousXDescriptor);

        ValueStateDescriptor<Double> previousYDescriptor = new ValueStateDescriptor<>("previous-y", Types.DOUBLE);
        previousYState = getRuntimeContext().getState(previousYDescriptor);

        ValueStateDescriptor<Long> startTimeDescriptor = new ValueStateDescriptor<>("start-time", Types.LONG);
        startTimeState = getRuntimeContext().getState(startTimeDescriptor);

        eventMinTime = Integer.parseInt(properties.getProperty("GPS_NOT_UPDATING_EVENT_TIMER_SEC")) * 1000L;
        eventMaxTime = Integer.parseInt(properties.getProperty("GPS_NOT_UPDATING_EVENT_MAX_TIME_SEC")) * 1000L;

        // Ensure that the max time is greater than or equal to the min time needed for an event
        if (eventMaxTime < eventMinTime) {
            String errorMsg = "GPS_NOT_UPDATING_EVENT_MAX_TIME_SEC has to be greater than or equal to GPS_NOT_UPDATING_EVENT_TIMER_SEC";
            LOG.error(errorMsg);
            throw new Exception(errorMsg);
        }
    }

    @Override
    public void processElement(CanonicTotal total, Context context, Collector<GpsNotUpdatingEvent> collector) throws Exception {
        // Get the current state indicating whether the previous message had high CPU load
        Boolean inEvent = inEventState.value();
        Double previousX = previousXState.value();
        Double previousY = previousYState.value();
        Long startTime = startTimeState.value();

        // Set initial position
        if (inEvent == null) {
            inEventState.update(false);
            previousXState.update(total.getPosX());
            previousYState.update(total.getPosY());
            return;
        }

        double distanceTraversed = calculateDistance(previousX, previousY, total.getPosX(), total.getPosY());
        boolean eventCondition = (total.getSpeed() != 0) && (distanceTraversed == 0);
        if (inEvent) {
            if (!eventCondition) {
                // Check if the minimum time has passed to create an event
                if (total.getTimestamp() - startTime >= eventMinTime) {
                    createEvent(total, startTime, collector);
                } else {
                    inEventState.update(false);
                    startTimeState.update(null);
                }

            // Close all events after a set amount of time
            } else if (total.getTimestamp() - startTime >= eventMaxTime) {
                createEvent(total, startTime, collector);
            }

        } else {
            // Check if an event has to be started
            if (eventCondition) {
                LOG.info("Starting event for timestamp: " + total.getTimestamp());
                inEventState.update(true);
                startTimeState.update(total.getTimestamp());
            }
        }

        previousXState.update(total.getPosX());
        previousYState.update(total.getPosY());
    }

    // Calculates the distance between two points in 2D
    private double calculateDistance(double previousX, double previousY, double newX, double newY) {
        return Math.sqrt(Math.pow(newX - previousX, 2.0) + Math.pow(newY - previousY, 2.0));
    }

    // Creates a new event
    private void createEvent(CanonicTotal total, Long startTime, Collector<GpsNotUpdatingEvent> collector) throws IOException {
        LOG.info("Creating event for timestamp: " + total.getTimestamp());
        GpsNotUpdatingEvent event = new GpsNotUpdatingEvent(total.getCarId(), startTime, total.getTimestamp());
        collector.collect(event);

        inEventState.update(false);
        startTimeState.update(null);
    }
}
