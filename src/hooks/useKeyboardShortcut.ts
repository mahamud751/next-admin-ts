import { useEffect } from "react";

const useKeyboardShortcut = () => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!e.key) return;

            const key = e.key.toLowerCase();

            if (e.ctrlKey && e.shiftKey && key === "p") {
                e.preventDefault();
                globalThis.location.assign(
                    `${globalThis.location.pathname}#/v1/productPurchase/create`
                );
            }
        };

        globalThis.addEventListener("keydown", handleKeyDown);
        return () => globalThis.removeEventListener("keydown", handleKeyDown);
    }, []);
};

export default useKeyboardShortcut;
