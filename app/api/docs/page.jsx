'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// swagger-ui-react must only render client-side
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });
import 'swagger-ui-react/swagger-ui.css';

export default function SwaggerDocsPage() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    fetch('/api/docs/swagger.json')
      .then((r) => r.json())
      .then(setSpec)
      .catch(console.error);
  }, []);

  return (
    <>
      <style>{`
        /* Reset Next.js layout interference for the docs page */
        body { margin: 0; }
        .swagger-ui .topbar { background-color: #1e40af; }
        .swagger-ui .topbar-wrapper img { display: none; }
        .swagger-ui .topbar-wrapper::after {
          content: 'SmartPersona Admin API';
          color: #fff;
          font-size: 1.2rem;
          font-weight: 700;
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#fafafa' }}>
        {!spec ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
              fontFamily: 'sans-serif',
              color: '#555',
            }}
          >
            Loading API documentation…
          </div>
        ) : (
          <SwaggerUI spec={spec} docExpansion="list" deepLinking />
        )}
      </div>
    </>
  );
}
