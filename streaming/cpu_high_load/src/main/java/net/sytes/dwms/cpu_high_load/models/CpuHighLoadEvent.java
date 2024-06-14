package net.sytes.dwms.cpu_high_load.models;

import org.json.JSONObject;

public class CpuHighLoadEvent {
    private String carId;
    private long start;
    private long end;

    public CpuHighLoadEvent(String carId, long start, long end) {
        this.carId = carId;
        this.start = start;
        this.end = end;
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

    @Override
    public String toString() {
        return "CpuHighLoadEvent{" +
                "carId=" + carId +
                ", start=" + start +
                ", end=" + end +
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
