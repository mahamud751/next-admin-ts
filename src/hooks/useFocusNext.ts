import { KeyboardEvent, useCallback, useRef } from "react";

const useFocusNext = () => {
    const controls = useRef([]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            controls.current = controls.current
                .filter((control: Node | null) =>
                    document.body.contains(control)
                )
                .sort((a: { compareDocumentPosition: (arg0) => number }, b) =>
                    a.compareDocumentPosition(b) &
                    Node.DOCUMENT_POSITION_FOLLOWING
                        ? -1
                        : 1
                );
            const index = controls.current.indexOf(e.target);
            const next = controls.current[index + 1];
            next && next.focus();
            e.preventDefault();
        }
    };

    const focusNextRef = useCallback((element) => {
        if (element && !controls.current.includes(element)) {
            controls.current.push(element);
            element.addEventListener("keydown", handleKeyDown);
        }
    }, []);

    return focusNextRef;
};

export default useFocusNext;
