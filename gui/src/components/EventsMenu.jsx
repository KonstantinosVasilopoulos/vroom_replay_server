import React, { useState } from "react";
import "./EventsMenu.css";

export default function EventsMenu({ open, setOpen }) {
    const [eventStates, setEventStates] = useState(Array(6).fill(false));

    const handleToggleEvent = (index) => {
        setEventStates(prevStates => {
            const newStates = [...prevStates];
            newStates[index] = !newStates[index];
            return newStates;
        });
    };

    return (
        open && (
            <div className="car-config-big-container">
                <div className="car-config-container">
                    <div className="title-and-exit">
                        <h1>Car Configuration</h1>
                        <div
                            className="close-icon"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            &times;
                        </div>
                    </div>
                    <div className="car-config-content">
                        <div className="events-toggle-menu">
                            {eventStates.map((state, index) => (
                                <button
                                    key={index}
                                    className={`event-button ${state ? "active" : ""}`}
                                    onClick={() => handleToggleEvent(index)}
                                >
                                    Event {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}
