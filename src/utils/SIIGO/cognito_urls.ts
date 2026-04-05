const base_url = import.meta.env.VITE_COGNITO_URL;
const client_id = import.meta.env.VITE_COGNITO_CLIENT_ID;
const sg_url = import.meta.env.VITE_SG_URL;

export const getCognitoLoginUrl = () => sg_url;

export const getCognitoLogoutUrl = (logout_uri: string) =>
  `${base_url}/logout?client_id=${client_id}&logout_uri=${logout_uri}/logout`;
