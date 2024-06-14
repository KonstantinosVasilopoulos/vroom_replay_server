import React, { useEffect, useRef, useState } from "react";
import "./Map.css";

//MAX_X = 650 MAX_Y=440
export default function Map({
    trackImgSource,
    selectTrack,
    coordinatesGPS,
    coordinatesNode,
    location,
    node,
    trackData,
}) {
    const [canvasDimensions, setCanvasDimensions] = useState({
        x: 650,
        y: 440,
    });
    const [shouldClear, setShouldClear] = useState(false);

    useEffect(() => {
        if (selectTrack === "lab") {
            setCanvasDimensions({ x: 650, y: 440 });
            // setCanvasDimensions({ x: 1038, y: 702 });
        } else if (selectTrack === "competition") {
            setCanvasDimensions({ x: 1450, y: 966 });
        }
    }, [selectTrack]);

    useEffect(() => {
        setShouldClear(true);
        console.log("CLEAR");
    }, [trackData]);

    const canvasRef = useRef(null);

    useEffect(() => {
        function drawGPS(ctx) {
            ctx.fillStyle = "#FF0000";
            ctx.beginPath();

            ctx.arc(coordinatesGPS.x, coordinatesGPS.y, 3, 0, 2 * Math.PI);
            ctx.fill();
        }
        function drawNode(ctx) {
            if (selectTrack === "lab") {
                ctx.fillStyle = "#34e1eb";
            }
            if (selectTrack === "competition") {
                ctx.fillStyle = "#fff000";
            }

            ctx.beginPath();
            ctx.arc(coordinatesNode.x, coordinatesNode.y, 8, 0, 2 * Math.PI);
            ctx.fill();
        }
        function clearCanvas(ctx) {
            ctx.beginPath();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (shouldClear) {
            clearCanvas(context);
            console.log("Canvas cleared");
        }

        //Our draw come here
        drawGPS(context);
        drawNode(context);
        if (shouldClear) {
            setShouldClear(false);
        }
    }, [
        coordinatesGPS,
        coordinatesNode,
        trackImgSource,
        selectTrack,
        shouldClear,
    ]);

    return (
        <div className="map-parent-container">
            <div className="map-container">
                {/* <Connection url={brokerIP} topic='path-frame' onMessage={handleTrackImage} /> */}
                <canvas
                    id="mycanvas"
                    ref={canvasRef}
                    width={canvasDimensions.x}
                    height={canvasDimensions.y}
                    style={{
                        backgroundImage: `url(data:image/jpeg;base64,${trackImgSource})`,
                    }}
                    className={
                        selectTrack === "lab"
                            ? "lab-track"
                            : selectTrack === "competition"
                            ? "competition-track"
                            : ""
                    }
                ></canvas>
            </div>
            <div className="gps-info">
                <div className="coordinates-container">
                    <p>
                        X: <span className="important-color">{location.x}</span>
                    </p>
                    <p>
                        Y: <span className="important-color">{location.y}</span>
                    </p>
                </div>
                <div className="coordinates-container">
                    <p>
                        Node: <span className="important-color">{node}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
