import _ from "lodash";
import * as P from "@constants/PageIds";
import { getAllCompanies } from "@rules/UserDataHelper";

const changeCompany = (nextCompany: string, userData: UserData | null, _company: string | null) => {
  const companies = getAllCompanies(userData);
  const companyFound = _.find(companies, ["key", nextCompany]);
  if (companyFound) {
    localStorage.setItem("lastCompany", nextCompany);
    localStorage.setItem("lastWorkspace", companyFound.workspace);
    window.location.href = `${P.DASHBOARD.path}?cid=${nextCompany}`;
  } else {
    console.error(
      "Error at selecting new company. Either the company does not exist or you are already in that company."
    );
  }
};

export default changeCompany;
