"use client";

import { useEffect } from "react";

export default function ChatWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://badboyblack-agentic-rag-customer-service-ui.hf.space/copilot/index.js";
    script.onload = () => {
        // @ts-ignore
      window.mountChainlitWidget({
        chainlitServer:
          "https://badboyblack-agentic-rag-customer-service-ui.hf.space",
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}