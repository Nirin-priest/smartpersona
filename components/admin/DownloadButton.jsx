"use client";

export default function DownloadButton({ className, children, message = "Report generation started! \n\n(This is a mock functionality for the startup template)" }) {
  return (
    <button 
      className={className}
      onClick={() => alert(message)}
    >
      {children}
    </button>
  );
}
