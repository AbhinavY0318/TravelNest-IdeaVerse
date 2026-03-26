import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
});

export async function extractSchedule(formData) {
  const response = await api.post("/api/extract-schedule", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function fetchPois(params) {
  const response = await api.get("/api/fetch-pois", {
    params,
  });

  return response.data;
}

export async function optimizeItinerary(payload) {
  const response = await api.post("/api/optimize-itinerary", payload);
  return response.data;
}
