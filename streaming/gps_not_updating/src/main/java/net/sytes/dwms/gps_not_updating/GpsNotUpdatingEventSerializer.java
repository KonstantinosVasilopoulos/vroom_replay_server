package net.sytes.dwms.gps_not_updating;

import com.influxdb.client.write.Point;
import net.sytes.dwms.gps_not_updating.influxdb.sink2.writer.InfluxDBSchemaSerializer;
import net.sytes.dwms.gps_not_updating.models.GpsNotUpdatingEvent;
import org.apache.flink.api.connector.sink2.SinkWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

public class GpsNotUpdatingEventSerializer implements InfluxDBSchemaSerializer<GpsNotUpdatingEvent> {
    private static final Logger LOG = LoggerFactory.getLogger(GpsNotUpdatingEventSerializer.class);

    @Override
    public Point serialize(GpsNotUpdatingEvent event, SinkWriter.Context context) {
        Point point = new Point("gpsNotUpdating");
        point.addTag("carId", event.getCarId());

        // Define fields
        Map<String, Object> fields = new HashMap<>();
        fields.put("event", event.toJson());
        point.addFields(fields);

        LOG.info("Saved event: " + event);
        return point;
    }
}
