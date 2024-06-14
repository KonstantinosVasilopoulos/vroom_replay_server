import React, { useState } from "react";
import "./CarConfig.css";
import config from "../utils/CarConfig";
import { useMQTTPublish, useMQTTSubscribe } from "../utils/Connection";
export default function CarConfig({ open, setOpen, client, subscribedTopics, setSubscribedTopics, carConfig, setCarConfig }) {
    const publish = useMQTTPublish(client);

    const [success, setSuccess] = useState("");

    const [expandedCategory, setExpandedCategory] = useState(null);

    const handleCategoryClick = (category) => {
        if (expandedCategory === category) {
            setExpandedCategory(null);
        } else {
            setExpandedCategory(category);
        }
    };

    const handleSave = () => {
        publish("car-settings-msg", JSON.stringify(carConfig));
        setSuccess("Config Updated Successfully!");
        setTimeout(() => {
            setOpen(false);
        }, 2000);
    };
    useMQTTSubscribe(client, "car-settings", setCarConfig, subscribedTopics, setSubscribedTopics);
    return (
        open && (
            <div className='car-config-big-container'>
                <div className='car-config-container'>
                    <div className='title-and-exit'>
                        <h1>Car Configuration</h1>
                        <div
                            className='close-icon'
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            &times;
                        </div>
                    </div>
                    <div className='car-config-content'>
                        <div className='config-category'>
                            {Object.keys(carConfig).map((category) => (
                                <div key={category}>
                                    <h2 className={expandedCategory == category ? "active-category" : ""} key={category} onClick={() => handleCategoryClick(category)}>
                                        {category}
                                    </h2>
                                </div>
                            ))}
                        </div>
                        {Object.keys(carConfig).map((category) => (
                            <>
                                {expandedCategory === category && (
                                    <div className='category-options-container'>
                                        {Object.entries(carConfig[category]).map(([key, value]) => (
                                            <div className='category-options-row'>
                                                <p>{key}</p>
                                                <input
                                                    type='text'
                                                    id={key}
                                                    name={key}
                                                    value={value}
                                                    readOnly={value === "ON" || value === "OFF"}
                                                    onClick={() => {
                                                        if (value === "ON" || value === "OFF") {
                                                            setCarConfig((prevConfig) => ({
                                                                ...prevConfig,
                                                                [expandedCategory]: {
                                                                    ...prevConfig[expandedCategory],
                                                                    [key]: value === "ON" ? "OFF" : "ON",
                                                                },
                                                            }));
                                                        }
                                                    }}
                                                    onChange={(event) =>
                                                        setCarConfig((prevConfig) => ({
                                                            ...prevConfig,
                                                            [expandedCategory]: {
                                                                ...prevConfig[expandedCategory],
                                                                [key]: event.target.value,
                                                            },
                                                        }))
                                                    }
                                                    style={
                                                        value === "ON" || value === "OFF"
                                                            ? {
                                                                  cursor: "pointer",
                                                              }
                                                            : {}
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ))}
                        <button onClick={handleSave}>Save Changes</button>
                        <p className='success-message'>{success}</p>
                    </div>
                </div>
            </div>
        )
    );
}
