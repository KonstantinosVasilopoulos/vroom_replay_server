package net.sytes.dwms.decode_lib.functions.decoders;

import net.sytes.dwms.decode_lib.Utils;
import net.sytes.dwms.decode_lib.models.CanonicTotal;
import net.sytes.dwms.decode_lib.models.VroomPayloadData;
import net.sytes.dwms.decode_lib.models.VroomTotal;
import org.apache.flink.api.common.functions.MapFunction;
import org.apache.flink.shaded.jackson2.com.fasterxml.jackson.core.JsonProcessingException;
import org.apache.flink.shaded.jackson2.com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

public class VroomDecoder implements MapFunction<String, CanonicTotal> {
    private static final Logger LOG = LoggerFactory.getLogger(VroomDecoder.class);

    @Override
    public CanonicTotal map(String in) {
        if (in == null) {
            LOG.warn("Failed to decode JSON string: {}", in);
            return null;
        }

        // Remove unnecessary elements from JSON string
        String cleanIn = in.substring(2, in.length()-1).replace("\\\\", "\\");

        // Convert JSON string into POJO class instance
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            VroomTotal total = objectMapper.readValue(cleanIn, VroomTotal.class);

            // Decode payload
            VroomPayloadData payloadData = objectMapper.readValue(total.getPayload(), VroomPayloadData.class);
            return createCanonicTotal(total, payloadData, in);

        } catch (JsonProcessingException e) {
            LOG.warn("Failed to decode JSON string: {}", in);
            return null;
        }
    }

    private CanonicTotal createCanonicTotal(VroomTotal total, VroomPayloadData payloadData, String in) {
        CanonicTotal canonicTotal = new CanonicTotal();

        // Map total fields to canonic total fields
        canonicTotal.setCarId(total.getCarId());
        canonicTotal.setTimestamp(total.getTimestamp());

        // Map payload data fields to canonic total fields
        // Convert speed from cm/s to km/h
        canonicTotal.setSpeed(Utils.cmsToKmh(payloadData.getSpeedCm()));
        canonicTotal.setRpm(payloadData.getSpeedRpm());
        canonicTotal.setSteer(payloadData.getCurSteer());
        canonicTotal.setYaw(payloadData.getYaw());
        canonicTotal.setPitch(payloadData.getPitch());
        canonicTotal.setPosX(payloadData.getLocX());
        canonicTotal.setPosY(payloadData.getLocY());
        canonicTotal.setPower(payloadData.getPower());
        canonicTotal.setCurrent(payloadData.getCurrent());
        canonicTotal.setCpu(payloadData.getCpu());
        canonicTotal.setGpu(payloadData.getGpu());

        // Add the rest of the payload in the additional field
        Map<String, Object> additional = new HashMap<>();
        additional.put("speed_source", payloadData.getSpeedSource());
        additional.put("steer_source", payloadData.getSteerSource());
        additional.put("fps_1_value", payloadData.getFps1Value());
        additional.put("fps_1_source", payloadData.getFps1Source());
        additional.put("fps_2_value", payloadData.getFps2Value());
        additional.put("fps_2_source", payloadData.getFps2Source());
        additional.put("fps_3_value", payloadData.getFps3Value());
        additional.put("fps_3_source", payloadData.getFps3Source());
        additional.put("fps_4_value", payloadData.getFps4Value());
        additional.put("fps_4_source", payloadData.getFps4Source());
        additional.put("fps_5_value", payloadData.getFps5Value());
        additional.put("fps_5_source", payloadData.getFps5Source());
        additional.put("current_state", payloadData.getCurrentState());
        additional.put("previous_state", payloadData.getPreviousState());
        additional.put("node", payloadData.getNode());
        additional.put("gps_x", payloadData.getGpsX());
        additional.put("gps_y", payloadData.getGpsY());
        additional.put("node_x", payloadData.getNodeX());
        additional.put("node_y", payloadData.getNodeY());
        additional.put("finished", payloadData.isFinished());
        additional.put("intersection_turn", payloadData.getIntersectionTurn());
        additional.put("roundabout_exit", payloadData.getRoundaboutExit());
        additional.put("stream_x", payloadData.getStreamX());
        additional.put("stream_y", payloadData.getStreamY());
        additional.put("stream_id", payloadData.getStreamId());
        additional.put("stream_name", payloadData.getStreamName());
        additional.put("status_start", payloadData.isStatusStart());
        additional.put("status_stop", payloadData.isStatusStop());
        additional.put("status_accel", payloadData.isStatusAccel());
        additional.put("status_decel", payloadData.isStatusDecel());
        additional.put("status_alert", payloadData.isStatusAlert());
        additional.put("status_source", payloadData.getStatusSource());
        additional.put("signs", Utils.formatMapToJson(payloadData.getSigns()));
        additional.put("vehicles", Utils.formatMapToJson(payloadData.getVehicles()));
        additional.put("obstacles", Utils.formatMapToJson(payloadData.getObstacles()));
        additional.put("pedestrians", Utils.formatMapToJson(payloadData.getPedestrians()));
        canonicTotal.setAdditional(additional);

        canonicTotal.setMessage(in);

        return canonicTotal;
    }
}
