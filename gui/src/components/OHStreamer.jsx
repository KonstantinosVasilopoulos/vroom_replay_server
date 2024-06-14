import React, { useEffect, useState } from "react";
import "./OHStreamer.css";
import LogsWindow from "./LogsWindow";
import currentTime from "../utils/currentTime";

export default function OHStreamer({ streamData }) {
    const [openOHLogs, setOpenOHLogs] = useState();
    const [OHLogInfo, setOHLogInfo] = useState([]);

    useEffect(() => {
        if (streamData.name !== OHLogInfo[OHLogInfo.length - 1]?.name) {
            setOHLogInfo((prev) => [
                ...prev,
                {
                    time: currentTime(),
                    name: streamData.name,
                    streamId: streamData.streamId,
                    x: streamData.x,
                    y: streamData.y,
                },
            ]);
        }
    }, [streamData]);

    return (
        <div
            className='ohstreamer-container'
            onClick={(e) => {
                e.stopPropagation();
                setOpenOHLogs(true);
            }}
        >
            <LogsWindow openLogs={openOHLogs} setOpenLogs={setOpenOHLogs} title={"OH Streamer Logs"} information={OHLogInfo} />
            <div className='oh-title'>OH Streamer</div>

            <div className='oh-content-row'>
                <span className='oh-tooltip'>View OH Streamer logs</span>
                <p>
                    <span className='important-color'>{streamData.name}</span>
                </p>
                <p>
                    Id: <span className='important-color'>{streamData.streamId}</span>
                </p>
            </div>
            <div className='oh-content-row'>
                <p>
                    x: <span className='important-color'>{streamData.x}</span>
                </p>
                <p>
                    y: <span className='important-color'>{streamData.y}</span>
                </p>
            </div>
        </div>
    );
}
