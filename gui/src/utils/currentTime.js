function currentTime() {
    const now = new Date();
    const options = {
        timeZone: "Europe/Athens",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    };
    const currentTime = now.toLocaleString("en-US", options);
    return currentTime;
}

export default currentTime;
