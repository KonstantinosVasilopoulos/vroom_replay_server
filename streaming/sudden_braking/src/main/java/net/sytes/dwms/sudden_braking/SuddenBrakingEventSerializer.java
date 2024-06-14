package net.sytes.dwms.sudden_braking;

import com.influxdb.client.write.Point;
import net.sytes.dwms.sudden_braking.influxdb.sink2.writer.InfluxDBSchemaSerializer;
import net.sytes.dwms.sudden_braking.models.SuddenBrakingEvent;
import org.apache.flink.api.connector.sink2.SinkWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

public class SuddenBrakingEventSerializer implements InfluxDBSchemaSerializer<SuddenBrakingEvent> {
    private static final Logger LOG = LoggerFactory.getLogger(SuddenBrakingEventSerializer.class);

    @Override
    public Point serialize(SuddenBrakingEvent event, SinkWriter.Context context) {
        Point point = new Point("suddenBraking");
        point.addTag("carId", event.getCarId());

        // Define fields
        Map<String, Object> fields = new HashMap<>();
        fields.put("event", event.toJson());
        point.addFields(fields);

        LOG.info("Saved event: " + event);
        return point;
    }
}
