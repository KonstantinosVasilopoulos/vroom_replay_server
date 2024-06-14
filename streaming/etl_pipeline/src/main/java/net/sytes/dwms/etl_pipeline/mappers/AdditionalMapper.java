package net.sytes.dwms.etl_pipeline.mappers;

import java.util.HashMap;
import java.util.Map;

public class AdditionalMapper {
    // Maps the additional field of the CanonicTotal class to a Map<String, String>
    // This method is used to create the influxdb line protocol of the additional field
    public static Map<String, String> mapToObject(Map<String, Object> input) {
        // Map each key-value pair from input to the corresponding field in VroomPayloadData
        Map<String, String> output = new HashMap<>();
        for (Map.Entry<String, Object> entry : input.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();
            String stringValue = String.valueOf(value);
            output.put(key, stringValue);
        }

        return output;
    }
}
