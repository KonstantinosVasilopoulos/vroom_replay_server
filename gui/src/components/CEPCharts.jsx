import React, { useRef, useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "./CEPCharts.css";

export default function CEPCharts({ data, setData, regex, setRegex }) {
    const [connect, setConnect] = useState(true);
    const didMount = useRef(false);

    // Set dynamic chart width
    const width = window.innerWidth * 0.65;

    const options = {
        timeZone: "Europe/Athens",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    };
    const chartXStart  = new Date(new Date().getTime() - 60000).toLocaleString("en-US", options);
    const chartXEnd = new Date().toLocaleString("en-US", options);

    let websocket = null;

    const connectApi = () => {
        // Connect to Events API
        websocket = new WebSocket("/cep?car_id=jetson-orin-1&regex=" + encodeURIComponent(regex));

        // Continuously read events
        websocket.onmessage = (message) => {
            // Filter out PING messages
            if (message.data != "PING") {
                // Parse events
                let events = JSON.parse(message.data);

                // Redraw chart
                let newData = [];
                for (let i = 0; i < events.length; i++) {
                    newData.push({
                        name: new Date(events[i].name * 1000).toLocaleString("en-US", options),
                        [regex]: events[i][regex],
                    });
                }

                setData(newData);

            } else {
                console.log("Received PING from CEP API.");
            }

            // Send ACK message
            websocket.send("ACK");
        };

        // Connection lost event handling
        websocket.onclose = () => {
            console.log("Websocket lost connection");
            setConnect(true);
        };
    }

    useEffect(() => {
        if (connect) {
            console.log("Reconnecting to CEP API");
            connectApi();
            setConnect(false);
        }
    }, [connect]);

    useEffect(() => {
        // Return early if this is the first render
        if (!didMount.current) {
            didMount.current = true;
            return;
        }

        console.log("Restarting CEP with new regex: " + regex);
        if (websocket != null) {
            websocket.close();
        }
        setConnect(true);
    }, [regex]);

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
            <YAxis allowDecimals={false} domain={[0, 1]} />
            <Tooltip
                contentStyle={{
                    backgroundColor: "#0C1017",
                    border: "1px solid #31363c",
                    borderRadius: "15px",
                }}
            />
            <Legend />
            <Area type="monotone" dataKey={regex} stackId="1" stroke="#f49097" fill="#f49097" />
        </AreaChart>
    );
}
