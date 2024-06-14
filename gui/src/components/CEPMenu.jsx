import React, { useEffect, useState } from "react";
import "./CEPMenu.css";

export default function CEPMenu({ open, setOpen, regex, setRegex }) {
    const handleClose = () => {
        setOpen(false);
    };

    const handleInnerClick = (e) => {
        // Check if the click event occurred on the inner child elements
        const isInnerClick = e.target.closest(".cep-menu-container") !== null;

        // Prevent the click event from propagating if it's an inner click
        if (isInnerClick) {
            e.stopPropagation();
        }
    };
    const [errorMsg, setErrorMsg] = useState("");
    const [CEPSequence, setCEPSequence] = useState(regex);

    const validateRegex = (event) => {
        event.preventDefault();

        let isValid = true;
        try {
            new RegExp(CEPSequence);
            setRegex(CEPSequence);
        } catch(e) {
            isValid = false;
        }

        if(!isValid)
            setErrorMsg("Invalid regular expression");
        else
            setOpen(false);
    }

    useEffect(() => {
        setErrorMsg("");
    }, [CEPSequence]);

    return (
        open && (
            <div className='cep-menu-big-container' onClick={handleClose}>
                <div className='cep-menu-container' onClick={handleInnerClick}>
                    <div className='title-and-exit'>
                        <h1>CEP Menu</h1>
                        <div className='close-icon' onClick={handleClose}>
                            &times;
                        </div>
                    </div>
                    <div className='cep-menu-content'>
                        <div className='preferences-row'>
                            <p>Regex:</p>
                            <div>
                                <form onSubmit={validateRegex}>
                                    <input className='car-id-input' onChange={(e) => setCEPSequence(e.target.value)} value={CEPSequence}></input>
                                </form>
                            </div>
                        </div>
                        <div className="cep-ledger">
                            <div className="cep-ledger-info">
                                <h2 className="info-icon">&#9432;</h2>
                                <p>Select regular expression for <b>Complex Event Processing</b>. For example, <it>(c|g)+l+</it> translates to "Multiple CPU or GPU High Load events followed by many Low FPS events.</p>
                            </div>
                            <hr/>
                            <ul className='cep-ledger-ul'>
                                <li>s: Sudden Braking</li>
                                <li>n: Not Reporting</li>
                                <li>u: GPS Not Updating</li>
                                <li>c: CPU High Load</li>
                                <li>g: GPU High Load:</li>
                                <li>l: Low FPS</li>
                            </ul>
                        </div>
                        <button onClick={validateRegex}>Set sequence</button>
                        <p className='error-message'>{errorMsg}</p>
                    </div>
                </div>
            </div>
        )
    );
}
