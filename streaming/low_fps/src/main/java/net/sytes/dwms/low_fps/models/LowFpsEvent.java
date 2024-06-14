package net.sytes.dwms.low_fps.models;

import org.json.JSONObject;

public class LowFpsEvent {
    private String carId;
    private long start;
    private long end;
    private LowFpsEventTypes type;

    public LowFpsEvent(String carId, long start, long end, LowFpsEventTypes type) {
        this.carId = carId;
        this.start = start;
        this.end = end;
        this.type = type;
    }

    public String getCarId() {
        return carId;
    }

    public void setCarId(String carId) {
        this.carId = carId;
    }

    public long getStart() {
        return start;
    }

    public void setStart(long start) {
        this.start = start;
    }

    public long getEnd() {
        return end;
    }

    public void setEnd(long end) {
        this.end = end;
    }

    public LowFpsEventTypes getType() {
        return type;
    }

    public void setType(LowFpsEventTypes type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "LowFpsEvent{" +
                "carId='" + carId + '\'' +
                ", start=" + start +
                ", end=" + end +
                ", type=" + LowFpsEventTypes.getTypeString(type) +
                '}';
    }

    public String toJson() {
        JSONObject json = new JSONObject();
        json.put("carId", carId);
        json.put("start", start);
        json.put("end", end);
        return json.toString();
    }
}
