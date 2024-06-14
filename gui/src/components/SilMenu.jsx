import React, { useEffect, useState } from "react";
import "./SilMenu.css";

// Converts a date string to a Date class instance in UTC timezone
const toUtcDate = (date) => {
    const localDate = new Date(date);
    return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
}

export default function SilMenu({ open, setOpen, publish }) {
    const handleClose = () => {
        setOpen(false);
    };

    const handleInnerClick = (e) => {
        // Check if the click event occurred on the inner child elements
        const isInnerClick = e.target.closest(".sil-menu-container") !== null;

        // Prevent the click event from propagating if it's an inner click
        if (isInnerClick) {
            e.stopPropagation();
        }
    };
    const [errorMsg, setErrorMsg] = useState("");
    const [carId, setCarId] = useState("jetson-orin-1");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");

    // Calls the SIL API with the provided parameters
    const beginSil = (event) => {
        event.preventDefault();

        // Validate car ID input
        if (carId === "") {
            setErrorMsg("Car ID cannot be empty!");
            return;
        } else if (carId.includes(" ")) {
            setErrorMsg("Car ID cannot contain spaces!");
            return;
        } else if (carId.length >= 80) {
            setErrorMsg("Car ID cannot be more than 80 characters!");
            return;
        }

        // Validate start input
        if (start === "") {
            setErrorMsg("Start cannot be empty!");
            return;
        }

        // Validate end input
        if (end === "") {
            setErrorMsg("End cannot be empty!");
            return;
        }

        // Convert start and end to UTC dates
        const startDate = toUtcDate(start);
        const endDate = toUtcDate(end);

        // Ensure that the start date is before the end date
        if (startDate >= endDate) {
            setErrorMsg("Start should be before end!");
            return;
        }

        // Create the URL for the SIL API
        let url = "/sil?car_id=" + carId +
            "&start=" + encodeURIComponent(startDate.toISOString()) +
            "&end=" + encodeURIComponent(endDate.toISOString());

        // Call the SIL API
        fetch(url, {
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
        })
        .then(response => {
            if (response.status == 404) {
                setErrorMsg("No data available for the selected car ID and timespan!");
                throw new Error("SIL response status other than 202: Got " + response.status);
            } else if (response.status == 500) {
                setErrorMsg("SIL API unavailable!");
                throw new Error("SIL response status other than 202: Got " + response.status);
            } else if (response.status != 202) {
                setErrorMsg("Error when calling SIL API!");
                throw new Error("SIL response status other than 202: Got " + response.status);
            }

            return response.json();
        })
        .then(data => {
            // Publish to broker to let the car know to start the SIL process
            publish(
                "sil",
                JSON.stringify({ key: data["key"] })
            );
            console.log("Began SIL for key " + data["key"]);
            setOpen(false);
        })
        .catch(error => console.log(error));
    };

    useEffect(() => {
        setErrorMsg("");
    }, [carId, start, end]);

    return (
        open && (
            <div className='sil-menu-big-container' onClick={handleClose}>
                <div className='sil-menu-container' onClick={handleInnerClick}>
                    <div className='title-and-exit'>
                        <h1>SIL Menu</h1>
                        <div className='close-icon' onClick={handleClose}>
                            &times;
                        </div>
                    </div>
                    <div className='sil-menu-content'>
                        <div className='preferences-row'>
                            <p>Car ID:</p>
                            <div>
                                <form onSubmit={beginSil}>
                                    <input className='car-id-input' onChange={(e) => setCarId(e.target.value)} value={carId}></input>
                                </form>
                            </div>
                        </div>
                        <div className='preferences-row'>
                            <p>Start:</p>
                            <div>
                                <form onSubmit={beginSil}>
                                    <input className='datetime-input' type='datetime-local' onChange={(e) => setStart(e.target.value)}></input>
                                </form>
                            </div>
                        </div>
                        <div className='preferences-row'>
                            <p>End:</p>
                            <div>
                                <form onSubmit={beginSil}>
                                    <input className='datetime-input' type='datetime-local' onChange={(e) => setEnd(e.target.value)}></input>
                                </form>
                            </div>
                        </div>
                        <button onClick={beginSil}>Begin SIL</button>
                        <p className='error-message'>{errorMsg}</p>
                    </div>
                </div>
            </div>
        )
    );
}
