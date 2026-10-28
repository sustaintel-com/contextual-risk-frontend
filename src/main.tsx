import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store, persistor } from "./redux-store/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import { SnackbarProvider } from "./Context/SnackbarContext.tsx";
import "./i18n"; // load config ONCE here

// const options = {
//   clientToken: import.meta.env.VITE_O2_CLIENT_TOKEN || "demo",
//   applicationId: "ebs-web",
//   site: "observe.sustaintel.com",
//   organizationIdentifier: "default",
//   service: "ebs-web",
//   env: "production",
//   version: import.meta.env.VITE_APP_VERSION || "1.0.0.0",
//   insecureHTTP: false,
//   apiVersion: "v1",
// };

// if (import.meta.env.PROD) {
//   openobserveRum.init({
//     applicationId: options.applicationId,
//     clientToken: options.clientToken,
//     site: options.site,
//     organizationIdentifier: options.organizationIdentifier,
//     service: options.service,
//     env: options.env,
//     version: options.version,
//     trackResources: true,
//     trackLongTasks: true,
//     trackUserInteractions: true,
//     apiVersion: options.apiVersion,
//     insecureHTTP: options.insecureHTTP,
//     defaultPrivacyLevel: "allow",
//     allowedTracingUrls: [
//       {
//         match: "https://ebs-screen.sustaintel.com/api",
//         propagatorTypes: ["openobserve", "tracecontext"],
//       },
//     ],
//     sessionSampleRate: 100,
//     sessionReplaySampleRate: 50,
//   });

//   openobserveLogs.init({
//     clientToken: options.clientToken,
//     site: options.site,
//     organizationIdentifier: options.organizationIdentifier,
//     service: options.service,
//     env: options.env,
//     version: options.version,
//     forwardErrorsToLogs: true,
//     insecureHTTP: options.insecureHTTP,
//     apiVersion: options.apiVersion,
//   });

//   openobserveRum.startSessionReplayRecording();
// }

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            toastClassName="text-sm"
          />
          <SnackbarProvider position="top-right">
            <App />
          </SnackbarProvider>
  
      </PersistGate>
    </Provider>
  </StrictMode>,
);
