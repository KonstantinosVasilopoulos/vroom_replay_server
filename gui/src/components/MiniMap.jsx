import React from "react";
import { useState, useEffect } from "react";
import "./MiniMap.css";
import mapImg from "../assets/lab-map";
import carImg from "../assets/car-top-livery.png";
import TrafficLight from "./TrafficLight";
import blinker from "../assets/blinker.png";
import blinkerBG from "../assets/blinker-bg.png";
import rb52 from "../assets/Roundabout/rb-52.png";
import rb75 from "../assets/Roundabout/rb-75.png";
import rb81 from "../assets/Roundabout/rb-81.png";
import rb231 from "../assets/Roundabout/rb-231.png";
import rb272 from "../assets/Roundabout/rb-272.png";
import rb343 from "../assets/Roundabout/rb-343.png";
import rbUp from "../assets/Roundabout/rb_up.jpg";
import rbDown from "../assets/Roundabout/rb_down.jpg";
import rbRight from "../assets/Roundabout/rb_right.jpg";
import rbLeft from "../assets/Roundabout/rb_left.jpg";

import { useMQTTSubscribe } from "../utils/Connection";

export default function MiniMap({
    subscribedTopics,
    setSubscribedTopics,
    trackImgSource,
    selectTrack,
    yawInit,
    client,
    TLIDs,
    yaw,
    GPS,
    trafficLights,
    turns,
    roundabtExit,
    node,
    finished,
    GPS_pixel,
}) {
    // const [GPS, setGPS] = useState(GPS);
    // FOR LAB: x:650 y:440
    // FOR COMPETITION: x: 1500 y: 1534
    const [scaleFactor, setScaleFactor] = useState(1);
    // const [imageSize, setImageSize] = useState({ w: 1350, h: 912 });
    const [imageSize, setImageSize] = useState({ w: 1450, h: 966 });
    const [margin, setMargin] = useState({ x: 0, y: 0 });
    const [styleMargin, setStyleMargin] = useState({ x: "0px", y: "0px" });
    const [trafficLightsLocations, setTrafficLightsLocations] = useState({
        tl1: { x: 0, y: 0 },
        tl2: { x: 0, y: 0 },
        tl3: { x: 0, y: 0 },
        tl4: { x: 0, y: 0 },
    });

    const [marginCalc, setMarginCalc] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (selectTrack === "lab") {
            setMarginCalc({
                x: Math.round((GPS.x * imageSize.w) / 650),
                y: Math.round((GPS.y * imageSize.h) / 440),
            });
        } else if (selectTrack === "competition") {
            // setImageSize({ x: 1450, y: 966 });
            setMarginCalc({
                // x: Math.round((GPS.x * imageSize.w) / 1450),
                // y: Math.round((GPS.y * imageSize.h) / 966),
                x: Math.round(GPS_pixel.x),
                y: Math.round(GPS_pixel.y),
            });
        }
    }, [GPS, selectTrack]);
    console.log("GPS in Pixels is:", GPS_pixel);
    console.log("Margin is", marginCalc);

    useEffect(() => {
        setStyleMargin({ x: `-${marginCalc.x}px`, y: `-${marginCalc.y}px` });
    }, [marginCalc]);

    useMQTTSubscribe(client, "traffic-lights-locations", setTrafficLightsLocations, subscribedTopics, setSubscribedTopics);
    return (
        <div className='minimap-container'>
            <img
                className={selectTrack === "lab" ? "minimap-image-lab" : "minimap-image-comp"}
                style={{
                    marginTop: styleMargin.y,
                    marginLeft: styleMargin.x,
                    width: `${imageSize.w}px`,
                    height: `${imageSize.h}px`,
                }}
                src={`data:image/jpeg;base64,${trackImgSource}`}
                // src={mapImg}
                alt='Mini Map'
            ></img>
            <img
                className={selectTrack === "lab" ? "lab-car" : "comp-car"}
                alt='Car'
                src={carImg}
                style={{
                    transform: `rotate(${-(yaw - yawInit / 2 - 90)}deg)`,
                    transition: "all 0.2s",
                }}
            ></img>
            <div className='minimap-node-container'>
                <div className='minimap-node'>
                    <p>{node}</p>
                </div>
            </div>
            {selectTrack === "lab" ? (
                <>
                    <TrafficLight
                        status={trafficLights[0]}
                        x={trafficLightsLocations.tl1.x * 2.1 + 260 - (GPS.x * imageSize.w) / 650}
                        y={trafficLightsLocations.tl1.y * 2.1 + 180 - (GPS.y * imageSize.h) / 440}
                        scale={scaleFactor}
                    />
                    <TrafficLight
                        status={trafficLights[1]}
                        x={trafficLightsLocations.tl2.x * 2.1 + 260 - (GPS.x * imageSize.w) / 650}
                        y={trafficLightsLocations.tl2.y * 2.1 + 180 - (GPS.y * imageSize.h) / 440}
                        scale={scaleFactor}
                    />
                    <TrafficLight
                        status={trafficLights[2]}
                        x={trafficLightsLocations.tl3.x * 2.1 + 260 - (GPS.x * imageSize.w) / 650}
                        y={trafficLightsLocations.tl3.y * 2.1 + 180 - (GPS.y * imageSize.h) / 440}
                        scale={scaleFactor}
                    />
                    <TrafficLight
                        status={trafficLights[3]}
                        x={trafficLightsLocations.tl4.x * 2.1 + 260 - (GPS.x * imageSize.w) / 650}
                        y={trafficLightsLocations.tl4.y * 2.1 + 180 - (GPS.y * imageSize.h) / 440}
                        scale={scaleFactor}
                    />
                </>
            ) : selectTrack === "competition" ? (
                <>
                    <TrafficLight
                        status={trafficLights[0]}
                        x={trafficLightsLocations.tl1.x * 2.1 + 260 - (GPS.x * imageSize.w) / 1450}
                        y={trafficLightsLocations.tl1.y * 2.1 + 180 - (GPS.y * imageSize.h) / 966}
                        scale={scaleFactor}
                    />
                    <TrafficLight
                        status={trafficLights[1]}
                        x={trafficLightsLocations.tl2.x * 2.1 + 260 - (GPS.x * imageSize.w) / 1450}
                        y={trafficLightsLocations.tl2.y * 2.1 + 180 - (GPS.y * imageSize.h) / 966}
                        scale={scaleFactor}
                    />
                    <TrafficLight
                        status={trafficLights[2]}
                        x={trafficLightsLocations.tl3.x * 2.1 + 260 - (GPS.x * imageSize.w) / 1450}
                        y={trafficLightsLocations.tl3.y * 2.1 + 180 - (GPS.y * imageSize.h) / 966}
                        scale={scaleFactor}
                    />
                    <TrafficLight
                        status={trafficLights[3]}
                        x={trafficLightsLocations.tl4.x * 2.1 + 260 - (GPS.x * imageSize.w) / 1450}
                        y={trafficLightsLocations.tl4.y * 2.1 + 180 - (GPS.y * imageSize.h) / 966}
                        scale={scaleFactor}
                    />
                </>
            ) : (
                <></>
            )}
            {finished ? (
                <div className='path-finished-container'>
                    <h1>Path Finished!</h1>
                </div>
            ) : (
                <></>
            )}
            {turns === -1 ? (
                <>
                    <img src={blinkerBG} className='blinker' style={{ transform: "rotate(180deg)" }} alt='left' />
                    <img src={blinker} className='blinker blink' style={{ transform: "rotate(180deg)" }} alt='left' />
                </>
            ) : turns === 0 ? (
                <>
                    <img src={blinkerBG} className='blinker' style={{ transform: "rotate(270deg)" }} alt='straight' />
                    <img src={blinker} className='blinker blink' style={{ transform: "rotate(270deg)" }} alt='straight' />
                </>
            ) : turns === 1 ? (
                <>
                    <img src={blinkerBG} className='blinker' alt='right' />
                    <img src={blinker} className='blinker blink' alt='right' />
                    const
                </>
            ) : (
                <></>
            )}
            {roundabtExit === 333 ? (
                <img src={rbRight} className='rb-img' alt='Roundabout exit' />
            ) : roundabtExit === 335 ? (
                <img src={rbUp} className='rb-img' alt='Roundabout exit' />
            ) : roundabtExit === 338 ? (
                <img src={rbLeft} className='rb-img' alt='Roundabout exit' />
            ) : roundabtExit === 341 ? (
                <img src={rbDown} className='rb-img' alt='Roundabout exit' />
            ) : (
                // ) : roundabtExit === 272 ? (
                //     <img src={rb272} className='rb-img' alt='Roundabout exit' />
                // ) : roundabtExit === 343 ? (
                //     <img src={rb343} className='rb-img' alt='Roundabout exit' />
                // )
                <></>
            )}
        </div>
    );
}
