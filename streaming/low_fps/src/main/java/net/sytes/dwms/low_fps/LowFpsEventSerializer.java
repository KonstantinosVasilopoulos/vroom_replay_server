package net.sytes.dwms.low_fps;

import com.influxdb.client.write.Point;
import net.sytes.dwms.low_fps.influxdb.sink2.writer.InfluxDBSchemaSerializer;
import net.sytes.dwms.low_fps.models.LowFpsEvent;
import net.sytes.dwms.low_fps.models.LowFpsEventTypes;
import org.apache.flink.api.connector.sink2.SinkWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

public class LowFpsEventSerializer implements InfluxDBSchemaSerializer<LowFpsEvent> {
    private static final Logger LOG = LoggerFactory.getLogger(LowFpsEventSerializer.class);

    @Override
    public Point serialize(LowFpsEvent event, SinkWriter.Context context) {
        Point point = new Point("lowFps");
        point.addTag("carId", event.getCarId());
        point.addTag("type", LowFpsEventTypes.getTypeString(event.getType()));

        // Define fields
        Map<String, Object> fields = new HashMap<>();
        fields.put("event", event.toJson());
        point.addFields(fields);

        LOG.info("Saved event: " + event);
        return point;
    }
}
