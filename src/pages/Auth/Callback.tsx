import login from "@store/authSlice/login";
import { useAppDispatch } from "@store/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "@components/ui/LoadingScreen";
import { authSelector } from "@store/authSlice";
import { useSelector } from "react-redux";
import * as P from "@constants/PageIds";

export default function Callback() {
  const { error } = useSelector(authSelector);
  const company = localStorage.getItem("companyRedirect");
  const pathnameRedirect = localStorage.getItem("pathnameRedirect");
  const locationSearchRedirect = localStorage.getItem("locationSearchRedirect");
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const code: string = new URLSearchParams(window.location.search).get("code") as string;

  useEffect(() => {
    dispatch(login({ code }));
  }, []);

  if (!error && company) {
    setTimeout(() => {
      if (pathnameRedirect) {
        if (locationSearchRedirect) {
          navigate(`${pathnameRedirect}?cid=${company}&${locationSearchRedirect}`);
        } else {
          navigate(`${pathnameRedirect}?cid=${company}`);
        }
        localStorage.removeItem("pathnameRedirect");
        localStorage.removeItem("locationSearchRedirect");
      } else {
        navigate(`${P.DASHBOARD.path}?cid=${company}`);

      }
    }, 1000);
  }

  if (!company) {
    window.location.href = "https://qastaging.siigo.mx/";
  }

  return <LoadingScreen />;
}
