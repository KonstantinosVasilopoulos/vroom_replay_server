package net.sytes.dwms.not_reporting.functions;

import net.sytes.dwms.decode_lib.models.CanonicTotal;
import net.sytes.dwms.not_reporting.models.NotReportingEvent;
import net.sytes.dwms.not_reporting.Utils;
import org.apache.flink.api.common.state.ValueState;
import org.apache.flink.api.common.state.ValueStateDescriptor;
import org.apache.flink.api.common.typeinfo.Types;
import org.apache.flink.configuration.Configuration;
import org.apache.flink.streaming.api.functions.KeyedProcessFunction;
import org.apache.flink.util.Collector;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.time.Instant;
import java.util.Properties;

public class NotReportingDetector extends KeyedProcessFunction<String, CanonicTotal, NotReportingEvent> {
    private static final Logger LOG = LoggerFactory.getLogger(NotReportingDetector.class);
    private static final Properties properties = Utils.loadProperties();
    private long eventMinTime;
    private long eventMaxTime;
    private transient ValueState<Long> lastTimestampState;

    @Override
    public void open(Configuration parameters) throws Exception {
        ValueStateDescriptor<Long> lastTimestampDescriptor = new ValueStateDescriptor<>("lastTimestamp", Types.LONG);
        lastTimestampState = getRuntimeContext().getState(lastTimestampDescriptor);

        eventMinTime = Integer.parseInt(properties.getProperty("NOT_REPORTING_EVENT_TIMER_SEC")) * 1000L;
        eventMaxTime = Integer.parseInt(properties.getProperty("NOT_REPORTING_MAX_TIME_SEC")) * 1000L;

        // Ensure that the max time is greater than or equal to the min time needed for an event
        if (eventMaxTime < eventMinTime) {
            String errorMsg = "NOT_REPORTING_MAX_TIME_SEC has to be greater than or equal to LOW_FPS_EVENT_TIMER_SEC";
            LOG.error(errorMsg);
            throw new Exception(errorMsg);
        }
    }

    @Override
    public void processElement(CanonicTotal total, Context context, Collector<NotReportingEvent> collector) throws Exception {
        Long previousTimestamp = lastTimestampState.value();

        // Update the timestamp state with the current event's timestamp
        lastTimestampState.update(total.getTimestamp());

        // Check if enough time has passed to create an event
        if ((previousTimestamp != null) && (previousTimestamp + eventMinTime <= total.getTimestamp())) {
            createEvent(total.getCarId(), previousTimestamp, total.getTimestamp(), collector);
        }

        // Register a timer for checking if an event has reached the maximum event time
        long timerTimestamp = System.currentTimeMillis() + eventMaxTime;
        context.timerService().registerProcessingTimeTimer(timerTimestamp);
    }

    @Override
    public void onTimer(long timestamp, OnTimerContext context, Collector<NotReportingEvent> collector) throws Exception {
        // Create an event if the maximum time has reached
        Long lastTimestamp = lastTimestampState.value();
        long currentTimestamp = Instant.now().toEpochMilli();
        if ((lastTimestamp != null) && (lastTimestamp + eventMaxTime <= currentTimestamp)) {
            LOG.info("OnTimer event for timestamp: " + lastTimestamp + " - " + timestamp);
            createEvent(context.getCurrentKey(), lastTimestamp, timestamp, collector);
        }
    }

    // Creates a new event
    private void createEvent(String carID, Long start, Long end, Collector<NotReportingEvent> collector) throws IOException {
        LOG.info("Creating event for timestamp: " + start + " - " + end);
        NotReportingEvent event = new NotReportingEvent(carID, start, end);
        collector.collect(event);
    }
}
