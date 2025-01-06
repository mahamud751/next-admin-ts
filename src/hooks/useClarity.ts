import { useEffect } from "react";

const useClarity = () => {
    useEffect(() => {
        if (process.env.REACT_APP_NODE_ENV !== "production") return;

        const clarityKey = process.env.REACT_APP_MS_CLARITY_KEY;

        if (!clarityKey)
            return console.warn("Microsoft Clarity Project ID is not set!");

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${clarityKey}");
    `;

        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);
};

export default useClarity;
