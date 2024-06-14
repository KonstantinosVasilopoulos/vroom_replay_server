import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import currentTime from "../utils/currentTime";

export default function Charts({ graphData }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        setData((prevData) => {
            // Concatenate the new data with the previous data
            const newData = [
                ...prevData,
                {
                    name: currentTime(),
                    [graphData.fps_1_source]: graphData.fps_1_value,
                    [graphData.fps_2_source]: graphData.fps_2_value,
                    [graphData.fps_3_source]: graphData.fps_3_value,
                    [graphData.fps_4_source]: graphData.fps_4_value,
                    [graphData.fps_5_source]: graphData.fps_5_value,
                },
            ];

            // Keep only the last 100 entries
            return newData.slice(-100);
        });
    }, [graphData]);

    return (
        <LineChart
            width={600}
            height={350}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray='3 3' fill='#0C1017' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip
                contentStyle={{
                    backgroundColor: "#0C1017",
                    border: "1px solid #31363c",
                    borderRadius: "15px",
                }}
            />
            <Legend />
            <Line type='monotone' dataKey={graphData.fps_1_source} stroke='#f49097' strokeWidth={2} isAnimationActive={false} dot={false} />
            <Line type='monotone' dataKey={graphData.fps_2_source} stroke='#dfb2f4' strokeWidth={2} isAnimationActive={false} dot={false} />
            <Line type='monotone' dataKey={graphData.fps_3_source} stroke='#f5e960' strokeWidth={2} isAnimationActive={false} dot={false} />
            <Line type='monotone' dataKey={graphData.fps_4_source} stroke='#f2f5ff' strokeWidth={2} isAnimationActive={false} dot={false} />
            <Line type='monotone' dataKey={graphData.fps_5_source} stroke='#55d6c2' strokeWidth={2} isAnimationActive={false} dot={false} />
        </LineChart>
    );
}
