import axios from "axios";

const UPLOAD_URL = import.meta.env.VITE_BACKEND_URL + "/upload";

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await axios.post(`${UPLOAD_URL}/image`, formData);
  return response.data.url;
};

export const uploadVideo = async (file: File) => {
  const formData = new FormData();
  formData.append("video", file);
  const response = await axios.post(`${UPLOAD_URL}/video`, formData);
  return response.data.url;
};
