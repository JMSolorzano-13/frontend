export const IS_SIIGO = import.meta.env.VITE_COGNITO_CLIENT_ID ? true : false;

const skipB2C = import.meta.env.VITE_SKIP_B2C;

export const NEEDS_EZ_LOGIN = skipB2C && skipB2C === '1' ? true : false;
