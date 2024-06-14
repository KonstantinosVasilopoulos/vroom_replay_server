package net.sytes.dwms.sudden_braking.triggers;

import net.sytes.dwms.decode_lib.models.CanonicTotal;
import net.sytes.dwms.sudden_braking.Utils;
import org.apache.flink.api.common.state.ValueState;
import org.apache.flink.api.common.state.ValueStateDescriptor;
import org.apache.flink.api.common.typeinfo.Types;
import org.apache.flink.streaming.api.windowing.triggers.Trigger;
import org.apache.flink.streaming.api.windowing.triggers.TriggerResult;
import org.apache.flink.streaming.api.windowing.windows.TimeWindow;
import org.apache.flink.streaming.api.windowing.windows.Window;

import java.util.Properties;

// Trigger for closing windows every SUDDEN_BRAKING_WINDOW_SIZE_SEC seconds
public class EventTrigger<W extends Window> extends Trigger<CanonicTotal, TimeWindow> {
    private final ValueStateDescriptor<Boolean> firstSeenDescriptor = new ValueStateDescriptor<>("first-seen", Types.BOOLEAN);
    private static final Properties properties = Utils.loadProperties();

    public EventTrigger() {}

    @Override
    public TriggerResult onElement(CanonicTotal total, long l, TimeWindow timeWindow, TriggerContext triggerContext) throws Exception {
        ValueState<Boolean> firstSeen = triggerContext.getPartitionedState(firstSeenDescriptor);

        // Register initial timer only for the first element
        if (firstSeen.value() == null) {
            long now = triggerContext.getCurrentProcessingTime();
            long windowSize = Utils.secsToMillis(Double.parseDouble(properties.getProperty("SUDDEN_BRAKING_WINDOW_SIZE_SEC"))); // millis
            triggerContext.registerProcessingTimeTimer(now + windowSize);
            firstSeen.update(true);
        }

        return TriggerResult.CONTINUE;
    }

    @Override
    public TriggerResult onEventTime(long l, TimeWindow timeWindow, TriggerContext triggerContext) {
        return TriggerResult.CONTINUE;
    }

    @Override
    public TriggerResult onProcessingTime(long l, TimeWindow timeWindow, TriggerContext triggerContext) {
        ValueState<Boolean> firstSeen = triggerContext.getPartitionedState(firstSeenDescriptor);
        firstSeen.clear();
        return TriggerResult.FIRE_AND_PURGE;
    }

    @Override
    public void clear(TimeWindow timeWindow, TriggerContext triggerContext) {
        ValueState<Boolean> firstSeen = triggerContext.getPartitionedState(firstSeenDescriptor);
        firstSeen.clear();
    }
}
