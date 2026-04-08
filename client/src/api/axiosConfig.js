import axios from "axios";

const axiosConfig = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

axiosConfig.interceptors.request.use((config) => {
  const token = localStorage.getItem(
    "accessToken"
  );

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

axiosConfig.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          "http://localhost:4000/api/auth/refresh-token",
          {},
          { withCredentials: true }
        );

        const newToken = data.accessToken;

        localStorage.setItem(
          "accessToken",
          newToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${newToken}`;

        return axiosConfig(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem(
          "accessToken"
        );

        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosConfig;