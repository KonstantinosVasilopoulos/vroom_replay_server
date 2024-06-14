package net.sytes.dwms.gpu_high_load.functions;

import net.sytes.dwms.gpu_high_load.Utils;
import net.sytes.dwms.decode_lib.models.CanonicTotal;
import org.apache.flink.api.common.functions.FilterFunction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Objects;
import java.util.Properties;

public class TotalValidator implements FilterFunction<CanonicTotal> {
    private static final Logger LOG = LoggerFactory.getLogger(TotalValidator.class);
    private static final Properties properties = Utils.loadProperties();

    @Override
    public boolean filter(CanonicTotal total) {
        // Filter null values
        if (Objects.isNull(total)) {
            LOG.warn("Null value data discarded");
            return false;
        }

        // Filter data without a car ID
        if (Objects.isNull(total.getCarId())) {
            LOG.warn("Null car ID in {}", total);
            return false;
        }

        // Filter data with too old timestamp
        // The timestamp field has to be within the last 7 days
        int offsetHours = Integer.parseInt(properties.getProperty("MIN_TIMESTAMP_HOURS_OFFSET"));
        long minTimestamp = Instant.now().minus(offsetHours, ChronoUnit.HOURS).toEpochMilli();
        if (total.getTimestamp() < minTimestamp) {
            LOG.warn("Timestamp before {} hours in {}", offsetHours, total);
            return false;
        }

        // Filter data with future timestamp
        long now = Instant.now().toEpochMilli();
        if (total.getTimestamp() > now) {
            LOG.warn("Future timestamp in {}", total);
            return false;
        }

        // Filter data with invalid speed
        if (
                (total.getSpeed() < Double.parseDouble(properties.getProperty("MIN_SPEED_KMH"))) ||
                (total.getSpeed() > Double.parseDouble(properties.getProperty("MAX_SPEED_KMH")))
        ) {
            LOG.warn("Invalid speed in {}", total);
            return false;
        }

        return true;
    }
}
