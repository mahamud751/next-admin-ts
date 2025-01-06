import { useEffect, useRef } from "react";

const useEffectOnDependencyChange = (effect, deps) => {
    const initializedRef = useRef(false);

    useEffect(
        () => {
            if (initializedRef.current) {
                effect();
            } else {
                initializedRef.current = true;
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        deps.map((dep) => JSON.stringify(dep))
    );
};

export default useEffectOnDependencyChange;
