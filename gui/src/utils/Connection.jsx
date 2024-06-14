// export default function Connection({
//     url,
//     topic,
//     onMessage,
//     publishedMessage,
//     pubTopic,
//     options,
// }) {
//     const pubMsgRef = useRef("Initial");
//     const [isConnected, setIsConnected] = useState(false);
//     useEffect(() => {
//         if (!mqttClient) {
//             mqttClient = mqtt.connect(url, options);

import { useEffect } from "react";

//             mqttClient.on("connect", () => {
//                 console.log("Connected to MQTT broker");
//                 setIsConnected(true);
//             });

//             mqttClient.on("error", (error) => {
//                 console.error("Connection error:", error);
//                 setIsConnected(false);
//             });
//         }

//         return () => {
//             // Clean up when component unmounts
//             if (mqttClient) {
//                 mqttClient.end();
//                 mqttClient = null;
//                 setIsConnected(false);
//             }
//         };
//     }, [url, options, topic]); // Only re-run if URL or options change

//     if (isConnected && mqttClient) {
//         // Subscribe to topic only when connected
//         mqttClient.subscribe(topic, (err) => {
//             if (err) {
//                 console.error(`Error subscribing to topic: ${topic}`, err);
//             } else {
//                 console.log(`Subscribed to topic: ${topic}`);
//             }
//         });
//     }

//     useEffect(() => {
//         // Handle incoming messages

//         if (isConnected && mqttClient) {
//             mqttClient.on("message", (receivedTopic, payload) => {
//                 if (receivedTopic === topic) {
//                     onMessage(JSON.parse(payload.toString()));
//                 }
//             });
//         }

//         return () => {
//             // Clean up message event listener
//             if (mqttClient) {
//                 mqttClient.removeAllListeners("message");
//             }
//         };
//     }, [isConnected, mqttClient, topic, onMessage]); // Only re-run if connection status or client changes

//     useEffect(() => {
//         // Publish message
//         if (
//             isConnected &&
//             mqttClient &&
//             JSON.stringify(publishedMessage) !==
//                 JSON.stringify(pubMsgRef.current)
//         ) {
//             mqttClient.publish(
//                 `/topic/${pubTopic}`,
//                 JSON.stringify(publishedMessage)
//             );
//             pubMsgRef.current = publishedMessage;
//         }
//     }, [isConnected, mqttClient, pubTopic, publishedMessage]); // Only re-run if connection status or client changes

//     return null;
// }

// function useMQTTSubscribe(client, topic, onMessage) {
//     useEffect(() => {
//         if (!client || !client.connected) return;

//         const handleMsg = (receivedTopic, message) => {
//             if (receivedTopic === topic) {
//                 onMessage(JSON.parse(message.toString()));
//             }
//         };
//         client.subscribe(topic);
//         console.log("Subscribed on:", topic);
//         client.on("message", handleMsg);
//         return () => {
//             client.unsubscribe(topic);
//             client.off("message", handleMsg);
//         };
//     }, [client, topic, onMessage]);
// }

// function useMQTTSubscribe(client, topic, onMessage) {
//     const handleMsg = (receivedTopic, message) => {
//         if (receivedTopic === topic) {
//             onMessage(JSON.parse(message.toString()));
//         }
//     };

//     const subscribe = () => {
//         // Check if the client exists and is connected
//         if (client && client.connected) {
//             // Subscribe to the topic
//             client.subscribe(topic, (err) => {
//                 if (err) {
//                     console.error("Error subscribing to MQTT topic:", err);
//                 } else {
//                     console.log("Subscribed to MQTT topic:", topic);
//                 }
//             });

//             // Add message event listener
//             client.on("message", handleMsg);
//         }
//     };

//     console.log("Run for", client);
//     subscribe();

//     // Clean up subscription
//     // return () => {
//     //     if (client && client.connected && typeof client.unsubscribe === "function") {
//     //         client.unsubscribe(topic);
//     //     }
//     //     if (client && typeof client.off === "function") {
//     //         client.off("message", handleMsg);
//     //     }
//     // };
// }

function useMQTTSubscribe(client, topic, onMessage, subscribedTopics, setSubscribedTopics) {
    useEffect(() => {
        if (!client || !client.connected) return;
        if (subscribedTopics.includes(topic)) return;
        const handleMsg = (receivedTopic, message) => {
            if (receivedTopic === topic) {
                // console.log(JSON.parse(message.toString()));
                onMessage(JSON.parse(message.toString()));
            }
        };
        client.subscribe(topic);
        setSubscribedTopics((prevTopics) => [...prevTopics, topic]);

        console.log(`Connected to ${topic}`);
        client.on("message", handleMsg);

        return () => {
            client.unsubscribe(topic);
            client.off("message", handleMsg);
        };
    }, [client, topic, onMessage]);
}

function useMQTTPublish(client) {
    const publish = (topic, message, options = {}) => {
        if (client && client.connected) {
            client.publish(topic, message, options);
        }
    };
    return publish;
}

export { useMQTTSubscribe, useMQTTPublish };
