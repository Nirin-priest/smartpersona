"use client";
import { createContext, useState, useContext } from "react";

const ResumeContext = createContext();

export function ResumeProvider({ children }) {
  const [resumeId, setResumeId] = useState(null); // เก็บ id หลังจาก save ครั้งแรก

  const [data, setData] = useState({
    config: { template: "classic" },
    personal: { firstName: "", lastName: "", email: "", phone: "", address: "", profilePic: "" },
    education: { degree: "", institution: "", gradYear: "", gpa: "" },
    experience: { company: "", position: "", details: "" },
    summary: { details: "" },
    skills: { list: "" }
  });

  const updateData = (section, field, value) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  return (
    <ResumeContext.Provider value={{ data, updateData, resumeId, setResumeId }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  return useContext(ResumeContext);
}