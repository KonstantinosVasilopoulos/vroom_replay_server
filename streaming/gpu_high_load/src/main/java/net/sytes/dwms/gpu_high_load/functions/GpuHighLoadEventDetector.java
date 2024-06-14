package net.sytes.dwms.gpu_high_load.functions;

import net.sytes.dwms.gpu_high_load.Utils;
import net.sytes.dwms.gpu_high_load.models.GpuHighLoadEvent;
import net.sytes.dwms.decode_lib.models.CanonicTotal;
import org.apache.flink.api.common.state.ValueState;
import org.apache.flink.api.common.state.ValueStateDescriptor;
import org.apache.flink.api.common.typeinfo.Types;
import org.apache.flink.configuration.Configuration;
import org.apache.flink.streaming.api.functions.KeyedProcessFunction;
import org.apache.flink.util.Collector;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Properties;

public class GpuHighLoadEventDetector extends KeyedProcessFunction<String, CanonicTotal, GpuHighLoadEvent> {
    private static final Logger LOG = LoggerFactory.getLogger(GpuHighLoadEventDetector.class);
    private static final Properties properties = Utils.loadProperties();
    private long eventMinTime;
    private transient ValueState<Boolean> inEventState;
    private transient ValueState<Long> startTimeState;

    @Override
    public void open(Configuration parameters) {
        ValueStateDescriptor<Boolean> inEventDescriptor = new ValueStateDescriptor<>("in-event", Types.BOOLEAN);
        inEventState = getRuntimeContext().getState(inEventDescriptor);

        ValueStateDescriptor<Long> startTimeDescriptor = new ValueStateDescriptor<>("start-time", Types.LONG);
        startTimeState = getRuntimeContext().getState(startTimeDescriptor);

        eventMinTime = Integer.parseInt(properties.getProperty("HIGH_GPU_EVENT_MIN_TIME_SEC")) * 1000L;
    }

    @Override
    public void processElement(CanonicTotal total, Context context, Collector<GpuHighLoadEvent> collector) throws Exception {
        // Get the current state indicating whether the previous message had high GPU load
        Boolean inEvent = inEventState.value();
        Long startTime = startTimeState.value();

        boolean previousInEvent = inEvent != null ? inEvent : false;
        if (previousInEvent) {
            if (total.getGpu() <= Double.parseDouble(properties.getProperty("HIGH_GPU_THRESHOLD"))) {
                // Check if the minimum time has passed to create an event
                if (total.getTimestamp() - startTime >= eventMinTime) {
                    LOG.info("Creating event for timestamp: " + total.getTimestamp());
                    GpuHighLoadEvent event = new GpuHighLoadEvent(total.getCarId(), startTime, total.getTimestamp());
                    collector.collect(event);
                }

                inEventState.update(false);
                startTimeState.update(null);
            }
        } else {
            // Check if an event has to be started
            if (total.getGpu() > Double.parseDouble(properties.getProperty("HIGH_GPU_THRESHOLD"))) {
                LOG.info("Starting event for timestamp: " + total.getTimestamp());
                inEventState.update(true);
                startTimeState.update(total.getTimestamp());
            }
        }
    }
}
