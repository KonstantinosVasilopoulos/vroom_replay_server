import React, { useEffect, useState } from "react";
import "./GUIPreferences.css";

export default function GUIPreferences({ open, setOpen, brokerIP, setBrokerIP }) {
    const handleClose = () => {
        setOpen(false);
    };

    const handleInnerClick = (e) => {
        // Check if the click event occurred on the inner child elements
        const isInnerClick = e.target.closest(".gui-preferences-container") !== null;

        // Prevent the click event from propagating if it's an inner click
        if (isInnerClick) {
            e.stopPropagation();
        }
    };
    const [errorMsg, setErrorMsg] = useState("");
    const [newIP, setNewIP] = useState("");

    const saveChanges = (event) => {
        event.preventDefault();
        if (newIP === "") {
            setOpen(false);
            return;
        } else if (!newIP.includes("/") || !newIP.includes(":")) {
            setErrorMsg("Invalid IP Address!");
            return;
        } else {
            setBrokerIP("ws://" + newIP);
            localStorage.setItem("brokerIP", "ws://" + newIP);
            location.reload();
        }
    };

    useEffect(() => {
        setErrorMsg("");
    }, [newIP]);

    return (
        open && (
            <div className='gui-preferences-big-container' onClick={handleClose}>
                <div className='gui-preferences-container' onClick={handleInnerClick}>
                    <div className='title-and-exit'>
                        <h1>GUI Preferences</h1>
                        <div className='close-icon' onClick={handleClose}>
                            &times;
                        </div>
                    </div>
                    <div className='gui-preferences-content'>
                        <div className='preferences-row'>
                            <p>Current Broker IP Address: </p>
                            <p className='important-color'>{brokerIP}</p>
                        </div>
                        <div className='preferences-row'>
                            <p>Change Broker IP Address:</p>
                            <div>
                                <form onSubmit={saveChanges}>
                                    ws:// <input className='ip-input' onChange={(e) => setNewIP(e.target.value)} placeholder='ip address : port /mqtt'></input>
                                </form>
                            </div>
                        </div>
                        <button onClick={saveChanges}>Save Changes</button>
                        <p className='error-message'>{errorMsg}</p>
                    </div>
                </div>
            </div>
        )
    );
}
