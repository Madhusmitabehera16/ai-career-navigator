import api from "@/src/lib/api";

export const uploadResume = async (
  file: File,
  companyName: string,
  roleTitle: string,
  jobDescription: string
) => {
  const formData = new FormData();

  formData.append("resume", file);
  formData.append("companyName", companyName);
  formData.append("roleTitle", roleTitle);
  formData.append("jobDescription", jobDescription);

  // Debug: Log the exact fields being sent
  console.log("Form data fields being sent:");
  for (let [key, value] of formData.entries()) {
    console.log(`- ${key}: ${value instanceof File ? value.name : value}`);
  }

  const response = await api.post(
    "/resume/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const parseResume = async (resumeId: string) => {
  const response = await api.post(
    `/resume/parse/${resumeId}`
  );

  return response.data;
};