import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./EventScreen.css";
import EventsCharts from "../components/EventsCharts";
import CEPCharts from "../components/CEPCharts";
import GUIPreferences from "../components/GUIPreferences";
import MiniMap from "../components/MiniMap";
import mapImg from "../assets/lab-map";
import CEPMenu from "../components/CEPMenu";
import { saveAs } from "file-saver";

export default function EventScreen({ client, subscribedTopics, setSubscribedTopics, brokerIP, setBrokerIP }) {
    const navigate = useNavigate();
    const [openCEPMenu, setOpenCEPMenu] = useState(false);
    const [openGUIPreferences, setOpenGUIPreferences] = useState(false);
    const [events, setEvents] = useState([]);
    const [data, setData] = useState([]);
    const [regex, setRegex] = useState("(c|s)+");

    const [totalData, setTotalData] = useState({
        yaw: 0.0,
        gps_x: 0.0,
        gps_y: 0.0,
        min_node: -1,
        node_x: 0.0,
        node_y: 0.0,
        node: -1,
        finished: false,
        intersection_turn: 2,
        roundabout_exit: -1,
        tl1: 0,
        tl2: 0,
        tl3: 0,
        tl4: 0,
        tl5: 0,
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

    // Exports an array of JSON objects into a JSON file
    const exportCSV = (toExport, prefix) => {
        // Convert events array to JSON string with indentation
        const json = JSON.stringify(toExport, null, 2);
        const blob = new Blob([json], { type: "application/json;charset=utf-8;" });

        // Use the current date as the name of the file
        const options = {
            timeZone: "Europe/Athens",
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        };
        const currentTime = new Date().toLocaleString("en-GB", options);
        saveAs(blob, prefix + currentTime + ".json");
    };

    return (
        <div className="eventscreen-container">
            <CEPMenu
                open={openCEPMenu}
                setOpen={setOpenCEPMenu}
                regex={regex}
                setRegex={setRegex}
            />
            <GUIPreferences
                open={openGUIPreferences}
                setOpen={setOpenGUIPreferences}
                brokerIP={brokerIP}
                setBrokerIP={setBrokerIP}
            />
            <div className="eventscreen-row">
                <button
                    className="back-buttons"
                    style={{
                        opacity: 0,
                        width: "11rem",
                        margin: "0.5rem",
                        border: "2px #366CFF solid",
                        cursor: "default",
                    }}
                    onClick={() => {console.log("You found me!")}}
                >
                    Back
                </button>
                <div className="mainscreen-column">
                    <h1
                        className="vroomitor-title"
                        onClick={() => setOpenGUIPreferences(true)}
                    >
                        vroomitor
                    </h1>
                </div>
                <button
                    className="back-buttons"
                    style={{
                        width: "11rem",
                        margin: "0.5rem",
                        border: "2px #366CFF solid",
                    }}
                    onClick={() => navigate('/')}
                >
                    Back
                </button>
            </div>
            <div className="eventscreen-row">
                <EventsCharts events={events} setEvents={setEvents} />
            </div>
            <div className="eventscreen-row">
            <CEPCharts data={data} setData={setData} regex={regex} setRegex={setRegex} />
            <div className="eventscreen-column">
                <button
                    className="eventscreen-menu-item-row-1"
                    onClick={() => setOpenCEPMenu(true)}
                >
                    CEP Menu
                </button>
                <MiniMap
                    subscribedTopics={subscribedTopics}
                    setSubscribedTopics={setSubscribedTopics}
                    trackImgSource={trackData.trackImgSource}
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
                    ]}
                    turns={totalData.intersection_turn}
                    roundabtExit={totalData.roundabout_exit}
                    node={totalData.node}
                    finished={totalData.finished}
                    GPS_pixel={{ x: totalData.gps_x, y: totalData.gps_y }}
                />
                <div className="eventscreen-export-buttons">
                    <button
                        className="eventscreen-menu-item-row-1"
                        onClick={() => exportCSV(events, "events_")}
                    >
                        Export Events JSON
                    </button>
                    <button
                        className="eventscreen-menu-item-row-1"
                        onClick={() => exportCSV(data, "cep_events_")}
                    >
                        Export CEP JSON
                    </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
