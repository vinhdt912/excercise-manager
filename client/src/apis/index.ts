import axios from "axios";
import { Exercise } from "../types/excercise";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getExercises = (params: any) => API.get("/exercises", { params });
export const createExercise = (data: Exercise) => API.post("/exercises", data);
export const updateExercise = (id: string, data: Exercise) =>
  API.put(`/exercises/${id}`, data);
export const deleteExercise = (id: string) => API.delete(`/exercises/${id}`);
export const getExerciseById = (id: string) => API.get(`/exercises/${id}`);
