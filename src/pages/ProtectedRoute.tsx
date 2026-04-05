import React, { useEffect, Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router";
import Workspace, { WorkspaceType } from "../layouts/Workspace";
import { authSelector } from "../store/authSlice";
import login from "../store/authSlice/login";
import * as P from "../constants/PageIds";
import LoadingScreen from "../components/ui/LoadingScreen";
import { useAppDispatch } from "@store/store";
import Maintenance from "./Maintenance";
import { SIIGO_PORTAL_URL } from "@utils/SIIGO/urls";
import { getAllCompaniesIds } from "@rules/UserDataHelper";
import { IS_SIIGO, NEEDS_EZ_LOGIN } from "@utils/SIIGO/Global";
import editSearchParams from "@utils/editSearchParams";
import { salesSelector, setSubNoCompany } from "@store/salesSlice";
import { getCookie } from "@utils/cookies";

type ProtectedRouteProps = {
  id?: string;
  path: string;
  component: React.FC;
  workspace?: keyof typeof WorkspaceType;
};

export default function ProtectedRoute({
  path,
  component: Component,
  workspace,
  id,
}: ProtectedRouteProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, isLogged, isFetching } = useSelector(authSelector);
  const { subNoCompany } = useSelector(salesSelector);
  const isMaintenanceTime = false;

  const token = getCookie("token");
  const company = new URLSearchParams(location.search).get("cid");
  const companyRedirect = localStorage.getItem("companyRedirect");
  const pathnameRedirect = localStorage.getItem("pathnameRedirect");

  const redirect_uri = localStorage.getItem("redirect_uri");

  if (IS_SIIGO && !NEEDS_EZ_LOGIN) {
    if (!pathnameRedirect && !token) {
      const pathnameRedirect = location.pathname;
      localStorage.setItem("pathnameRedirect", pathnameRedirect);
      localStorage.setItem("locationSearchRedirect", location.search.slice(1));
    }

    if (redirect_uri && !token) {
      localStorage.removeItem("redirect_uri");
      window.location.href = redirect_uri;
    }

    // if (companies.length > 0) {
    //   const companyFound = companies.find((c) => c.identifier === company);

    //   // if (!companyFound && token) {
    //   //   localStorage.removeItem("token");
    //   //   localStorage.removeItem("refreshToken");
    //   //   window.location.reload();
    //   // } else
    //   if (!companyFound) {
    //     window.location.href = SIIGO_PORTAL_URL;
    //   }
    // }

    if (company !== companyRedirect) {
      localStorage.setItem("companyRedirect", company ?? "");
    }

    if (userData) {
      const companies = getAllCompaniesIds(userData);
      const companyFound = companies.find((c) => c === company);

      if (!companyFound) {
        window.location.href = SIIGO_PORTAL_URL;
      }
    }
  }

  useEffect(() => {
    if (!isLogged && token) {
      dispatch(login({ token: token ?? undefined }));
    }
  }, []);

  if (!IS_SIIGO && NEEDS_EZ_LOGIN) {
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
  }

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
    if (IS_SIIGO && !NEEDS_EZ_LOGIN) {
      if (path !== P.SELECTCOMPANY.path && path !== P.CREATECOMPANY.path) {
        const lastCompany = localStorage.getItem("lastCompany");
        // TODO: Maybe redirect to other place if no lastCompany and no companyRedirect
        return (
          <Navigate
            to={
              isMaintenanceTime ? "/" : `${P.DASHBOARD.path}?cid=${companyRedirect || lastCompany}`
            }
            replace
          />
        );
      } else {
        if (path === P.SUBSCRIPTION.path && !subNoCompany) {
          dispatch(setSubNoCompany({ value: true }));
          return <Navigate to={P.SUBSCRIPTION.path} />;
        } else if (
          path !== P.SELECTCOMPANY.path &&
          path !== P.CREATECOMPANY.path &&
          !subNoCompany
        ) {
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
    }
  }

  if (!IS_SIIGO && NEEDS_EZ_LOGIN) {
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
  }

  if (workspace) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        {isMaintenanceTime ? (
          <Maintenance />
        ) : (
          <Workspace pageId={id} type={workspace}>
            <Component />
          </Workspace>
        )}
      </Suspense>
    );
  }
  return (
    <Suspense fallback={<LoadingScreen />}>
      {isMaintenanceTime ? <Maintenance /> : <Component />}
    </Suspense>
  );
}

ProtectedRoute.defaultProps = {
  workspace: null,
  id: null,
};
