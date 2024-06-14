import React, { useEffect, useState } from "react";
import "./CarStateInfo.css";
import LogsWindow from "./LogsWindow";
import currentTime from "../utils/currentTime";
import alert from "../assets/StatusIcons/alert.png";
import accel from "../assets/StatusIcons/accel.png";
import decel from "../assets/StatusIcons/decel.png";
import start from "../assets/StatusIcons/start.png";
import stop from "../assets/StatusIcons/stop.png";
export default function CarStateInfo({ currentState, previousState, statuses }) {
    const [openStateLogs, setOpenStateLogs] = useState(false);
    const [openStatusLogs, setOpenStatusLogs] = useState(false);

    const [currentStatus, setCurrentStatus] = useState("None");
    const [statusIcon, setStatusIcon] = useState(stop);

    useEffect(() => {
        const firstTruthyStatus = statuses.find((status) => status);
        switch (firstTruthyStatus) {
            case statuses[0]:
                setCurrentStatus("Start");
                setStatusIcon(start);
                break;
            case statuses[1]:
                setCurrentStatus("Stop");
                setStatusIcon(stop);
                break;
            case statuses[2]:
                setCurrentStatus("Accelerate");
                setStatusIcon(accel);
                break;
            case statuses[3]:
                setCurrentStatus("Decelerate");
                setStatusIcon(decel);
                break;
            case statuses[4]:
                setCurrentStatus("Alert");
                setStatusIcon(alert);
                break;

            default:
                setCurrentStatus("None");
                setStatusIcon(stop);
                break;
        }
    }, [statuses]);

    const [stateLogData, setStateLogData] = useState([]);
    const [statusLogData, setStatusLogData] = useState([]);

    useEffect(() => {
        if (currentState !== stateLogData[stateLogData.length - 1]?.state) {
            setStateLogData((prev) => [
                ...prev,
                {
                    time: currentTime(),
                    state: currentState,
                },
            ]);
        }
    }, [currentState, stateLogData]);

    useEffect(() => {
        if (currentStatus !== statusLogData[statusLogData.length - 1]?.status) {
            setStatusLogData((prev) => [
                ...prev,
                {
                    time: currentTime(),
                    status: currentStatus,
                    setby: statuses[5],
                },
            ]);
        }
    }, [currentStatus, statusLogData]);

    return (
        <div className='car-state-info-container'>
            <LogsWindow openLogs={openStateLogs} setOpenLogs={setOpenStateLogs} title={"Vehicle State Logs"} information={stateLogData} />{" "}
            <LogsWindow openLogs={openStatusLogs} setOpenLogs={setOpenStatusLogs} title={"Vehicle Status Logs"} information={statusLogData} />
            <div className='state-container' onClick={() => setOpenStateLogs(true)}>
                <span className='car-state-tooltip'>View state logs</span>

                <h1>Current State</h1>
                <p>
                    <span className='important-color'>{currentState}</span>
                </p>
                <h1>Previous State</h1>
                <p>
                    <span className='important-color'>{previousState}</span>
                </p>
            </div>
            <div className='status-container' onClick={() => setOpenStatusLogs(true)}>
                <span className='car-state-tooltip'>View status logs</span>
                <div>
                    <h1>Current Status</h1>
                    <p style={{ fontSize: "22px" }}>
                        <span className='important-color'>{currentStatus}</span>
                    </p>
                    <p className='set-by'>set by {statuses[5]}</p>
                </div>
                <div className='status-icon'>
                    <img src={statusIcon} />
                </div>
            </div>
        </div>
    );
}
