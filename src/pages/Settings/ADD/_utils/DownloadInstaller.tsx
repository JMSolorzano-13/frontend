export function handleDownload() {
  const installerURL = import.meta.env.VITE_REACT_APP_LINK_INSTALLER_PASTOCORP;

  const link = document.createElement("a");
  if (installerURL) {
    link.href = installerURL;
    link.click();
  }
}
