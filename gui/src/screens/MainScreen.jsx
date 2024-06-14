import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainScreen.css";
import Hardware from "../components/Hardware";
import CarInfo from "../components/CarInfo";
import Camera from "../components/Camera";
import Map from "../components/Map";
import MiniMap from "../components/MiniMap";
import Charts from "../components/Charts";
import CarStateInfo from "../components/CarStateInfo";
import mapImg from "../assets/lab-map";
import { useMQTTPublish, useMQTTSubscribe } from "../utils/Connection";
import Detections from "../components/Detections";
import OHStreamer from "../components/OHStreamer";
import SilMenu from "../components/SilMenu";
import GUIPreferences from "../components/GUIPreferences";
import CarConfig from "../components/CarConfig";
import config from "../utils/CarConfig";
import runStartIMG from "../assets/vroom_car_outline.png";
import EmergencyStop from "../components/EmergencyStop";
import emergencyStopIMG from "../assets/emergency-stop.png";
import finishedIMG from "../assets/finished.png";
import TrafficLightComponent from "../components/TrafficLightComponent";

export default function MainScreen({
    client,
    subscribedTopics,
    setSubscribedTopics,
    brokerIP,
    setBrokerIP,
}) {
    const navigate = useNavigate();
    const [openSilMenu, setOpenSilMenu] = useState(false);
    const [openGUIPreferences, setOpenGUIPreferences] = useState(false);
    const [openCarConfig, setOpenCarConfig] = useState(false);
    const [carConfig, setCarConfig] = useState(config);

    const [totalData, setTotalData] = useState({
        speed_cm: 0.0,
        speed_rpm: 0.0,
        speed_source: "Initial",
        cur_steer: 0.0,
        prev_steer: 0.0,
        steer_source: "Initial",
        yaw: 0.0,
        fps_1_value: 0.0,
        fps_1_source: "Lane Detect",
        fps_2_value: 0.0,
        fps_2_source: "Ped Detect",
        fps_3_value: 0.0,
        fps_3_source: "Sign Detect",
        fps_4_value: 0.0,
        fps_4_source: "Power",
        fps_5_value: 0.0,
        fps_5_source: "Jetson",
        current_state: "None",
        previous_state: "None",
        min_node: -1,
        loc_x: 0.0,
        loc_y: 0.0,
        gps_x: 0.0,
        gps_y: 0.0,
        node_x: 0.0,
        node_y: 0.0,
        node: -1,
        finished: false,
        tl1: { state: 0, x: 0.0, y: 0.0 },
        tl2: { state: 0, x: 0.0, y: 0.0 },
        tl3: { state: 0, x: 0.0, y: 0.0 },
        tl4: { state: 0, x: 0.0, y: 0.0 },
        tl5: { state: 0, x: 0.0, y: 0.0 },
        intersection_turn: 2,
        roundabout_exit: -1,
        stream_x: -1.0,
        stream_y: -1.0,
        stream_id: 1,
        stream_name: "None",
        status_start: false,
        status_stop: false,
        status_accel: false,
        status_decel: false,
        status_alert: false,
        status_source: "Initial",
        signs: { name: "None", distance: 0 },
        vehicles: { name: "None", distance: 0 },
        obstacles: { name: "None", distance: 0 },
        pedestrians: { name: "None", distance: 0 },
        power: 0.0,
        current: 0.0,
        cpu: 0,
        gpu: 0,
    });

    const [trackData, setTrackData] = useState({
        trackImgSource: localStorage.getItem("path_frame")
            ? localStorage.getItem("path_frame")
            : mapImg,
        selectTrack: localStorage.getItem("location")
            ? localStorage.getItem("location")
            : "competition",
        yawInit: 0,
    });

    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (initialized) {
            setRunStart(true);
            setTimeout(() => {
                setRunStart(false);
            }, 3000);
        }
        setInitialized(true);
    }, [trackData]);

    const [runStart, setRunStart] = useState(false);
    const [showEmergencyStop, setShowEmergencyStop] = useState(false);
    const [showFinishedIMG, setShowFinishedIMG] = useState(false);

    useEffect(() => {
        if (showEmergencyStop) {
            setTimeout(() => {
                setShowEmergencyStop(false);
            }, 3000);
        }
    }, [showEmergencyStop]);

    useEffect(() => {
        if (totalData.finished) {
            setShowFinishedIMG(true);
            setTimeout(() => {
                setShowFinishedIMG(false);
            }, 10000);
        }
    }, [totalData.finished]);

    useMQTTSubscribe(
        client,
        "total",
        setTotalData,
        subscribedTopics,
        setSubscribedTopics
    );
    useMQTTSubscribe(
        client,
        "path-frame",
        setTrackData,
        subscribedTopics,
        setSubscribedTopics
    );
    useMQTTSubscribe(
        client,
        "car-settings",
        setCarConfig,
        subscribedTopics,
        setSubscribedTopics
    );

    const publish = useMQTTPublish(client);

    return (
        <div className="mainscreen-container">
            <SilMenu
                open={openSilMenu}
                setOpen={setOpenSilMenu}
                publish={publish}
            />
            <div
                className={
                    runStart ? "run-start smooth" : "smooth run-start-disable"
                }
            >
                <img src={runStartIMG}></img>
                <h1 className="run-start-h1">RUN START!</h1>
            </div>
            <div
                className={
                    showEmergencyStop
                        ? "run-start smooth"
                        : "smooth run-start-disable"
                }
            >
                <img src={emergencyStopIMG}></img>
                <h1 className="run-start-h1">EMERGENCY STOP!</h1>
            </div>
            <div
                className={
                    showFinishedIMG
                        ? "run-start smooth"
                        : "smooth run-start-disable"
                }
                onClick={() => setShowFinishedIMG(false)}
            >
                <img src={finishedIMG}></img>
                <h1 className="run-start-h1">RUN FINISHED!</h1>
            </div>
            <GUIPreferences
                open={openGUIPreferences}
                setOpen={setOpenGUIPreferences}
                brokerIP={brokerIP}
                setBrokerIP={setBrokerIP}
            />
            <CarConfig
                open={openCarConfig}
                setOpen={setOpenCarConfig}
                client={client}
                subscribedTopics={subscribedTopics}
                setSubscribedTopics={setSubscribedTopics}
                carConfig={carConfig}
                setCarConfig={setCarConfig}
            />
            <div className="mainscreen-row">
                <Map
                    trackImgSource={trackData.trackImgSource}
                    selectTrack={trackData.selectTrack}
                    coordinatesGPS={{ x: totalData.gps_x, y: totalData.gps_y }}
                    coordinatesNode={{
                        x: totalData.node_x,
                        y: totalData.node_y,
                    }}
                    location={{ x: totalData.loc_x, y: totalData.loc_y }}
                    node={totalData.node}
                    trackData={trackData} //needed for map clearing
                />
                <div className="mainscreen-column">
                    <h1
                        className="vroomitor-title"
                        onClick={() => setOpenGUIPreferences(true)}
                    >
                        vroomitor
                    </h1>
                    <Camera
                        client={client}
                        subscribedTopics={subscribedTopics}
                        setSubscribedTopics={setSubscribedTopics}
                    />
                </div>
                <div
                    className="mainscreen-column"
                    style={{ justifyContent: "flex-end", marginBottom: "1rem" }}
                >
                    <div className="mainscreen-row">
                        <div className="mainscreen-column">
                            <button
                                style={{
                                    width: "11rem",
                                    border: "2px #366CFF solid",
                                    margin: "0.5rem",
                                }}
                                onClick={() =>
                                    publish(
                                        "yaw-reset",
                                        JSON.stringify({ reset: true })
                                    )
                                }
                            >
                                Yaw Reset
                            </button>

                            <button
                                style={{
                                    width: "11rem",
                                    border: "2px #9D35FF solid",
                                    margin: "0.5rem",
                                }}
                                onClick={() =>
                                    publish(
                                        "reset",
                                        JSON.stringify({ reset: true })
                                    )
                                }
                            >
                                Reset
                            </button>
                        </div>
                        <div
                            onClick={() => {
                                publish(
                                    "emergency-stop",
                                    JSON.stringify({ emergency_stop: true })
                                );
                                setShowEmergencyStop(true);
                                console.log(showEmergencyStop);
                            }}
                        >
                            <EmergencyStop />
                        </div>
                        {/* <button
                            style={{
                                width: "11rem",
                                margin: "0.5rem",
                                border: "2px #366CFF solid",
                            }}
                            onClick={() => setOpenGUIPreferences(true)}
                        >
                            GUI Preferences
                        </button> */}
                    </div>
                    <MiniMap
                        subscribedTopics={subscribedTopics}
                        setSubscribedTopics={setSubscribedTopics}
                        trackImgSource={trackData.trackImgSource}
                        // selectTrack={trackData.selectTrack}
                        selectTrack={"competition"}
                        yawInit={trackData.yawInit}
                        client={client}
                        yaw={Math.round(totalData.yaw)}
                        GPS={{ x: totalData.gps_x, y: totalData.gps_y }}
                        trafficLights={[
                            totalData.tl1,
                            totalData.tl2,
                            totalData.tl3,
                            totalData.tl4,
                            totalData.tl5,
                        ]}
                        turns={totalData.intersection_turn}
                        roundabtExit={totalData.roundabout_exit}
                        node={totalData.node}
                        finished={totalData.finished}
                        GPS_pixel={{ x: totalData.gps_x, y: totalData.gps_y }}
                    />
                </div>
            </div>
            <div className="mainscreen-row">
                <div className="mainsceen-column">
                    <div
                        className="mainscreen-row"
                        style={{ justifyContent: "center" }}
                    >
                        <TrafficLightComponent
                            status={totalData.tl1.state}
                            scale={1}
                            number={1}
                            style={{ margin: "0 !important" }}
                        />
                        <TrafficLightComponent
                            status={totalData.tl2.state}
                            scale={1}
                            number={2}
                        />
                        <TrafficLightComponent
                            status={totalData.tl3.state}
                            scale={1}
                            number={3}
                        />
                        <TrafficLightComponent
                            status={totalData.tl4.state}
                            scale={1}
                            number={4}
                        />
                        <TrafficLightComponent
                            status={totalData.tl5.state}
                            scale={1}
                            number={5}
                        />
                    </div>
                    <CarStateInfo
                        currentState={totalData.current_state}
                        previousState={totalData.previous_state}
                        statuses={[
                            totalData.status_start,
                            totalData.status_stop,
                            totalData.status_accel,
                            totalData.status_decel,
                            totalData.status_alert,
                            totalData.status_source,
                        ]}
                    />
                </div>
                <div className="mainscreen-column">
                    <Detections
                        detected={[
                            totalData.signs,
                            totalData.vehicles,
                            totalData.obstacles,
                            totalData.pedestrians,
                        ]}
                    />

                    <div className="mainscreen-row">
                        <Hardware
                            cpu={totalData.cpu}
                            gpu={totalData.gpu}
                            current={totalData.current}
                            power={totalData.power}
                        />
                        <OHStreamer
                            streamData={{
                                x: totalData.stream_x,
                                y: totalData.stream_y,
                                streamId: totalData.stream_id,
                                name: totalData.stream_name,
                            }}
                        />
                    </div>
                </div>
                <Charts
                    graphData={{
                        fps_1_value: totalData.fps_1_value,
                        fps_1_source: totalData.fps_1_source,
                        fps_2_source: totalData.fps_2_source,
                        fps_2_value: totalData.fps_2_value,
                        fps_3_source: totalData.fps_3_source,
                        fps_3_value: totalData.fps_3_value,
                        fps_4_source: totalData.fps_4_source,
                        fps_4_value: totalData.fps_4_value,
                        fps_5_source: totalData.fps_5_source,
                        fps_5_value: totalData.fps_5_value,
                    }}
                />
                <div
                    className="mainscreen-column"
                    style={{ justifyContent: "flex-start", marginTop: "5rem" }}
                >
                    <button
                        style={{
                            width: "11rem",
                            margin: "0.5rem",
                            border: "2px #366CFF solid",
                        }}
                        onClick={() => setOpenSilMenu(true)}
                    >
                        SIL Menu
                    </button>
                    <button
                        style={{
                            width: "11rem",
                            margin: "0.5rem",
                            border: "2px #366CFF solid",
                        }}
                        onClick={() => navigate("/events")}
                    >
                        Events
                    </button>
                
                <CarInfo
                    steering={[totalData.cur_steer, totalData.steer_source]}
                    yaw={Math.round(totalData.yaw)}
                    speed={[
                        totalData.speed_cm,
                        totalData.speed_rpm,
                        totalData.speed_source,
                    ]}
                />
                </div>
            </div>
        </div>
    );
}
