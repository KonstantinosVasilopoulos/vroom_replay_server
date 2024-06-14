package net.sytes.dwms.sudden_braking.functions;

import net.sytes.dwms.sudden_braking.Utils;
import net.sytes.dwms.sudden_braking.models.SuddenBrakingEvent;
import org.apache.flink.api.common.functions.FilterFunction;

import java.util.Properties;

public class SuddenBrakingEventFilter implements FilterFunction<SuddenBrakingEvent> {
    private static final Properties properties = Utils.loadProperties();

    @Override
    public boolean filter(SuddenBrakingEvent event) {
        // Exclude events with a max-min difference below threshold
        double speedDifference = Math.abs(event.getMaxSpeed() - event.getMinSpeed());
        return speedDifference >= Double.parseDouble(properties.getProperty("SUDDEN_BRAKING_MIN_DIFFERENCE"));
    }
}
