const useOptimisticUpdate = ({ initialColor, successColor, callback }) => {
    const [color, setColor] = setState(initialColor);
    const onClick = () => {
        setColor(successColor);
        callback()
            .then((res) => {
                console.log("update successful");
            })
            .catch(() => {
                setColor(initialColor);
                console.log("update unsuccessful");
            });
    };
    return [onClick, color];
};
