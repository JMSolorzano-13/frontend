import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import esES from "antd/lib/locale/es_ES";
import reportWebVitals from "./reportWebVitals";
import { store } from "./store/store";
import "./ant.less";

import { setupInterceptors } from "./api/_http";
import { tailwindColors } from "@utils/tailwindColors";
import { worker } from "src/mocks/browser";
import { IS_SIIGO } from "@utils/SIIGO/Global";

if (IS_SIIGO) {
  import("./index.scss");
} else {
  import("./ezindex.scss");
}

async function startApp() {
  if (import.meta.env.VITE_MOCKS) {
    // This is for mocking API calls in development mode
    await worker.start();
  }

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  //   <Provider store={store}>
  //     <ConfigProvider locale={esES}>
  //       <App />
  //     </ConfigProvider>
  //   </Provider>
  // </React.StrictMode>
  <Provider store={store}>
    <ConfigProvider
      locale={esES}
      theme={{
        token: IS_SIIGO
          ? {
              colorPrimary: tailwindColors.sg_primary["500"],
              fontFamily: "NunitoSans, sans-serif",
              // Sucess
              colorSuccess: tailwindColors.sg_success["200"],
              colorSuccessBg: "rgba(44,168,127, 0.1)",
              colorSuccessBorder: tailwindColors.sg_success[200],
              // Warning
              colorWarning: tailwindColors.sg_warning["200"],
              colorWarningBg: "rgba(229,138,0, 0.1)",
              colorWarningBorder: tailwindColors.sg_warning[200],
              // Error
              colorError: tailwindColors.sg_error["200"],
              colorErrorBg: "rgba(220,38,38, 0.1)",
              colorErrorBorder: tailwindColors.sg_error[200],
              // Info
              colorInfo: tailwindColors.sg_info["200"],
              colorInfoBg: "rgba(62,201,214, 0.1)",
              colorInfoBorder: tailwindColors.sg_info[200],
            }
          : {
              colorPrimary: tailwindColors.primary,
              fontFamily: "roboto, sans-serif",
            },
      }}
    >
      <App />
    </ConfigProvider>
  </Provider>
);

  setupInterceptors(store);

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
}

// Start the app
startApp();
