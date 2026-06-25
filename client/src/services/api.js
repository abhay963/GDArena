// Import axios library
import axios from "axios";

// Create a reusable axios instance
// Every request made using "api" will automatically
// use the backend URL defined in .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Export axios instance
// Example:
// import api from "./api";
//
// api.get("/api/start-gd");
// api.post("/api/gd", data);
export default api;