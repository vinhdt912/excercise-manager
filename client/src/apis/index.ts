import axios from "axios";
import { Exercise } from "../types/excercise";
import { Exam } from "../types/exam";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getExercises = (params: any) => API.get("/exercises", { params });
export const createExercise = (data: Exercise) => API.post("/exercises", data);
export const updateExercise = (id: string, data: Exercise) =>
  API.put(`/exercises/${id}`, data);
export const deleteExercise = (id: string) => API.delete(`/exercises/${id}`);
export const getExerciseById = (id: string) => API.get(`/exercises/${id}`);

// Exam APIs
export const getExams = (params: any) => API.get("/exams", { params });
export const createExam = (data: Exam) => API.post("/exams", data);
export const updateExam = (id: string, data: Exam) =>
  API.put(`/exams/${id}`, data);
export const deleteExam = (id: string) => API.delete(`/exams/${id}`);
export const getExamById = (id: string) => API.get(`/exams/${id}`);
