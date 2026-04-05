export async function enableMocking() {
  const ENVAR_APP_MOCK = import.meta.env.VITE_MOCKS;
  const APP_MOCKS = ENVAR_APP_MOCK?.trim?.() ?? "";
  const IS_APP_MOCKED = !!APP_MOCKS && APP_MOCKS.toLowerCase() !== "false";

  if (!IS_APP_MOCKED) return;

  const { worker } = await import("./browser");

  await worker.start();
}
