package net.sytes.dwms.low_fps;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.Properties;

// Singleton class providing utility methods
public class Utils {
    private static final Logger LOG = LoggerFactory.getLogger(Utils.class);

    // Converts hours to milliseconds
    public static long hoursToMillis(int hours) {
        return hours * 3_600_000L;
    }

    // Converts cm/sec to km/hour
    public static double cmsToKmh(double speed_cms) {
        return speed_cms * 0.036;
    }

    // Converts mph to km/hour
    public static double mphToKmh(double speed_mph) {
        return speed_mph * 1.609344;
    }

    // Loads configuration properties file
    public static Properties loadProperties() {
        InputStream inputStream = Utils.class.getClassLoader().getResourceAsStream("config.properties");
        Properties properties = new Properties();
        try {
            properties.load(inputStream);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return properties;
    }

    // Formats Map class instance to JSON string
    public static String formatMapToJson(Map<String, String> map) {
        JSONObject jsonObject = new JSONObject();
        for (Map.Entry<String, String> entry : map.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            jsonObject.append(key, value);
        }

        return jsonObject.toString();
    }

    // Formats Map class instance to influxDB line protocol field
    public static String formatMap(Map<String, String> map) {
        // Convert map to JSON string
        JSONObject jsonObject = new JSONObject();
        for (Map.Entry<String, String> entry : map.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();

            // Escape line protocol special characters
            key = escapeSpecialCharacters(key);
            value = escapeSpecialCharacters(value);

            jsonObject.append(key, value);
        }

        return jsonObject.toString();
    }

    // Escapes commas and equal signs which are special characters in influxDB's line protocol
    private static String escapeSpecialCharacters(String value) {
        return value.replace(",", "\\,").replace("=", "\\=");
    }
}
