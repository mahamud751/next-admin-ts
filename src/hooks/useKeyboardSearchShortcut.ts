import { useEffect } from "react";

const useKeyboardSearchShortcut = (handleClickOpen) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!e.key) return;

            const key = e.key.toLowerCase();

            if (e.ctrlKey && e.shiftKey && key === "s") {
                e.preventDefault();
                handleClickOpen();
            }
        };

        globalThis.addEventListener("keydown", handleKeyDown);
        return () => globalThis.removeEventListener("keydown", handleKeyDown);
    }, [handleClickOpen]);
};

export default useKeyboardSearchShortcut;
