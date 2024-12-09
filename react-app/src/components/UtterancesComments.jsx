import {useEffect, useRef} from "react";
import data from '../stores/data.json'

const UtterancesComments = () => {
  const commentsRef = useRef(null);
  
  useEffect(() => {
    if (!data.isEnableComments) return;
    const currentRef = commentsRef.current;
    if (!currentRef) return;

    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.setAttribute("repo", data.repo);
    script.setAttribute("issue-term", "pathname");
    script.setAttribute("theme", data.theme);
    script.crossOrigin = "anonymous";
    script.async = true;

    commentsRef.current.appendChild(script);

    return () => {
      if (commentsRef) {
        currentRef.innerHTML = "";
      }
    };

  }, []);
  
  return <div ref={commentsRef} />;
};

export default UtterancesComments;