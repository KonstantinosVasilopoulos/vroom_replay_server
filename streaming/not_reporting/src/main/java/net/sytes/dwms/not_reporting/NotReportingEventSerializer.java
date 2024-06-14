package net.sytes.dwms.not_reporting;

import com.influxdb.client.write.Point;
import net.sytes.dwms.not_reporting.influxdb.sink2.writer.InfluxDBSchemaSerializer;
import net.sytes.dwms.not_reporting.models.NotReportingEvent;
import org.apache.flink.api.connector.sink2.SinkWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

public class NotReportingEventSerializer implements InfluxDBSchemaSerializer<NotReportingEvent> {
    private static final Logger LOG = LoggerFactory.getLogger(NotReportingEventSerializer.class);

    @Override
    public Point serialize(NotReportingEvent event, SinkWriter.Context context) {
        Point point = new Point("notReporting");
        point.addTag("carId", event.getCarId());

        // Define fields
        Map<String, Object> fields = new HashMap<>();
        fields.put("event", event.toJson());
        point.addFields(fields);

        LOG.info("Saved event: " + event);
        return point;
    }
}
