package net.sytes.dwms.gpu_high_load;

import com.influxdb.client.write.Point;
import net.sytes.dwms.gpu_high_load.influxdb.sink2.writer.InfluxDBSchemaSerializer;
import net.sytes.dwms.gpu_high_load.models.GpuHighLoadEvent;
import org.apache.flink.api.connector.sink2.SinkWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

public class GpuHighLoadEventSerializer implements InfluxDBSchemaSerializer<GpuHighLoadEvent> {
    private static final Logger LOG = LoggerFactory.getLogger(GpuHighLoadEventSerializer.class);

    @Override
    public Point serialize(GpuHighLoadEvent event, SinkWriter.Context context) {
        Point point = new Point("gpuHighLoad");
        point.addTag("carId", event.getCarId());

        // Define fields
        Map<String, Object> fields = new HashMap<>();
        fields.put("event", event.toJson());
        point.addFields(fields);

        LOG.info("Saved event: " + event);
        return point;
    }
}
