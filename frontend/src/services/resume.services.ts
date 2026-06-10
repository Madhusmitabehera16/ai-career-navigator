import api from "@/src/lib/api";

export const uploadResume = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

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