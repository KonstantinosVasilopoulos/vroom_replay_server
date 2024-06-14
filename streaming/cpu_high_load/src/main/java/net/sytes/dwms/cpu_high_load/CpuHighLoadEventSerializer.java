package net.sytes.dwms.cpu_high_load;

import com.influxdb.client.write.Point;
import net.sytes.dwms.cpu_high_load.influxdb.sink2.writer.InfluxDBSchemaSerializer;
import net.sytes.dwms.cpu_high_load.models.CpuHighLoadEvent;
import org.apache.flink.api.connector.sink2.SinkWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

public class CpuHighLoadEventSerializer implements InfluxDBSchemaSerializer<CpuHighLoadEvent> {
    private static final Logger LOG = LoggerFactory.getLogger(CpuHighLoadEventSerializer.class);

    @Override
    public Point serialize(CpuHighLoadEvent event, SinkWriter.Context context) {
        Point point = new Point("cpuHighLoad");
        point.addTag("carId", event.getCarId());

        // Define fields
        Map<String, Object> fields = new HashMap<>();
        fields.put("event", event.toJson());
        point.addFields(fields);

        LOG.info("Saved event: " + event);
        return point;
    }
}
