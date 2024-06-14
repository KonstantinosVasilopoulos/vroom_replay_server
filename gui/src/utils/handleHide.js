export default async function handleHide(setHiddenComponents, name) {
    await setHiddenComponents((prevState) =>
        prevState.map((component) => {
            if (component.name === name) {
                return { ...component, isHidden: true };
            }
            return component;
        })
    );
    await setTimeout(() => {
        setHiddenComponents((prevState) =>
            prevState.map((component) => {
                if (component.name === name) {
                    return {
                        ...component,
                        display: "none",
                    };
                }
                return component;
            })
        );
    }, 1000);
}
