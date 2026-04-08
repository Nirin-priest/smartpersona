"use client";
import { useResume } from "@/contexts/ResumeContext";
import ResumeRenderer from "@/components/ResumeRenderer";

export default function ResumePreview() {
  const { data } = useResume();
  return <ResumeRenderer data={data} />;
}