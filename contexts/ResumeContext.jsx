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

  const setInitialData = (newData) => {
    setData(newData);
  }

  return (
    <ResumeContext.Provider value={{ data, updateData, setInitialData, resumeId, setResumeId }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  return useContext(ResumeContext);
}