import axios from "axios";
import type { ICarousel, ICarouselForm } from "../interfaces/Carousel";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const getAllSlides = async () => {
  try {
    const response = await axios.get(`${API_URL}/carousel`);
    return response.data;
  } catch (error) {
    const axiosError = error as import("axios").AxiosError<{
      message?: string;
    }>;
    throw new Error(
      axiosError.response?.data?.message || "Error al obtener los slides",
    );
  }
};

export const getSlideById = async (id: string): Promise<ICarousel> => {
  try {
    const response = await axios.get(`${API_URL}/carousel/${id}`);
    return response.data;
  } catch (error) {
    const axiosError = error as import("axios").AxiosError<{
      message?: string;
    }>;
    throw new Error(
      axiosError.response?.data?.message || "Error al obtener los slides",
    );
  }
};

export const createSlide = async (data: ICarouselForm): Promise<ICarousel> => {
  try {
    const response = await axios.post(`${API_URL}/carousel`, data);
    return response.data;
  } catch (error) {
    const axiosError = error as import("axios").AxiosError<{
      message?: string;
    }>;
    throw new Error(
      axiosError.response?.data?.message || "Error al crear los slides",
    );
  }
};

export const updateSlide = async (
  id: string,
  data: ICarouselForm,
): Promise<ICarousel> => {
  try {
    const response = await axios.put(`${API_URL}/carousel/${id}`, data);
    return response.data;
  } catch (error) {
    const axiosError = error as import("axios").AxiosError<{
      message?: string;
    }>;
    throw new Error(
      axiosError.response?.data?.message || "Error al crear los slides",
    );
  }
};

export const deleteSlide = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/carousel/${id}`);
    return response.data;
  } catch (error) {
    const axiosError = error as import("axios").AxiosError<{
      message?: string;
    }>;
    throw new Error(
      axiosError.response?.data?.message || "Error al crear los slides",
    );
  }
};
