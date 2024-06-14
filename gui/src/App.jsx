import React, { useEffect, useState } from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainScreen from "./screens/MainScreen";
import EventScreen from "./screens/EventScreen";
import mqtt from "mqtt";
import LoadingIcon from "./components/LoadingIcon";
import GUIPreferences from "./components/GUIPreferences";

function App() {
    const [mqttClient, setMqttClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [subscribedTopics, setSubscribedTopics] = useState([]);
    // const brokerIP = "ws://192.168.0.75:8083/mqtt";
    const [brokerIP, setBrokerIP] = useState(localStorage.getItem("brokerIP") ? localStorage.getItem("brokerIP") : "ws://192.168.0.75:8083/mqtt");
    const options = {};
    const [openSettings, setOpenSettings] = useState(false);
    useEffect(() => {
        if (!mqttClient) {
            const client = mqtt.connect(brokerIP, options);

            client.on("connect", () => {
                console.log("Connected to MQTT broker");
                setConnected((prev) => !prev);
                setMqttClient(client);
            });

            client.on("error", (error) => {
                console.error("Connection error:", error);
                setConnected((prev) => !prev);
            });
        }

        return () => {
            // Clean up when component unmounts
            if (mqttClient) {
                mqttClient.end();
                setMqttClient(null);
                setConnected((prev) => !prev);
            }
        };
    }, []); // Only run when first opening the app

    return (
        <>
            {mqttClient ? (
                <Router>
                    <Routes>
                        <Route path="/" element={<MainScreen client={mqttClient} subscribedTopics={subscribedTopics} setSubscribedTopics={setSubscribedTopics} brokerIP={brokerIP} setBrokerIP={setBrokerIP} />} />
                        <Route path="/events" element={<EventScreen brokerIP={brokerIP} setBrokerIP={setBrokerIP}/>} />
                    </Routes>
                </Router>
            ) : (
                <div className='loading-app'>
                    <GUIPreferences open={openSettings} setOpen={setOpenSettings} brokerIP={brokerIP} setBrokerIP={setBrokerIP} />
                    <p>Connecting to MQTT client...</p>
                    <LoadingIcon />
                    <button onClick={() => setOpenSettings(true)}>GUI Settings</button>
                </div>
            )}
        </>
    );
}

export default App;
