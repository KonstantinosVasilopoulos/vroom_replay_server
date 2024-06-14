package net.sytes.dwms.decode_lib.models;

import org.apache.flink.shaded.jackson2.com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public class VroomPayloadData {
    @JsonProperty("speed_cm")
    private double speedCm;

    @JsonProperty("speed_rpm")
    private double speedRpm;

    @JsonProperty("speed_source")
    private String speedSource;

    @JsonProperty("cur_steer")
    private double curSteer;

    @JsonProperty("steer_source")
    private String steerSource;

    private double yaw;
    private double pitch;

    @JsonProperty("fps_1_value")
    private int fps1Value;

    @JsonProperty("fps_1_source")
    private String fps1Source;

    @JsonProperty("fps_2_value")
    private int fps2Value;

    @JsonProperty("fps_2_source")
    private String fps2Source;

    @JsonProperty("fps_3_value")
    private int fps3Value;

    @JsonProperty("fps_3_source")
    private String fps3Source;

    @JsonProperty("fps_4_value")
    private int fps4Value;

    @JsonProperty("fps_4_source")
    private String fps4Source;

    @JsonProperty("fps_5_value")
    private int fps5Value;

    @JsonProperty("fps_5_source")
    private String fps5Source;

    @JsonProperty("current_state")
    private String currentState;

    @JsonProperty("previous_state")
    private String previousState;

    private String node;

    @JsonProperty("loc_x")
    private double locX;

    @JsonProperty("loc_y")
    private double locY;

    @JsonProperty("gps_x")
    private int gpsX;

    @JsonProperty("gps_y")
    private int gpsY;

    @JsonProperty("node_x")
    private int nodeX;

    @JsonProperty("node_y")
    private String nodeY;

    private boolean finished;

    @JsonProperty("tl1")
    private Map<String, Float> tl1;

    @JsonProperty("tl2")
    private Map<String, Float> tl2;

    @JsonProperty("tl3")
    private Map<String, Float> tl3;

    @JsonProperty("tl4")
    private Map<String, Float> tl4;

    @JsonProperty("tl5")
    private Map<String, Float> tl5;

    @JsonProperty("intersection_turn")
    private int intersectionTurn;

    @JsonProperty("roundabout_exit")
    private int roundaboutExit;

    @JsonProperty("stream_x")
    private double streamX;

    @JsonProperty("stream_y")
    private double streamY;

    @JsonProperty("stream_id")
    private int streamId;

    @JsonProperty("stream_name")
    private String streamName;

    @JsonProperty("status_start")
    private boolean statusStart;

    @JsonProperty("status_stop")
    private boolean statusStop;

    @JsonProperty("status_accel")
    private boolean statusAccel;

    @JsonProperty("status_decel")
    private boolean statusDecel;

    @JsonProperty("status_alert")
    private boolean statusAlert;

    @JsonProperty("status_source")
    private String statusSource;

    private Map<String, String> signs;
    private Map<String, String> vehicles;
    private Map<String, String> obstacles;
    private Map<String, String> pedestrians;

    private int power;
    private int current;
    private int gpu;
    private double cpu;

    public double getSpeedCm() {
        return speedCm;
    }

    public void setSpeedCm(double speedCm) {
        this.speedCm = speedCm;
    }

    public double getSpeedRpm() {
        return speedRpm;
    }

    public void setSpeedRpm(double speedRpm) {
        this.speedRpm = speedRpm;
    }

    public String getSpeedSource() {
        return speedSource;
    }

    public void setSpeedSource(String speedSource) {
        this.speedSource = speedSource;
    }

    public double getCurSteer() {
        return curSteer;
    }

    public void setCurSteer(double curSteer) {
        this.curSteer = curSteer;
    }

    public String getSteerSource() {
        return steerSource;
    }

    public void setSteerSource(String steerSource) {
        this.steerSource = steerSource;
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

    public int getFps1Value() {
        return fps1Value;
    }

    public void setFps1Value(int fps1Value) {
        this.fps1Value = fps1Value;
    }

    public String getFps1Source() {
        return fps1Source;
    }

    public void setFps1Source(String fps1Source) {
        this.fps1Source = fps1Source;
    }

    public int getFps2Value() {
        return fps2Value;
    }

    public void setFps2Value(int fps2Value) {
        this.fps2Value = fps2Value;
    }

    public String getFps2Source() {
        return fps2Source;
    }

    public void setFps2Source(String fps2Source) {
        this.fps2Source = fps2Source;
    }

    public int getFps3Value() {
        return fps3Value;
    }

    public void setFps3Value(int fps3Value) {
        this.fps3Value = fps3Value;
    }

    public String getFps3Source() {
        return fps3Source;
    }

    public void setFps3Source(String fps3Source) {
        this.fps3Source = fps3Source;
    }

    public int getFps4Value() {
        return fps4Value;
    }

    public void setFps4Value(int fps4Value) {
        this.fps4Value = fps4Value;
    }

    public String getFps4Source() {
        return fps4Source;
    }

    public void setFps4Source(String fps4Source) {
        this.fps4Source = fps4Source;
    }

    public int getFps5Value() {
        return fps5Value;
    }

    public void setFps5Value(int fps5Value) {
        this.fps5Value = fps5Value;
    }

    public String getFps5Source() {
        return fps5Source;
    }

    public void setFps5Source(String fps5Source) {
        this.fps5Source = fps5Source;
    }

    public String getCurrentState() {
        return currentState;
    }

    public void setCurrentState(String currentState) {
        this.currentState = currentState;
    }

    public String getPreviousState() {
        return previousState;
    }

    public void setPreviousState(String previousState) {
        this.previousState = previousState;
    }

    public String getNode() {
        return node;
    }

    public void setNode(String node) {
        this.node = node;
    }

    public double getLocX() {
        return locX;
    }

    public void setLocX(double locX) {
        this.locX = locX;
    }

    public double getLocY() {
        return locY;
    }

    public void setLocY(double locY) {
        this.locY = locY;
    }

    public int getGpsX() {
        return gpsX;
    }

    public void setGpsX(int gpsX) {
        this.gpsX = gpsX;
    }

    public int getGpsY() {
        return gpsY;
    }

    public void setGpsY(int gpsY) {
        this.gpsY = gpsY;
    }

    public int getNodeX() {
        return nodeX;
    }

    public void setNodeX(int nodeX) {
        this.nodeX = nodeX;
    }

    public String getNodeY() {
        return nodeY;
    }

    public void setNodeY(String nodeY) {
        this.nodeY = nodeY;
    }

    public boolean isFinished() {
        return finished;
    }

    public void setFinished(boolean finished) {
        this.finished = finished;
    }

    public Map<String, Float> getTl1() {
        return tl1;
    }

    public void setTl1(Map<String, Float> tl1) {
        this.tl1 = tl1;
    }

    public Map<String, Float> getTl2() {
        return tl2;
    }

    public void setTl2(Map<String, Float> tl2) {
        this.tl2 = tl2;
    }

    public Map<String, Float> getTl3() {
        return tl3;
    }

    public void setTl3(Map<String, Float> tl3) {
        this.tl3 = tl3;
    }

    public Map<String, Float> getTl4() {
        return tl4;
    }

    public void setTl4(Map<String, Float> tl4) {
        this.tl4 = tl4;
    }

    public Map<String, Float> getTl5() {
        return tl5;
    }

    public void setTl5(Map<String, Float> tl5) {
        this.tl5 = tl5;
    }

    public int getIntersectionTurn() {
        return intersectionTurn;
    }

    public void setIntersectionTurn(int intersectionTurn) {
        this.intersectionTurn = intersectionTurn;
    }

    public int getRoundaboutExit() {
        return roundaboutExit;
    }

    public void setRoundaboutExit(int roundaboutExit) {
        this.roundaboutExit = roundaboutExit;
    }

    public double getStreamX() {
        return streamX;
    }

    public void setStreamX(double streamX) {
        this.streamX = streamX;
    }

    public double getStreamY() {
        return streamY;
    }

    public void setStreamY(double streamY) {
        this.streamY = streamY;
    }

    public int getStreamId() {
        return streamId;
    }

    public void setStreamId(int streamId) {
        this.streamId = streamId;
    }

    public String getStreamName() {
        return streamName;
    }

    public void setStreamName(String streamName) {
        this.streamName = streamName;
    }

    public boolean isStatusStart() {
        return statusStart;
    }

    public void setStatusStart(boolean statusStart) {
        this.statusStart = statusStart;
    }

    public boolean isStatusStop() {
        return statusStop;
    }

    public void setStatusStop(boolean statusStop) {
        this.statusStop = statusStop;
    }

    public boolean isStatusAccel() {
        return statusAccel;
    }

    public void setStatusAccel(boolean statusAccel) {
        this.statusAccel = statusAccel;
    }

    public boolean isStatusDecel() {
        return statusDecel;
    }

    public void setStatusDecel(boolean statusDecel) {
        this.statusDecel = statusDecel;
    }

    public boolean isStatusAlert() {
        return statusAlert;
    }

    public void setStatusAlert(boolean statusAlert) {
        this.statusAlert = statusAlert;
    }

    public String getStatusSource() {
        return statusSource;
    }

    public void setStatusSource(String statusSource) {
        this.statusSource = statusSource;
    }

    public Map<String, String> getSigns() {
        return signs;
    }

    public void setSigns(Map<String, String> signs) {
        this.signs = signs;
    }

    public Map<String, String> getVehicles() {
        return vehicles;
    }

    public void setVehicles(Map<String, String> vehicles) {
        this.vehicles = vehicles;
    }

    public Map<String, String> getObstacles() {
        return obstacles;
    }

    public void setObstacles(Map<String, String> obstacles) {
        this.obstacles = obstacles;
    }

    public Map<String, String> getPedestrians() {
        return pedestrians;
    }

    public void setPedestrians(Map<String, String> pedestrians) {
        this.pedestrians = pedestrians;
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

    public int getGpu() {
        return gpu;
    }

    public void setGpu(int gpu) {
        this.gpu = gpu;
    }

    public double getCpu() {
        return cpu;
    }

    public void setCpu(double cpu) {
        this.cpu = cpu;
    }

    @Override
    public String toString() {
        return "PayloadData{" +
                "speedCm=" + speedCm +
                ", speedRpm=" + speedRpm +
                ", speedSource='" + speedSource + '\'' +
                ", curSteer=" + curSteer +
                ", steerSource='" + steerSource + '\'' +
                ", yaw=" + yaw +
                ", pitch=" + pitch +
                ", fps1Value=" + fps1Value +
                ", fps1Source='" + fps1Source + '\'' +
                ", fps2Value=" + fps2Value +
                ", fps2Source='" + fps2Source + '\'' +
                ", fps3Value=" + fps3Value +
                ", fps3Source='" + fps3Source + '\'' +
                ", fps4Value=" + fps4Value +
                ", fps4Source='" + fps4Source + '\'' +
                ", fps5Value=" + fps5Value +
                ", fps5Source='" + fps5Source + '\'' +
                ", currentState='" + currentState + '\'' +
                ", previousState='" + previousState + '\'' +
                ", node='" + node + '\'' +
                ", locX=" + locX +
                ", locY=" + locY +
                ", gpsX=" + gpsX +
                ", gpsY=" + gpsY +
                ", nodeX=" + nodeX +
                ", nodeY=" + nodeY +
                ", finished=" + finished +
                ", tl1=" + tl1 +
                ", tl2=" + tl2 +
                ", tl3=" + tl3 +
                ", tl4=" + tl4 +
                ", tl5=" + tl5 +
                ", intersectionTurn=" + intersectionTurn +
                ", roundaboutExit=" + roundaboutExit +
                ", streamX=" + streamX +
                ", streamY=" + streamY +
                ", streamId=" + streamId +
                ", streamName='" + streamName + '\'' +
                ", statusStart=" + statusStart +
                ", statusStop=" + statusStop +
                ", statusAccel=" + statusAccel +
                ", statusDecel=" + statusDecel +
                ", statusAlert=" + statusAlert +
                ", statusSource='" + statusSource + '\'' +
                ", signs=" + signs +
                ", vehicles=" + vehicles +
                ", obstacles=" + obstacles +
                ", pedestrians=" + pedestrians +
                ", power=" + power +
                ", current=" + current +
                ", gpu=" + gpu +
                ", cpu=" + cpu +
                '}';
    }
}
