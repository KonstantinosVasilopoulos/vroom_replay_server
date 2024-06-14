import React, { useEffect, useRef } from "react";
import "./LogsWindow.css";

export default function LogsWindow({ openLogs, setOpenLogs, title, information }) {
    const divRef = useRef(null);

    useEffect(() => {
        // Get the div element and set its scrollTop to the maximum value
        const div = divRef.current;
        // div.scrollTop = div.scrollHeight;
    }, [information]);

    const handleClose = (e) => {
        // Check if the click event occurred on the inner child elements
        const isInnerClick = e.target.closest(".log-window") || e.target.closest(".close-log-btn");

        // Prevent the click event from propagating if it's an inner click
        if (isInnerClick) {
            e.stopPropagation();
        }
    };

    return (
        <>
            {openLogs ? (
                <div className='big-log-container' onClick={() => setOpenLogs(false)}>
                    <div className='logs-container' onClick={handleClose}>
                        <div className='close-on-click-away'></div>
                        <div className='log-window'>
                            <div className='close-log-btn'>
                                <p
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenLogs(false);
                                    }}
                                >
                                    {" "}
                                    &times;
                                </p>
                            </div>
                            <div className='log-title'>{title}</div>
                            <div className='log-terminal' ref={divRef}>
                                {information.map((item, index) => (
                                    <div className='log-entry' key={index}>
                                        {Object.entries(item).map(([key, value]) => (
                                            <div key={key} className={key === "time" ? "log-time" : "log-indiv"}>
                                                {key === "time" ? `${value}` : `${key}: `}
                                                {key !== "time" ? (
                                                    <span
                                                        style={{
                                                            color: "#bf70ff",
                                                        }}
                                                    >
                                                        {value}
                                                    </span>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
}
