const sgBaseURL = import.meta.env.VITE_SG_BASE_URL;

export const SIIGO_CHANGE_PASSWORD_URL = `${sgBaseURL}/#/logout?changePassword=`;
export const SIIGO_PORTAL_URL = `${sgBaseURL}/#/portal/accountant`;
export const SIIGO_PORTAL_URL_SHOP = `${sgBaseURL}/#/portal/shop/products`;

export const SIIGO_HELP_URL = {
  SUPPORT: "https://portaldeclientes.aspel.com.mx/",
  CLIENT_PORTAL: "https://portaldeclientes.aspel.com.mx/",
  TRAINING: "https://www.siigo.com/mx/eventos-y-capacitaciones/",
};

export const SIIGO_LOGO_URL = import.meta.env.VITE_APP_LOGO_URL;

