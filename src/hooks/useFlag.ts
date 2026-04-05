import { useEffect } from "react";
import { fetchFlag } from "@api/featureFlag";
import { authSelector, setConditions } from "@store/authSlice";
import { useDispatch, useSelector } from "react-redux";

export const useFlag = () => {
  const dispatch = useDispatch();
  const { company, conditions } = useSelector(authSelector);

  useEffect(() => {
    const setConditionsFlag = async () => {
      const result = await fetchFlag();
      dispatch(setConditions(result));
    };
    setConditionsFlag();
  }, []);
  return {
    company,
    blockedCompanyIdentifiers: conditions?.blockedCompanyIdentifiers ?? [],
    isActiveFlag: conditions?.isActiveFlag ?? false,
  };
};
