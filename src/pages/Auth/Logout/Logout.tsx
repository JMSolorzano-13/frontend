import { eraseCookie } from "@utils/cookies";
import { getCognitoLogoutUrl } from "@utils/SIIGO/cognito_urls";

export default function Logout() {
  // borramos tokens del localstorage
  const sgBaseURL = import.meta.env.VITE_SG_BASE_URL;
  eraseCookie("token");
  eraseCookie("refreshToken");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("pathnameRedirect");
  localStorage.removeItem("locationSearchRedirect");
  const redirect_requested = localStorage.getItem("redirect_requested");

  // guardamos el redirect_uri enviado desde sigo en la URL
  // const redirect_uri = new URLSearchParams(location.search).get("redirect_uri");

  // if (redirect_uri) {
  //   localStorage.setItem("redirect_uri", redirect_uri);
  // }

  if (!redirect_requested) {
    // Si no se ha solicitado redirect lo seteamos y cerramos sesión en cognito redirigiendo a nosotros mismos
    localStorage.setItem("redirect_requested", "true");
    const self_uri = window.location.origin;
    if (self_uri) window.location.href = getCognitoLogoutUrl(self_uri);
  } else {
    // Si ya se solicitó redirect borramos la variable y redirigimos a siigo para cierre de sesión
    localStorage.removeItem("redirect_requested");
    window.location.href = `${sgBaseURL}/#/logout`;
  }

  // cerramos sesión en cognito

  return null;
}
