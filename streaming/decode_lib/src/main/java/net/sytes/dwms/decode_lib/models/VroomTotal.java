package net.sytes.dwms.decode_lib.models;


import org.apache.flink.shaded.jackson2.com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public class VroomTotal {
    @JsonProperty("car_id")
    private String carId;

    @JsonProperty("publish_received_at")
    private long publishReceivedAt;

    @JsonProperty("pub_props")
    private Map<String, Object> pubProps;

    private String peerHost;

    private int qos;

    private String topic;

    private String clientId;

    private String payload;

    private String username;

    private String event;

    private Map<String, Object> metadata;

    private long timestamp;

    private String node;

    private String id;

    private Map<String, Boolean> flags;

    public String getCarId() {
        return carId;
    }

    public void setCarId(String carId) {
        this.carId = carId;
    }

    public long getPublishReceivedAt() {
        return publishReceivedAt;
    }

    public void setPublishReceivedAt(long publishReceivedAt) {
        this.publishReceivedAt = publishReceivedAt;
    }

    public Map<String, Object> getPubProps() {
        return pubProps;
    }

    public void setPubProps(Map<String, Object> pubProps) {
        this.pubProps = pubProps;
    }

    @JsonProperty("peerhost")
    public String getPeerHost() {
        return peerHost;
    }

    @JsonProperty("peerhost")
    public void setPeerHost(String peerHost) {
        this.peerHost = peerHost;
    }

    public int getQos() {
        return qos;
    }

    public void setQos(int qos) {
        this.qos = qos;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    @JsonProperty("clientid")
    public String getClientId() {
        return clientId;
    }

    @JsonProperty("clientid")
    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getPayload() {
        return payload;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public String getNode() {
        return node;
    }

    public void setNode(String node) {
        this.node = node;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Map<String, Boolean> getFlags() {
        return flags;
    }

    public void setFlags(Map<String, Boolean> flags) {
        this.flags = flags;
    }

    @Override
    public String toString() {
        return "Total{" +
                "carId='" + carId + '\'' +
                ", publishReceivedAt=" + publishReceivedAt +
                ", pubProps=" + pubProps +
                ", peerHost='" + peerHost + '\'' +
                ", qos=" + qos +
                ", topic='" + topic + '\'' +
                ", clientId='" + clientId + '\'' +
                ", payload='" + payload + '\'' +
                ", username='" + username + '\'' +
                ", event='" + event + '\'' +
                ", metadata=" + metadata +
                ", timestamp=" + timestamp +
                ", node='" + node + '\'' +
                ", id='" + id + '\'' +
                ", flags=" + flags +
                '}';
    }
}
