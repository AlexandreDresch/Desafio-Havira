import axios from "axios";

const usersInstance = axios.create({
  baseURL: import.meta.env.VITE_API_KEY,
  headers: {
    "Content-type": "application/json",
  },
});

const geolocationInstance = axios.create({
  baseURL: import.meta.env.VITE_GEOLOCATION_API_KEY,
  headers: {
    "Content-type": "application/json",
  },
});

export default { usersInstance, geolocationInstance };
