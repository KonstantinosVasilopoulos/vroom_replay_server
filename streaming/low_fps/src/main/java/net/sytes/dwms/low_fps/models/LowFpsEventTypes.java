package net.sytes.dwms.low_fps.models;

public enum LowFpsEventTypes {
    SIGN,
    OBSTACLE,
    LANE,
    HORIZONTAL_LANE,
    VEHICLE;

    public static String getTypeString(LowFpsEventTypes type) {
        return switch (type) {
            case SIGN -> "sign";
            case OBSTACLE -> "obstacle";
            case LANE -> "lane";
            case HORIZONTAL_LANE -> "horizontal lane";
            case VEHICLE -> "vehicle";
            default -> "unknown";
        };
    }

    public static String getTypeSource(LowFpsEventTypes type) {
        return switch (type) {
            case SIGN -> "fps_1_value";
            case OBSTACLE -> "fps_2_value";
            case LANE -> "fps_3_value";
            case HORIZONTAL_LANE -> "fps_4_value";
            case VEHICLE -> "fps_5_value";
            default -> "unknown";
        };
    }
}
