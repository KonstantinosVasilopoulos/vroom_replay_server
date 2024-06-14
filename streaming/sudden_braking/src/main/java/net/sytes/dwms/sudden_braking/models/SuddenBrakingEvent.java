package net.sytes.dwms.sudden_braking.models;

import org.json.JSONObject;

public class SuddenBrakingEvent {
    private String carId;
    private long start;
    private long end;
    private double minSpeed;
    private double maxSpeed;

    public SuddenBrakingEvent(String carId, long start, long end, double minSpeed, double maxSpeed) {
        this.carId = carId;
        this.start = start;
        this.end = end;
        this.minSpeed = minSpeed;
        this.maxSpeed = maxSpeed;
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

    public double getMinSpeed() {
        return minSpeed;
    }

    public void setMinSpeed(double minSpeed) {
        this.minSpeed = minSpeed;
    }

    public double getMaxSpeed() {
        return maxSpeed;
    }

    public void setMaxSpeed(double maxSpeed) {
        this.maxSpeed = maxSpeed;
    }

    @Override
    public String toString() {
        return "SuddenBraking{" +
                "carId=" + carId +
                ", start=" + start +
                ", end=" + end +
                ", minSpeed=" + minSpeed +
                ", maxSpeed=" + maxSpeed +
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
