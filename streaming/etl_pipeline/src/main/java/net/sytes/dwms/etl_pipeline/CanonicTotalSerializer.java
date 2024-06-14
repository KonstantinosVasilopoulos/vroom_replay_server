package net.sytes.dwms.etl_pipeline;

import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;
import net.sytes.dwms.etl_pipeline.influxdb.sink2.writer.InfluxDBSchemaSerializer;
import net.sytes.dwms.etl_pipeline.mappers.AdditionalMapper;
import net.sytes.dwms.decode_lib.models.CanonicTotal;
import org.apache.flink.api.connector.sink2.SinkWriter;

import java.util.HashMap;
import java.util.Map;

public class CanonicTotalSerializer implements InfluxDBSchemaSerializer<CanonicTotal> {
    @Override
    public Point serialize(CanonicTotal total, SinkWriter.Context context) {
        Point point = new Point("vroomTotal");
        point = point.time(total.getTimestamp(), WritePrecision.MS);
        point.addTag("carId", total.getCarId());

        // Define fields
        Map<String, String> additionalMapped = AdditionalMapper.mapToObject(total.getAdditional());
        Map<String, Object> fields = new HashMap<>();
        fields.put("speed", total.getSpeed());
        fields.put("rpm", total.getRpm());
        fields.put("steer", total.getSteer());
        fields.put("yaw", total.getYaw());
        fields.put("pitch", total.getPitch());
        fields.put("posX", total.getPosX());
        fields.put("posY", total.getPosY());
        fields.put("power", total.getPower());
        fields.put("current", total.getCurrent());
        fields.put("cpu", total.getCpu());
        fields.put("gpu", total.getGpu());
        fields.put("additional", Utils.formatMap(additionalMapped));
        fields.put("message", total.getMessage());
        point.addFields(fields);

        return point;
    }
}
