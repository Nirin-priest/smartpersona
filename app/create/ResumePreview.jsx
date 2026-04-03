"use client";
import { useResume } from "./ResumeContext";
import ResumeRenderer from "@/components/ResumeRenderer";

export default function ResumePreview() {
  const { data } = useResume();
  return <ResumeRenderer data={data} />;
}