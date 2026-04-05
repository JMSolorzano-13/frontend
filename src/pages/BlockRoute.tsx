import React, { useEffect, Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useLocation } from "react-router";
import Workspace, { WorkspaceType } from "../layouts/Workspace";
import { authSelector } from "../store/authSlice";
import login from "../store/authSlice/login";
import * as P from "../constants/PageIds";
import LoadingScreen from "../components/ui/LoadingScreen";
import editSearchParams from "../utils/editSearchParams";
import { useAppDispatch } from "@store/store";
import Maintenance from "./Maintenance";
import NotFound from "./NotFound/NotFound";

type ProtectedRouteProps = {
  id?: string;
  path: string;
  component: React.FC;
  workspace?: keyof typeof WorkspaceType;
};

export default function BlockRoute({
  path,
  workspace,
  id,
}: ProtectedRouteProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLogged, company, token, isFetching } = useSelector(authSelector);

  const isMaintenanceTime = false;

  useEffect(() => {
    if (!isLogged && token) {
      dispatch(login({ token: token ?? undefined }));
    }
  }, []);

  useEffect(() => {
    if (company && !location.search.includes("redirect")) {
      const cSearchCompany = new URLSearchParams(location.search).get("cid");
      if (!cSearchCompany || (cSearchCompany && cSearchCompany !== company)) {
        isMaintenanceTime ? (
          <Navigate to="/" replace />
        ) : (
          navigate(
            editSearchParams(location.search, [{ key: "cid", value: company }], {
              baseUrl: location.pathname,
            }),
            { replace: true }
          )
        );
      }
    }
  }, [company, location.search]);

  if (!isLogged && token) {
    return <LoadingScreen />;
  }

  if (!isFetching && !isLogged) {
    return (
      <Navigate
        to={
          isMaintenanceTime
            ? "/"
            : `${P.LOGIN.path}?redirect=${location.pathname}${location.search}`
        }
        replace
      />
    );
  }

  if (isLogged && !company) {
    if (path !== P.SELECTCOMPANY.path && path !== P.CREATECOMPANY.path) {
      return (
        <Navigate
          to={
            isMaintenanceTime
              ? "/"
              : `${P.SELECTCOMPANY.path}?redirect=${location.pathname}${location.search}`
          }
          replace
        />
      );
    }
  }

  if (isLogged && company) {
    if (path === P.SELECTCOMPANY.path) {
      const redirect = location.search.includes("redirect=")
        ? location.search.split("redirect=")[1]
        : null;
      if (redirect) {
        return <Navigate to={isMaintenanceTime ? "/" : redirect} replace />;
      }
      return <Navigate to={isMaintenanceTime ? "/" : P.DASHBOARD.path} replace />;
    }
  }

  if (workspace) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        {isMaintenanceTime ? (
          <Maintenance />
        ) : (
          <Workspace pageId={id} type={workspace}>
            <NotFound />
          </Workspace>
        )}
      </Suspense>
    );
  }
  return (
    <Suspense fallback={<LoadingScreen />}>
      {isMaintenanceTime ? <Maintenance /> : <NotFound />}
    </Suspense>
  );
}

BlockRoute.defaultProps = {
  workspace: null,
  id: null,
};
