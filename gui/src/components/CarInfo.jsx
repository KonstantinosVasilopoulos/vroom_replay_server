import React, { useEffect, useState } from "react";
import "./CarInfo.css";
import carIcon from "../assets/icons/car.png";
import steeringWheel from "../assets/icons/steering-wheel.png";
import yawIcon from "../assets/icons/car-top.png";
import marker from "../assets/icons/marker.png";
import LogsWindow from "./LogsWindow";
import currentTime from "../utils/currentTime";
export default function CarInfo({ steering, yaw, speed }) {
    const [openSteerLogs, setOpenSteerLogs] = useState(false);
    const [openYawLogs, setOpenYawLogs] = useState(false);
    const [openSpeedLogs, setOpenSpeedLogs] = useState(false);

    const [steerLogInfo, setSteerLogInfo] = useState([]);
    const [yawLogInfo, setYawLogInfo] = useState([]);
    const [speedLogInfo, setSpeedLogInfo] = useState([]);

    useEffect(() => {
        if (steering[0] !== steerLogInfo[steerLogInfo.length - 1]?.steer) {
            setSteerLogInfo((prev) => [
                ...prev,
                {
                    time: currentTime(),
                    steer: steering[0],
                    setby: steering[1],
                },
            ]);
        }
    }, [steering]);

    useEffect(() => {
        if (yaw !== yawLogInfo[yawLogInfo.length - 1]?.yaw) {
            setYawLogInfo((prev) => [
                ...prev,
                {
                    time: currentTime(),
                    yaw: yaw,
                },
            ]);
        }
    }, [yaw]);

    useEffect(() => {
        const [currentCms, currentRpms, speedSource] = speed;
        const lastLog = speedLogInfo[speedLogInfo.length - 1];
        if (currentCms !== lastLog?.cms || currentRpms !== lastLog?.rpms) {
            setSpeedLogInfo((prev) => [
                ...prev,
                {
                    time: currentTime(),
                    cms: currentCms,
                    source: speedSource,
                },
            ]);
        }
    }, [speed]);

    return (
        <div className='car-info-container'>
            <LogsWindow openLogs={openSteerLogs} setOpenLogs={setOpenSteerLogs} title={"Steering Logs"} information={steerLogInfo} />
            <LogsWindow openLogs={openYawLogs} setOpenLogs={setOpenYawLogs} title={"Yaw Logs"} information={yawLogInfo} />
            <LogsWindow openLogs={openSpeedLogs} setOpenLogs={setOpenSpeedLogs} title={"Speed Logs"} information={speedLogInfo} />
            <div className='car-info-title'>
                <h1>Car Information</h1>
                {/* <img src={carIcon} alt='Car info icon' className='car-info-title-icon' /> */}
            </div>
            <div className='car-info-content-container'>
                <div
                    className='steering-info'
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenSteerLogs(true);
                    }}
                >
                    <div>
                        <p>
                            Steering: <span className='important-color'>{Math.round(steering[0])}°</span>
                        </p>
                        <p className='set-by'>set by {steering[1]}</p>
                    </div>
                    <img
                        src={steeringWheel}
                        alt='Steering'
                        style={{
                            transform: `rotate(${steering[0] * 4}deg)`,
                            transition: "all 0.5s",
                            marginRight: "2.5rem",
                        }}
                        draggable='false'
                        width={"60rem"}
                    ></img>
                </div>
                <div
                    className='yaw-info'
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenYawLogs(true);
                    }}
                >
                    <p>
                        Yaw: <span className='important-color'>{yaw}°</span>
                    </p>
                    <img
                        src={yawIcon}
                        alt='Vehicle Yaw'
                        style={{
                            transform: `rotate(${yaw}deg)`,
                            transition: "all 0.5s",
                            marginRight: "3rem",
                        }}
                        draggable='false'
                        width={"40rem"}
                    ></img>
                </div>
                <div
                    className='speed-info'
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenSpeedLogs(true);
                    }}
                >
                    <div style={{width:"18rem"}}>
                        <p>
                            Speed: <span className='important-color'>{speed[0]}</span>
                            cm/s, <span className='important-color'>{speed[1]}</span>
                            rpm/s
                        </p>
                        <p className='set-by'>set by {speed[2]}</p>
                    </div>
                        <div className='speed-logo-section' style={{height: "120%",}}>
                        <img
                            src={marker}
                            style={{
                                width: "100%",
                                
                                transform: `rotate(${
                                    // (value.speed / 40) * 180 - 3
                                    (speed[0] / 50) * 180 - 3
                                }deg)`,
                                transition: "all 0.5s",
                            }}
                            draggable='false'
                        ></img>
                    </div>
                </div>
            </div>
        </div>
    );
}
