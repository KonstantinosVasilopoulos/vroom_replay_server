import React from "react";
import "./Hardware.css";
import hardwareIcon from "../assets/icons/motherboard.png";
export default function Hardware({ cpu, gpu, current, power }) {
    return (
        <div className="hardware-container">
            <div className="hardware-title">
                <h1>Hardware</h1>
                <img
                    src={hardwareIcon}
                    alt="hardware icon"
                    className="hardware-title-icon"
                />
            </div>
            <div className="hardware-content-container">
                <div className="hardware-content">
                    <span className="tooltip">
                        Graphics Processing Unit usage
                    </span>
                    <p>GPU:</p>
                    <p>
                        <span className="important-color">
                            {Math.round(gpu)}%
                        </span>
                    </p>
                </div>
                <div className="hardware-content">
                    <span className="tooltip">
                        Central Processing Unit usage
                    </span>
                    <p>CPU:</p>
                    <p>
                        <span className="important-color">
                            {Math.round(cpu)}%
                        </span>
                    </p>
                </div>
                {/* <div className='hardware-content'>
                    <span className='tooltip'>Jetson Current usage</span>
                    <p>Current:</p>
                    <p>
                        <span className='important-color'>{current}mA</span>
                    </p>
                </div> */}
                <div className="hardware-content">
                    <span className="tooltip">Jetson Power usage</span>
                    <p>Power:</p>
                    <p>
                        <span className="important-color">{power}mW</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
