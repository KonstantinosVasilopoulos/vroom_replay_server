import React, { useEffect, useState } from "react";
import "./Detections.css";
import signs from "../utils/signs";
import carIcon from "../assets/icons/car.png";
import obstacleIcon from "../assets/icons/caution.png";
import pedestrianIcon from "../assets/icons/pedestrian-icon.png";

// detected={[totalData.signs, totalData.vehicles, totalData.obstacles, totalData.pedestrians]
export default function Detections({ detected }) {
    const detectedSigns = detected[0];
    const detectedVehicles = detected[1];
    const detectedObstacles = detected[2];
    const detectedPedestrians = detected[3];
    const [currentSign, setCurrentSign] = useState(signs.noSign);

    useEffect(() => {
        switch (detectedSigns?.name) {
            case "Crosswalk":
                setCurrentSign(signs.crosswalk);
                break;
            case "HighwayEnd":
                setCurrentSign(signs.highwayExit);
                break;
            case "HighwayStart":
                setCurrentSign(signs.highway);
                break;
            case "NoEntry":
                setCurrentSign(signs.noEntry);
                break;
            case "Ahead":
                setCurrentSign(signs.oneway);
                break;
            case "ParkingSpot":
                setCurrentSign(signs.parking);
                break;
            case "PriorityRoad":
                setCurrentSign(signs.priority);
                break;
            case "Roundabout":
                setCurrentSign(signs.roundabout);
                break;
            case "Stop":
                setCurrentSign(signs.stop);
                break;
            default:
                setCurrentSign(signs.noSign);
                break;
        }
    }, [detectedSigns]);

    return (
        <div className="detections-container">
            <div className="detections-row">
                <div className="detection-box gray">
                    <h1>Signs</h1>
                    <img alt="sign" className="sign-img" src={currentSign} />
                    <div
                        style={{
                            display: "flex",
                            width: "60%",
                            justifyContent: "space-between",
                        }}
                    >
                        <p>Distance: </p>
                        <p>
                            <span className="important-color">
                                {detectedSigns?.distance}mm
                            </span>
                        </p>
                    </div>
                </div>
                <div className="detection-box ">
                    <div className="detection-content">
                        <div
                            className={
                                detectedVehicles?.distance > 0
                                    ? "detection-content-row active-detection"
                                    : "detection-content-row"
                            }
                        >
                            <div className="detection-content-column">
                                <h1>Vehicles</h1>
                                <span className="important-color">
                                    {detectedVehicles?.distance}mm
                                </span>
                            </div>
                            <img src={carIcon}></img>
                        </div>
                    </div>
                    <div className="detection-content">
                        <div
                            className={
                                detectedObstacles?.distance > 0
                                    ? "detection-content-row active-detection"
                                    : "detection-content-row"
                            }
                        >
                            <div className="detection-content-column">
                                <h1>Obstacles</h1>
                                <span className="important-color">
                                    {detectedObstacles?.distance}mm
                                </span>
                            </div>
                            <img src={obstacleIcon}></img>
                        </div>
                    </div>
                    <div className="detection-content">
                        <div
                            className={
                                detectedPedestrians?.distance > 0
                                    ? "detection-content-row active-detection"
                                    : "detection-content-row"
                            }
                        >
                            <div className="detection-content-column">
                                <h1>Pedestrians</h1>
                                <span className="important-color">
                                    {detectedPedestrians?.distance}mm
                                </span>
                            </div>
                            <img src={pedestrianIcon}></img>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
