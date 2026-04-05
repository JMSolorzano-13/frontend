import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import * as P from "./constants/PageIds";
import ProtectedRoute from "./pages/ProtectedRoute";
import Login from "./pages/Auth/Login/Login";
import Signup from "./pages/Auth/Signup/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword/ForgotPassword";
import SetPassword from "./pages/Auth/SetPassword/SetPassword";
import NotFoundPage from "./pages/NotFound/NotFoundPage";
import Logout from "@pages/Auth/Logout/Logout";
import Maintenance from "@pages/Maintenance";
import BlockRoute from "@pages/BlockRoute";
import NotFound from "@pages/NotFound/NotFound";
import ScreenLock from "@pages/ScreenLock/ScreenLock";
import { useSelector } from "react-redux";
import { authSelector } from "@store/authSlice";
import { blockedCompanyIdentifiersFrontend } from "@utils/global/blackList";
import Callback from "@pages/Auth/Callback";
import { IS_SIIGO } from "@utils/SIIGO/Global";
import EzNotFoundPage from "@components/Common/ezaudita/EzNotFoundPage";
import { useBasicPlan } from "@hooks/useBasicPlan";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  // debug: import.meta.env.NODE_ENV === 'development',
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

const CFDIIssued = React.lazy(() => import("./pages/CFDI/CFDIIssued/CFDIIssued"));
const CFDIReceived = React.lazy(() => import("./pages/CFDI/CFDIReceived/CFDIReceived"));
const IVA = React.lazy(() => import("./pages/IVA/IVAPage"));
const CreateCompany = React.lazy(() => import("./pages/Company/CreateCompany/CreateCompany"));
const SelectCompany = React.lazy(() => import("./pages/Company/SelectCompany/SelectCompany"));
const Dashboard = React.lazy(() => import("./pages/Dashboard/Dashboard"));
const EFOS = React.lazy(() => import("./pages/EFOS/EFOS"));
const Notifications = React.lazy(() => import("./pages/Notifications/Notifications"));
const Settings = React.lazy(() => import("./pages/Settings/Settings"));
const Users = React.lazy(() => import("./pages/Users/Users"));
const ADD = React.lazy(() => import("./pages/Settings/ADD/ADDPage"));
const Validations = React.lazy(() => import("./pages/Validations/Validations"));
const Subscription = React.lazy(() => import("./pages/Subscription/Subscription"));
const MassiveExport = React.lazy(() => import("./pages/MassiveExport/MassiveExport"));
const OldSatLog = React.lazy(() => import("./pages/OldSATLog/OldSATLog"));
const ADDIssued = React.lazy(() => import("@pages/ADD/ADDIssued/ADDIssued"));
const ADDReceived = React.lazy(() => import("@pages/ADD/ADDReceived/ADDReceived"));
const ADDLog = React.lazy(() => import("@pages/ADD/ADDLog/ADDLog"));
const ADDReset = React.lazy(() => import("@pages/Settings/ADD/ADDReset/ADDReset"));
const SyncSAT = React.lazy(() => import("@pages/Sync/SyncPage"));
const SignPage = React.lazy(() => import("@pages/Sync/SignPage"));
const RestartPage = React.lazy(() => import("@pages/Settings/Restart/RestartPage"));
const TaxPage = React.lazy(() => import("@pages/TaxInformation/Taxinformation"));
const ISR = React.lazy(() => import("@pages/ISR/_components/ISRPage"));

function App() {
  const { company } = useSelector(authSelector);
  const { isDownloadPlan } = useBasicPlan()
  const isMaintenanceTime = false;
  const ENVAR_APP_LOCK_MESSAGE = import.meta.env.VITE_REACT_APP_LOCK_MESSAGE;
  const APP_LOCK_MESSAGE = ENVAR_APP_LOCK_MESSAGE?.trim?.() ?? "";
  const IS_APP_LOCKED = !!APP_LOCK_MESSAGE && APP_LOCK_MESSAGE.toLowerCase() !== "null";

  return (
    <BrowserRouter>
      {IS_APP_LOCKED ? (
        <Routes>
          <Route path="/" element={<ScreenLock />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      ) : blockedCompanyIdentifiersFrontend.includes(company || "") ? (
        <Routes>
          <Route
            path={P.SELECTCOMPANY.path}
            element={
              <ProtectedRoute
                path={P.SELECTCOMPANY.path}
                component={SelectCompany}
                workspace="CLEAN"
              />
            }
          />
          <Route
            path={P.CREATECOMPANY.path}
            element={
              <ProtectedRoute
                path={P.CREATECOMPANY.path}
                component={CreateCompany}
                workspace="CLEAN"
              />
            }
          />
          <Route
            path={P.DASHBOARD.path}
            element={
              <BlockRoute path="/" component={NotFound} id={P.DASHBOARD.key} workspace="BLOCK" />
            }
          />
          <Route path={P.LOGIN.path} Component={isMaintenanceTime ? Maintenance : Login} />
          <Route
            path={`${P.SIGNUP.path}/:source?`}
            Component={isMaintenanceTime ? Maintenance : Signup}
          />
          <Route
            path={P.FORGOTPASSWORD.path}
            Component={isMaintenanceTime ? Maintenance : ForgotPassword}
          />
          <Route
            path={P.SETPASSWORD.path}
            Component={isMaintenanceTime ? Maintenance : SetPassword}
          />
          <Route
            path={P.SUBSCRIPTION.path}
            element={
              <ProtectedRoute
                path={P.SUBSCRIPTION.path}
                component={Subscription}
                id={P.SUBSCRIPTION.key}
                workspace="NORMAL"
              />
            }
          />
          <Route
            path="*"
            Component={isMaintenanceTime ? Maintenance : IS_SIIGO ? NotFoundPage : EzNotFoundPage}
          />
        </Routes>
      ) : (
        // App Plan Basic
        isDownloadPlan ?
          <Routes>
            <Route
              path={P.DASHBOARD.path}
              element={
                <Navigate to={`${P.CFDIISSUED.path}?cid=${company}`} />
              }
            />
            <Route
              path={P.CFDIRECEIVED.path}
              element={
                <ProtectedRoute
                  path={P.CFDIRECEIVED.path}
                  component={CFDIReceived}
                  id={P.CFDIRECEIVED.key}
                  workspace="NORMAL"
                />
              }
            />
            <Route
              path={P.CFDIISSUED.path}
              element={
                <ProtectedRoute
                  path={P.CFDIISSUED.path}
                  component={CFDIIssued}
                  id={P.CFDIISSUED.key}
                  workspace="NORMAL"
                />
              }
            />

            <Route
              path={P.MASSIVEEXPORT.path}
              element={
                <ProtectedRoute
                  path={P.MASSIVEEXPORT.path}
                  component={MassiveExport}
                  id={P.MASSIVEEXPORT.key}
                  workspace="NORMAL"
                />
              }
            />

            <Route
              path={P.SAT.path}
              element={
                <ProtectedRoute
                  path={P.SAT.path}
                  component={SyncSAT}
                  id={P.SAT.key}
                  workspace="NORMAL"
                />
              }
            />
            <Route
              path={P.Sign.path}
              element={
                <ProtectedRoute
                  path={P.Sign.path}
                  component={SignPage}
                  id={P.Sign.key}
                  workspace="NORMAL"
                />
              }
            />

            <Route
              path={P.EFOS.path}
              element={
                <ProtectedRoute
                  path={P.EFOS.path}
                  component={EFOS}
                  id={P.EFOS.key}
                  workspace="NORMAL"
                />
              }
            />
            <Route
              path={P.OLDSATLOG.path}
              element={
                <ProtectedRoute
                  path={P.OLDSATLOG.path}
                  component={OldSatLog}
                  id={P.OLDSATLOG.key}
                  workspace="NORMAL"
                />
              }
            />
            {/* <Route path="/" Component={Maintenance} /> */}
            <Route path={P.LOGIN.path} Component={isMaintenanceTime ? Maintenance : Login} />
            <Route
              path={`${P.SIGNUP.path}/:source?`}
              Component={isMaintenanceTime ? Maintenance : Signup}
            />
            <Route
              path={P.FORGOTPASSWORD.path}
              Component={isMaintenanceTime ? Maintenance : ForgotPassword}
            />
            <Route
              path={P.SETPASSWORD.path}
              Component={isMaintenanceTime ? Maintenance : SetPassword}
            />
            {IS_SIIGO && (
              <>
                <Route path={P.LOGOUT.path} Component={isMaintenanceTime ? Maintenance : Logout} />
                <Route path="/callback" Component={isMaintenanceTime ? Maintenance : Callback} />
              </>
            )}

            <Route
              path="*"
              Component={isMaintenanceTime ? Maintenance : IS_SIIGO ? NotFoundPage : EzNotFoundPage}
            />
          </Routes>
          :
          // App Normal
          <Routes>
            <Route
              path={P.DASHBOARD.path}
              element={
                <ProtectedRoute
                  path={P.DASHBOARD.path}
                  component={Dashboard}
                  id={P.DASHBOARD.key}
                  workspace="NORMAL"
                />
              }
            />
            <Route
              path={P.CREATECOMPANY.path}
              element={
                <ProtectedRoute
                  path={P.CREATECOMPANY.path}
                  component={CreateCompany}
                  workspace="CLEAN"
                />
              }
            />
            <Route
              path={P.SELECTCOMPANY.path}
              element={
                <ProtectedRoute
                  path={P.SELECTCOMPANY.path}
                  component={SelectCompany}
                  workspace="CLEAN"
                />
              }
            />
            <Route
              path={P.CFDIRECEIVED.path}
              element={
                <ProtectedRoute
                  path={P.CFDIRECEIVED.path}
                  component={CFDIReceived}
                  id={P.CFDIRECEIVED.key}
                  workspace="NORMAL"
                />
              }
            />
            <Route
              path={P.CFDIISSUED.path}
              element={
                <ProtectedRoute
                  path={P.CFDIISSUED.path}
                  component={CFDIIssued}
                  id={P.CFDIISSUED.key}
                  workspace="NORMAL"
                />
              }
            />
            <Route
              path={P.IVA.path}
              element={
                <ProtectedRoute path={P.IVA.path} component={IVA} id={P.IVA.key} workspace="NORMAL" />
              }
            />
            <Route
              path={P.ISR.path}
              element={
                <ProtectedRoute path={P.ISR.path} component={ISR} id={P.ISR.key} workspace="NORMAL" />
              }
            />
            <Route
              path={P.VALIDATIONS.path}
              element={
                <ProtectedRoute
                  path={P.VALIDATIONS.path}
                  component={Validations}
                  id={P.VALIDATIONS.key}
                  workspace="NORMAL"
                />
              }
            />
            <Route
              path={P.ADDISSUED.path}
              element={
                <ProtectedRoute
                  path={P.ADDISSUED.path}
                  component={ADDIssued}
                  id={P.ADDISSUED.key}
                  workspace="NORMAL"
                />
              }
            />
            <Route
              path={P.ADDRECEIVED.path}
              element={
                <ProtectedRoute
                  path={P.ADDRECEIVED.path}
                  component={ADDReceived}
                  id={P.ADDRECEIVED.key}
                  workspace="NORMAL"
                />
              }
            />
            <Route
              path={P.ADDLOG.path}
              element={
                <ProtectedRoute
                  path={P.ADDLOG.path}
                  component={ADDLog}
                  id={P.ADDLOG.key}
                  workspace="NORMAL"
                />
              }
            />
            <Route
              path={P.MASSIVEEXPORT.path}
              element={
                <ProtectedRoute
                  path={P.MASSIVEEXPORT.path}
                  component={MassiveExport}
                  id={P.MASSIVEEXPORT.key}
                  workspace="NORMAL"
                />
              }
            />
            <Route
              path={P.TAX.path}
              element={
                <ProtectedRoute
                  path={P.TAX.path}
                  component={TaxPage}
                  id={P.TAX.key}
                  workspace="NORMAL"
                />
              }
            />
            <Route
              path={P.SAT.path}
              element={
                <ProtectedRoute
                  path={P.SAT.path}
                  component={SyncSAT}
                  id={P.SAT.key}
                  workspace="NORMAL"
                />
              }
            />
            <Route
              path={P.Sign.path}
              element={
                <ProtectedRoute
                  path={P.Sign.path}
                  component={SignPage}
                  id={P.Sign.key}
                  workspace="NORMAL"
                />
              }
            />
            <Route
              path={P.Restart.path}
              element={
                <ProtectedRoute
                  path={P.Restart.path}
                  component={RestartPage}
                  id={P.Restart.key}
                  workspace="NORMAL"
                />
              }
            />
            <Route
              path={P.EFOS.path}
              element={
                <ProtectedRoute
                  path={P.EFOS.path}
                  component={EFOS}
                  id={P.EFOS.key}
                  workspace="NORMAL"
                />
              }
            />
            <Route
              path={P.NOTIFICATIONS.path}
              element={
                <ProtectedRoute
                  path={P.NOTIFICATIONS.path}
                  component={Notifications}
                  id={P.NOTIFICATIONS.key}
                  workspace="NORMAL"
                />
              }
            />
            <Route
              path={P.USERS.path}
              element={
                <ProtectedRoute
                  path={P.USERS.path}
                  component={Users}
                  id={P.USERS.key}
                  workspace="NORMAL"
                />
              }
            />
            <Route
              path={P.ADD.path}
              element={
                <ProtectedRoute path={P.ADD.path} component={ADD} id={P.ADD.key} workspace="NORMAL" />
              }
            />
            <Route
              path={P.ADDRESET.path}
              element={
                <ProtectedRoute
                  path={P.ADDRESET.path}
                  component={ADDReset}
                  id={P.ADDRESET.key}
                  workspace="NORMAL"
                />
              }
            />
            <Route
              path={P.SETTINGS.path}
              element={
                <ProtectedRoute
                  path={P.SETTINGS.path}
                  component={Settings}
                  id={P.SETTINGS.key}
                  workspace="NORMAL"
                />
              }
            />
            <Route
              path={P.SUBSCRIPTION.path}
              element={
                <ProtectedRoute
                  path={P.SUBSCRIPTION.path}
                  component={Subscription}
                  id={P.SUBSCRIPTION.key}
                  workspace="NORMAL"
                />
              }
            />
            <Route
              path={P.OLDSATLOG.path}
              element={
                <ProtectedRoute
                  path={P.OLDSATLOG.path}
                  component={OldSatLog}
                  id={P.OLDSATLOG.key}
                  workspace="NORMAL"
                />
              }
            />
            {/* <Route path="/" Component={Maintenance} /> */}
            <Route path={P.LOGIN.path} Component={isMaintenanceTime ? Maintenance : Login} />
            <Route
              path={`${P.SIGNUP.path}/:source?`}
              Component={isMaintenanceTime ? Maintenance : Signup}
            />
            <Route
              path={P.FORGOTPASSWORD.path}
              Component={isMaintenanceTime ? Maintenance : ForgotPassword}
            />
            <Route
              path={P.SETPASSWORD.path}
              Component={isMaintenanceTime ? Maintenance : SetPassword}
            />
            {IS_SIIGO && (
              <>
                <Route path={P.LOGOUT.path} Component={isMaintenanceTime ? Maintenance : Logout} />
                <Route path="/callback" Component={isMaintenanceTime ? Maintenance : Callback} />
              </>
            )}

            <Route
              path="*"
              Component={isMaintenanceTime ? Maintenance : IS_SIIGO ? NotFoundPage : EzNotFoundPage}
            />
          </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
