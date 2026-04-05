import { EnhancedStore } from "@reduxjs/toolkit";
import axios, { InternalAxiosRequestConfig } from "axios";
import { logout } from "../store/authSlice";
import { removeAllCompanies } from "@store/companySlice";
import { getCognitoLoginUrl } from "@utils/SIIGO/cognito_urls";
import { eraseCookie, getCookie, setCookie } from "@utils/cookies";
import { SIIGO_PORTAL_URL } from "@utils/SIIGO/urls";
import { IS_SIIGO, NEEDS_EZ_LOGIN } from "@utils/SIIGO/Global";
import { refreshToken } from "./user";

const http = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL,
  timeout: 30000,
});

/* const HTTP = setupCache(http, {
  cacheTakeover: false,
}); */

export const setToken = (token: string) => {
  http.defaults.headers.common.access_token = token;
  setCookie("token", token, 7);
};

export const clearToken = () => {
  http.defaults.headers.common.access_token = null;
  eraseCookie("token");
  localStorage.removeItem("token");
};

export const setupInterceptors = (store: EnhancedStore) => {
  http.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const tokenToUse = config.url?.includes("change_password")
        ? localStorage.getItem("access_token")
        : getCookie("token");

      if (tokenToUse) {
        config.headers.access_token = tokenToUse;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  http.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;

      if (err.response) {
        if (
          err.response.status === 401 &&
          err.response.data.Message === "Invalid token" &&
          !originalConfig.retry
        ) {
          originalConfig.retry = true;

          if (IS_SIIGO && !NEEDS_EZ_LOGIN) {
            console.info("ERROR RETRYING", err.response);
            window.location.href = getCognitoLoginUrl();
          } else {
            try {
              const newAccessToken = await refreshToken();
              // localStorage.setItem("token", newAccessToken.idToken);
              localStorage.setItem("access_token", newAccessToken.accessToken);
              setToken(newAccessToken.idToken);
              originalConfig.headers.access_token = newAccessToken;

              return http(originalConfig);
            } catch (error) {
              store.dispatch(logout());
              store.dispatch(removeAllCompanies());
              throw new Error("Sesión expirada");
            }
          }
        } else if (err.response.status === 401 && originalConfig.retry) {
          store.dispatch(logout());
          store.dispatch(removeAllCompanies());
          if (IS_SIIGO && !NEEDS_EZ_LOGIN) {
            window.location.href = SIIGO_PORTAL_URL;
          }
          throw new Error("Sesión expirada");
        }
      }
      throw err;
    }
  );
};

export default http;
