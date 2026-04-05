import { AlertsFields, PermissionFields } from "../constants/Fields";
import http from "./_http";

export const registerNewUser = async (
  name: string,
  email: string,
  phone: string,
  password: string,
  source?: string
) => {
  const payload = {
    name,
    phone,
    email,
    password,
    source_name: source,
  };

  const response = await http.post("/User", payload);
  return response.data;
};

export const refreshToken = async () => {
  const rToken = localStorage.getItem("refreshToken");
  if (rToken) {
    const payload = {
      flow: "REFRESH_TOKEN_AUTH",
      params: {
        REFRESH_TOKEN: rToken,
      },
    };

    const res = await http.post("/User/auth", payload);
    return { idToken: res.data.IdToken, accessToken: res.data.AccessToken };
  }
  throw new Error("Refresh token missing");
};

export const updatePermissions = async (data: {
  emails: string[];
  permissions: { [key: number]: string[] };
}) => {
  try {
    const payload = {
      emails: data.emails,
      permissions: data.permissions,
    };
    const response = await http.put("/Permission", payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.Message);
  }
};

export const authChallenge = async (
  challengeName: string,
  challengeSession: string,
  email: string,
  password: string
) => {
  const payload = {
    challenge_name: challengeName,
    challenge_session: challengeSession,
    email,
    password,
  };
  const res = await http.post("/User/auth_challenge", payload);
  return res.data;
};

export const sendForgotPasswordEmail = async (email: string) => {
  const payload = {
    email,
  };
  const res = await http.post("/User/forgot", payload);
  return res.data;
};

export const resetPassword = async (
  email: string,
  newPassword: string,
  verificationCode: string
) => {
  const payload = {
    email,
    new_password: newPassword,
    verification_code: verificationCode,
  };
  const res = await http.post("/User/confirm_forgot", payload);
  return res.data;
};

export const fetchPermissions = async (companiesIds: number[], options?: SearchOptions) => {
  try {
    // TODO: Remove
    const temporal = ["user.email", "not in", ["admin@sg.com", "main@test.com"]];
    let domainToSend: Domain = [["company_id", "in", companiesIds]];
    if (options?.domain) {
      domainToSend = [...domainToSend, ...options.domain];
    }
    const payload = {
      fuzzy_search: options?.search,
      order_by: options?.orderBy,
      domain: [...domainToSend, temporal],
      limit: options?.limit ?? 9999,
      offset: options?.offset,
      fields: PermissionFields,
    };
    const response = await http.post("/Permission/search", payload);
    return response.data.data as Permission[];
  } catch (error) {
    throw new Error("Error at fetching permissions");
  }
};

export const fetchAlerts = async (workspaceId: number, options?: SearchOptions) => {
  try {
    let domainToSend: Domain = [["workspace_id", "=", workspaceId]];
    if (options?.domain) {
      domainToSend = [...domainToSend, ...options.domain];
    }
    const payload = {
      fuzzy_search: options?.search,
      order_by: options?.orderBy,
      domain: domainToSend,
      limit: options?.limit ?? 0,
      offset: options?.offset,
      fields: AlertsFields,
    };
    const response = await http.post("/Notification/config/search", payload);
    return response.data.data as Alert[];
  } catch (error) {
    throw new Error("Error at fetching alerts");
  }
};

export const updateAlerts = async (workspaceId: number, alerts: { [key: number]: string[] }) => {
  try {
    const payload = {
      workspace_id: workspaceId,
      notifications: alerts,
    };
    const response = await http.put("/Notification/config", payload);
    return response.data;
  } catch (error) {
    throw new Error("Error at updating alerts");
  }
};

export const updateUser = async (values: { name: string }) => {
  try {
    const payload = { values };
    const response = await http.put("/User", payload);
    return response.data;
  } catch (error) {
    throw new Error("Error at update user");
  }
};

export const changePassword = async (values: {
  email: string;
  newPassword: string;
  currentPassword: string;
}) => {
  try {
    const payload = {
      current_password: values.currentPassword,
      new_password: values.newPassword,
      email: values.email,
    };
    const response = await http.post("/User/change_password", payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.Message);
  }
};

export const getUser = async () => {
  try {
    const response = await http.get("/User");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.Message);
  }
};
