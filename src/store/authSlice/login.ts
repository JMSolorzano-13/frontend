import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchConfig } from "@api/config";
import { fetchLicense } from "@api/sales";
import http, { setToken } from "@api/_http";
import { DEFAULT_USER_CONFIG } from "@constants/Extra";
import { getCurrentCompanyAndWorkspace } from "@rules/UserDataHelper";
import { logout } from "./index";
import { setCookie } from "@utils/cookies";
import { IS_SIIGO, NEEDS_EZ_LOGIN } from "@utils/SIIGO/Global";

type Credentials = {
  email?: string;
  password?: string;
  token?: string;
  code?: string;
};

type TokenData = {
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token: string;
  id_token: string;
  AccessToken: string;
  ExpiresIn: number;
  TokenType: string;
  RefreshToken: string;
  IdToken: string;
};

type LoginData = {
  userData: UserData;
  license: License | null;
  addEnabled: boolean;
  token: string;
  defaultWorkspace: { id: string; oldId: number } | null;
  workspace: string | null;
  oldWorkspace: number | null;
  company: string | null;
  oldCompany: number | null;
  config: UserConfig;
};

type RejectData = {
  message?: string;
  email?: string;
  status?: number;
  challengeName?: string;
  challengeSession?: string;
  customMessage?: string;
};

// Check if we're in local development mode
const IS_LOCAL_DEV = import.meta.env.VITE_REACT_APP_BASE_URL?.includes('localhost');

const login = createAsyncThunk<LoginData, Credentials, { rejectValue: RejectData }>(
  "auth/login",
  async (credentials, { rejectWithValue, dispatch }) => {
    const { token, email, password, code } = credentials;
    const payload = {
      flow: "USER_PASSWORD_AUTH",
      params: {
        USERNAME: email != null ? String(email).trim().toLowerCase() : "",
        PASSWORD: password,
      },
    };
    try {
      let aToken = token;
      if (!aToken) {
        let tokenData: TokenData;
        try {
          // Use local dev authentication if in local mode
          if (IS_LOCAL_DEV && email) {
            const response = await http.post("/dev/login", { email });
            tokenData = {
              IdToken: response.data.idToken,
              AccessToken: response.data.accessToken,
              RefreshToken: response.data.refreshToken,
              ExpiresIn: response.data.expiresIn,
              TokenType: response.data.tokenType,
              access_token: response.data.accessToken,
              id_token: response.data.idToken,
              refresh_token: response.data.refreshToken,
              expires_in: response.data.expiresIn,
              token_type: response.data.tokenType,
            };
          } else if (IS_SIIGO && !NEEDS_EZ_LOGIN && code) {
            tokenData = (await http.get(`/User/auth/${code}`)).data;
          } else {
            tokenData = (await http.post("/User/auth", payload)).data;
          }
        } catch (e: any) {
          const statusCode = e.request.status;
          const errorMessage = e.response.data.Message;
          const errorLogin = e.response.data.state;
          // #region agent log
          fetch("http://127.0.0.1:7595/ingest/58a2cefb-c472-4635-9044-4240e60cb4df", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "28c9f7" },
            body: JSON.stringify({
              sessionId: "28c9f7",
              location: "login.ts:User/auth-error",
              message: "POST /User/auth failed",
              data: {
                hypothesisId: "H-auth",
                status: statusCode,
                code: e.response?.data?.Code,
                msg: errorMessage,
              },
              timestamp: Date.now(),
            }),
          }).catch(() => {});
          // #endregion
          dispatch(logout());
          if (statusCode === 428) {
            const { challenge_name, challenge_session } = JSON.parse(e.request.response);
            return rejectWithValue({
              email,
              status: statusCode,
              challengeName: challenge_name,
              challengeSession: challenge_session,
            });
          }
          if (statusCode === 403 && errorLogin) {
            return rejectWithValue({
              message: "Error en el inicio de sesión ",
              status: statusCode,
              customMessage: errorLogin,
            });
          }
          if (
            errorMessage === "Invalid credentials" ||
            e.response.data.includes("Incorrect username or password")
          ) {
            return rejectWithValue({
              message:
                "Error de credenciales, nombre de Usuario y/o Contraseña incorrectos, verifica e intenta de nuevo",
              status: statusCode,
            });
          }
          console.error(
            "Error login in with token. Either token is invalid or an unexpected error occurred.",
            e
          );
          return rejectWithValue({
            message: "Error al iniciar sesión",
            status: statusCode,
          });
        }

        const wasOIDC = IS_SIIGO && !NEEDS_EZ_LOGIN && Boolean(code);
        aToken = wasOIDC ? tokenData.id_token : tokenData.IdToken;
        localStorage.setItem(
          "refreshToken",
          wasOIDC ? tokenData.refresh_token : tokenData.RefreshToken
        );
        setCookie("token", aToken ?? tokenData.IdToken);
      }
      setToken(aToken);
      let userData: UserData | null = null;
      try {
        userData = (await http.get("/User/")).data as UserData;
      } catch (error) {
        console.error("Token has expired. Logging out.", error);
        dispatch(logout());
        return rejectWithValue({ message: "La sesión ha expirado" });
      }
      const {
        currentWorkspace,
        currentCompany,
        oldCurrentWorkspace,
        oldCurrentCompany,
        userWorkspace,
      } = getCurrentCompanyAndWorkspace(userData);
      let userConfig: UserConfig = DEFAULT_USER_CONFIG;
      if (currentCompany) {
        try {
          const config = await fetchConfig(currentCompany);
          userConfig = config as UserConfig;
          if (!userConfig.tableColumns) {
            userConfig.tableColumns = {};
          }

          if (!Array.isArray(userConfig.dashboardIds)) {
            const widgets = userConfig.dashboardIds as NewWidgets;
            const getTrueKeys = (data: NewWidgets): string[] => {
              const trueKeys: string[] = [];

              for (const key in data) {
                if (data[key as keyof NewWidgets]) {
                  trueKeys.push(key);
                }
              }

              for (const key of DEFAULT_USER_CONFIG.dashboardIds) {
                if (data[key as keyof NewWidgets] === undefined) {
                  trueKeys.push(key);
                }
              }

              return trueKeys;
            };

            const result = getTrueKeys(widgets);
            userConfig.dashboardIds = result;
          } else {
            userConfig.dashboardIds = [
              ...userConfig.dashboardIds,
              "nominal-income",
              "improved-IVA",
            ];
          }
        } catch {
          console.warn("User config not found, generating default config");
        }
      }
      let license: License | null = null;
      let addEnabled = false;

      if (currentWorkspace && !IS_SIIGO) {
        try {
          license = await fetchLicense(currentWorkspace);
        } catch {
          console.warn("License data not found, working with default license behavior");
        }
      }
      if (currentWorkspace && userData) {
        addEnabled = userData.access[currentWorkspace].license.details.add_enabled;
      } else if (license && !IS_SIIGO) {
        addEnabled = license.add_enabled;
      }
      setCookie("token", aToken, 7);

      return {
        userData,
        license,
        addEnabled,
        token: aToken,
        defaultWorkspace: userWorkspace ?? null,
        workspace: currentWorkspace ?? null,
        oldWorkspace: oldCurrentWorkspace ?? null,
        company: currentCompany ?? null,
        oldCompany: oldCurrentCompany ?? null,
        config: userConfig,
      };
    } catch (e: any) {
      if (e.message.includes("User has no workspace")) {
        console.error("An unexpected error ocurred during login: ", e);
        dispatch(logout());
        return rejectWithValue({ message: "No hay workspace" });
      } else {
        console.error("An unexpected error ocurred during login: ", e);
        dispatch(logout());
        return rejectWithValue({ message: "Vuelva a iniciar sesión" });
      }
    }
  }
);

export default login;
