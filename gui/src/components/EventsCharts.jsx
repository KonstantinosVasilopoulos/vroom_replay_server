import React, { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import currentTime from "../utils/currentTime";
import "./EventsCharts.css";

export default function EventsCharts({events, setEvents}) {
    const [connect, setConnect] = useState(true);
    const [data, setData] = useState([]);

    // Set dynamic chart width
    const width = window.innerWidth * 0.93;

    const latestEventEndThreshold = 300000; // millis

    const options = {
        timeZone: "Europe/Athens",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    };
    const chartXStart  = new Date(new Date().getTime() - 60000).toLocaleString("en-US", options);
    const chartXEnd = new Date().toLocaleString("en-US", options);

    const connectApi = () => {
        // Connect to Events API
        const websocket = new WebSocket("/events?car_id=jetson-orin-1");

        // Continuously read events
        websocket.onmessage = (message) => {
            // Filter out PING messages
            if (message.data != "PING") {
                // Parse event
                let event = JSON.parse(message.data);
                setEvents((prevEvents) => {
                    // Filter out old events more than latestEventEndThreshold millis in the past
                    const filteredPreviousEvents = prevEvents.filter((e) => {
                        const currentTime = new Date().getTime();
                        const eventEnd = e.end * 1000 + latestEventEndThreshold;
    
                        return eventEnd > currentTime;
                    });
    
                    const newEvents = [
                        ...filteredPreviousEvents,
                        {
                            start: event.start,
                            end: event.end,
                            event_type: event.event_type,
                        },
                    ];

                    return newEvents;
                });

            } else {
                console.log("Received PING from Events API.");
            }

            // Send ACK message
            websocket.send("ACK");
        };
    
        // Connection lost event handling
        websocket.onclose = () => {
            console.log("Websocket lost connection");
            setConnect(true);
        };
    };

    useEffect(() => {
        connectApi();
    }, []);

    useEffect(() => {
        if (connect) {
            console.log("Reconnecting to Events API");
            connectApi();
            setConnect(false);
        }
    }, [connect]);

    // Redraw the events chart everytime the events array changes
    useEffect(() => {
        // Find the minimum start and maximum end in events
        let minStart = new Date().getTime() / 1000;
        let maxEnd = -1;
        for (let i = 0; i < events.length; i++) {
            if (events[i].start < minStart) {
                minStart = events[i].start;
            }

            if (events[i].end > maxEnd) {
                maxEnd = events[i].end;
            }
        }

        // Create events for intervals
        let newData = [];
        while (minStart <= maxEnd) {
            const granularitySecs = 5;
            const newMinStart = minStart + granularitySecs;

            // Find if events exists within [minStart, newMinStart)
            let suddenBrakingStatus = 0;
            let notReportingStatus = 0;
            let gpsNotUpdatingStatus = 0;
            let cpuHighLoadStatus = 0;
            let gpuHighLoadStatus = 0;
            let lowFpsStatus = 0;
            for (let i = 0; i < events.length; i++) {
                const timeCondition = minStart >= events[i].start && minStart <= events[i].end;
                switch (events[i].event_type) {
                    case "suddenBraking":
                        if (timeCondition) {
                            suddenBrakingStatus = 1;
                        }
                        break;
                    case "notReporting":
                        if (timeCondition) {
                            notReportingStatus = 1;
                        }
                        break;
                    case "gpsNotUpdating":
                        if (timeCondition) {
                            gpsNotUpdatingStatus = 1;
                        }
                        break;
                    case "cpuHighLoad":
                        if (timeCondition) {
                            cpuHighLoadStatus = 1;
                        }
                        break;
                    case "gpuHighLoad":
                        if (timeCondition) {
                            gpuHighLoadStatus = 1;
                        }
                        break;
                    case "lowFps":
                        if (timeCondition) {
                            lowFpsStatus = 1;
                        }
                        break;
                }
            }

            newData.push({
                name: new Date(minStart * 1000).toLocaleString("en-US", options),
                suddenBraking: suddenBrakingStatus,
                notReporting: notReportingStatus,
                gpsNotUpdating: gpsNotUpdatingStatus,
                cpuHighLoad: cpuHighLoadStatus,
                gpuHighLoad: gpuHighLoadStatus,
                lowFps: lowFpsStatus,
            });

            minStart = newMinStart;
        }

        setData(newData);
    }, [events]);

    return (
        <AreaChart
            width={width}
            height={350}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" fill='#0C1017'/>
            <XAxis dataKey="name" allowDecimals={false} domain={[chartXStart, chartXEnd]} />
            <YAxis allowDecimals={false} domain={[0, 6]} />
            <Tooltip
                contentStyle={{
                    backgroundColor: "#0C1017",
                    border: "1px solid #31363c",
                    borderRadius: "15px",
                 }}
            />
            <Legend />
            <Area type="monotone" dataKey="suddenBraking" stackId="1" stroke="#f49097" fill="#f49097" />
            <Area type="monotone" dataKey="notReporting" stackId="1" stroke="#dfb2f4" fill="#dfb2f4" />
            <Area type="monotone" dataKey="gpsNotUpdating" stackId="1" stroke="#f5e960" fill="#f5e960" />
            <Area type="monotone" dataKey="cpuHighLoad" stackId="1" stroke="#f2f5ff" fill="#f2f5ff" />
            <Area type="monotone" dataKey="gpuHighLoad" stackId="1" stroke="#55d6c2" fill="#55d6c2" />
            <Area type="monotone" dataKey="lowFps" stackId="1" stroke="#55D682" fill="#55D682" />
        </AreaChart>
    );
}
