import axios from "../api/axiosConfig.js";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // ========================
  // Restore user on refresh
  // ========================
  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    try {
      if (
        storedUser &&
        storedUser !== "undefined"
      ) {
        const parsedUser =
          JSON.parse(storedUser);

        setUser(parsedUser);
      }
    } catch (error) {
      console.error(
        "Invalid user in localStorage:",
        error
      );

      localStorage.removeItem(
        "user"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ========================
  // Login
  // ========================
  const login = async (formData) => {
    try {
      const { data } = await axios.post(
        "/auth/login",
        formData
      );
      console.log("LOGIN RESPONSE:", data);
  
      const userData =
        data.user || data.data?.user;
  
      const token =
        data.accessToken ||
        data.data?.accessToken;
  
      if (data.success && userData) {
        localStorage.setItem(
          "accessToken",
          token
        );
  
        localStorage.setItem(
          "user",
          JSON.stringify(userData)
        );
  
        setUser(userData);
        return { success: true };
      }
  
      return {
        success: false,
        message: "Invalid response",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message,
      };
    }
  };
  // ========================
  // Register
  // ========================
  const register =
    async (formData) => {
      try {
        const { data } =
          await axios.post(
            "/auth/register",
            formData
          );

        console.log(
          "REGISTER RESPONSE:",
          data
        );

        if (
          data.success &&
          data.user
        ) {
          localStorage.setItem(
            "accessToken",
            data.accessToken
          );

          localStorage.setItem(
            "user",
            JSON.stringify(
              data.user
            )
          );

          setUser(data.user);

          return {
            success: true,
          };
        }

        return {
          success: false,
          message:
            "Invalid register response",
        };
      } catch (error) {
        return {
          success: false,
          message:
            error.response
              ?.data
              ?.message ||
            "Register failed",
        };
      }
    };

  // ========================
  // Logout
  // ========================
  const logout = async () => {
    try {
      const { data } =
        await axios.post(
          "/auth/logout"
        );

      localStorage.removeItem(
        "accessToken"
      );

      localStorage.removeItem(
        "user"
      );

      setUser(null);

      return {
        success: true,
        message:
          data.message ||
          "Logged out",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data
            ?.message ||
          "Logout failed",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);