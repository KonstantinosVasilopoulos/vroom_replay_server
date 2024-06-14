import { React, useEffect, useReducer, useState } from "react";
import "./Camera.css";
import Annotations from "./Annotations";
import vroomLoading from "../assets/vroom_cam_1";
import settingsImg from "../assets/settings.png";
import { useMQTTSubscribe, useMQTTPublish } from "../utils/Connection";

export default function Camera({ client, subscribedTopics, setSubscribedTopics }) {
    const [showSettings, setShowSettings] = useState(false);
    const [checked, setChecked] = useState(false);
    const [annotations, setAnnotations] = useState([
        { name: "signs", value: true },
        { name: "vehicles", value: true },
        { name: "lanes", value: true },
        { name: "pedestrians", value: true },
        { name: "obstacles", value: true },
        { name: "horizontals", value: true },
        { name: "obs_mask", value: true },
    ]);

    const [display, setDisplay] = useState({ frame: vroomLoading.toString() });
    const [camera, setCamera] = useState("Stable");
    const [shouldSend, setShouldSend] = useState(false);
    const onCameraChange = () => {
        if (camera === "Stable") {
            setCamera("Rotating");
            console.log(camera);
        } else {
            setCamera("Stable");
            console.log(camera);
        }
        setShouldSend(true);
    };

    const handleSwitch = () => {
        setChecked((prev) => !prev);
        console.log(checked);
        setShouldSend(true);
    };

    // const handleFrame = (newFrame) => {
    //     setDisplay(newFrame.frame);
    // };

    const published_msg = {
        source: camera,
        frame: checked ? "Depth" : "RGB",
    };

    useMQTTSubscribe(client, "frame", setDisplay, subscribedTopics, setSubscribedTopics);

    const publish = useMQTTPublish(client);
    useEffect(() => {
        if (shouldSend) {
            publish("select-frame", JSON.stringify(published_msg));
            setShouldSend(false);
        }
    }, [shouldSend]);

    useEffect(() => {
        const annotations_send = {};
        annotations.forEach((item) => {
            annotations_send[item.name] = item.value;
        });
        publish("annotations", JSON.stringify(annotations_send));
    }, [annotations]);

    return (
        <div className='camera-and-settings'>
            {/* <Connection url={brokerIP} topic={"example/frame"} onMessage={handleFrame} publishedMessage={published_msg} pubTopic='select-frame-pub' /> */}
            <div className='camera-settings-container'>
                <img onClick={() => setShowSettings((prev) => !prev)} src={settingsImg} alt='Camera Settings' className='settings-image'></img>
            </div>
            {showSettings ? (
                <div className='camera-settings'>
                    <div className='choose-frame'>
                        <p>Stable</p>
                        <label className='switch'>
                            <input type='checkbox' onClick={onCameraChange} />
                            <span className='slider round'></span>
                        </label>
                        <p>Rotating</p>
                    </div>
                    <div className='choose-frame'>
                        <Annotations annotations={annotations} setAnnotations={setAnnotations} />
                    </div>

                    {camera === "Stable" && (
                        <div className='choose-frame'>
                            <p>RGB</p>
                            <label className='switch'>
                                <input type='checkbox' onClick={handleSwitch} />
                                <span className='slider round'></span>
                            </label>
                            <p>Depth</p>
                        </div>
                    )}
                    <img onClick={() => setShowSettings((prev) => !prev)} src={settingsImg} alt='Camera Settings' width='30px' style={{ cursor: "pointer", marginRight: "1rem" }}></img>
                </div>
            ) : (
                <></>
            )}
            <div className='camera-container'>
                <img className='camera-frame' src={`data:image/jpeg;base64,${display.frame}`} alt='Main Camera' />
            </div>
        </div>
    );
}
