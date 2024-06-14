package net.sytes.dwms.decode_lib.models;

import java.util.Map;

public class CanonicTotal {
    private String carId;

    // Timestamp in milliseconds
    private long timestamp;

    // Speed in km/h
    private double speed;

    // Wheel RPM
    private double rpm;
    private double steer;
    private double yaw;
    private double pitch;
    private double posX;
    private double posY;

    // Power in Watt
    private int power;

    // Electronic current in milliampere
    private int current;
    private double cpu;
    private double gpu;
    private Map<String, Object> additional;
    private String message;

    public String getCarId() {
        return carId;
    }

    public void setCarId(String carId) {
        this.carId = carId;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public double getSpeed() {
        return speed;
    }

    public void setSpeed(double speed) {
        this.speed = speed;
    }

    public double getRpm() {
        return rpm;
    }

    public void setRpm(double rpm) {
        this.rpm = rpm;
    }

    public double getSteer() {
        return steer;
    }

    public void setSteer(double steer) {
        this.steer = steer;
    }

    public double getYaw() {
        return yaw;
    }

    public void setYaw(double yaw) {
        this.yaw = yaw;
    }

    public double getPitch() {
        return pitch;
    }

    public void setPitch(double pitch) {
        this.pitch = pitch;
    }

    public double getPosX() {
        return posX;
    }

    public void setPosX(double posX) {
        this.posX = posX;
    }

    public double getPosY() {
        return posY;
    }

    public void setPosY(double posY) {
        this.posY = posY;
    }

    public int getPower() {
        return power;
    }

    public void setPower(int power) {
        this.power = power;
    }

    public int getCurrent() {
        return current;
    }

    public void setCurrent(int current) {
        this.current = current;
    }

    public double getCpu() {
        return cpu;
    }

    public void setCpu(double cpu) {
        this.cpu = cpu;
    }

    public double getGpu() {
        return gpu;
    }

    public void setGpu(double gpu) {
        this.gpu = gpu;
    }

    public Map<String, Object> getAdditional() {
        return additional;
    }

    public void setAdditional(Map<String, Object> additional) {
        this.additional = additional;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "CanonicTotal{" +
                "carId='" + carId + '\'' +
                ", timestamp=" + timestamp +
                ", speed=" + speed +
                ", rpm=" + rpm +
                ", steer=" + steer +
                ", yaw=" + yaw +
                ", pitch=" + pitch +
                ", posX=" + posX +
                ", posY=" + posY +
                ", power=" + power +
                ", current=" + current +
                ", cpu=" + cpu +
                ", gpu=" + gpu +
                '}';
    }
}
