"use client";

import { useEffect, useRef } from "react";

export default function DocsPage() {
  const swaggerContainer = useRef(null);

  useEffect(() => {
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = "https://unpkg.com/swagger-ui-dist@4/swagger-ui.css";
    document.head.appendChild(cssLink);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/swagger-ui-dist@4/swagger-ui-bundle.js";
    script.onload = () => {
      if (typeof window !== "undefined" && window.SwaggerUIBundle && swaggerContainer.current) {
        window.SwaggerUIBundle({
          url: "/api/openapi",
          domNode: swaggerContainer.current,
          presets: [window.SwaggerUIBundle.presets.apis],
          layout: "BaseLayout",
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      if (cssLink.parentNode) cssLink.parentNode.removeChild(cssLink);
      if (script.parentNode) script.parentNode.removeChild(script);
      if (swaggerContainer.current) swaggerContainer.current.innerHTML = "";
    };
  }, []);

  return (
    <main style={{ padding: "1rem" }}>
      <h1>Swagger UI (Next.js)</h1>
      <div ref={swaggerContainer} />
    </main>
  );
}
