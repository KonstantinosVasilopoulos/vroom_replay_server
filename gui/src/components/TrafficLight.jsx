import React, { useEffect, useState } from "react";
import "./TrafficLight.css";

export default function TrafficLight({ status, x, y, scale }) {
    const [color, setColor] = useState("red");
    const [scaleFactor, setScaleFactor] = useState("scale(1)");
    useEffect(() => {
        setColor(status === 0 ? "red" : status === 1 ? "yellow" : status === 2 ? "green" : "");
        setScaleFactor(`scale(${scale})`);
    }, [status]);

    return (
        <div
            className='trafffic-positioning'
            style={{
                position: "absolute",
                top: y,
                left: x,
                transition: "all 0.2s",
                transform: scaleFactor,
            }}
        >
            <div className='traffic-light-wrapper'>
                <div className='traffic-light-container'>
                    <div
                        className='light'
                        style={{
                            backgroundColor: color === "green" ? "#44ff00" : "#454545",
                        }}
                    ></div>
                    <div
                        className='light'
                        style={{
                            backgroundColor: color === "yellow" ? "#ffe600" : "#454545",
                        }}
                    ></div>
                    <div
                        className='light'
                        style={{
                            backgroundColor: color === "red" ? "#ff0000" : "#454545",
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
