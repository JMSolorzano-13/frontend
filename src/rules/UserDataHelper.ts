import { IS_SIIGO, NEEDS_EZ_LOGIN } from "@utils/SIIGO/Global";
import _ from "lodash";

export const getCompanies = (userData: UserData | null, currentWorkspace: string | null) => {
  if (!userData || !currentWorkspace) {
    return [];
  }
  const companies: { name: string; key: string }[] = [];
  _.forEach(userData.access[currentWorkspace].companies, (company, key) => {
    companies.push({
      name: company.name,
      key,
    });
  });
  return companies;
};

export const getCompaniesIds = (userData: UserData | null, currentWorkspace: string | null) => {
  if (!userData || !currentWorkspace) {
    return [];
  }
  const companies: string[] = [];
  _.forEach(userData.access[currentWorkspace].companies, (_, key) => {
    companies.push(key);
  });
  return companies;
};

export const getCompaniesOldIds = (userData: UserData | null, currentWorkspace: string | null) => {
  if (!userData || !currentWorkspace) {
    return [];
  }
  const companies: number[] = [];
  _.forEach(userData.access[currentWorkspace].companies, (company) => {
    companies.push(company.id);
  });
  return companies;
};

export const getAllCompanies = (userData: UserData | null) => {
  if (!userData) {
    return [];
  }
  const companies: {
    name: string;
    key: string;
    oldKey: number;
    workspace: string;
    oldWorkspace: number;
  }[] = [];
  _.forEach(userData.access, (workspace, wKey) => {
    _.forEach(workspace.companies, ({ name, id }, key) => {
      companies.push({
        name,
        key,
        oldKey: id,
        workspace: wKey,
        oldWorkspace: workspace.id,
      });
    });
  });

  return companies;
};

export const getAllCompaniesIds = (userData: UserData | null): string[] => {
  if (!userData) {
    return [];
  }
  const companies: string[] = [];
  _.forEach(userData.access, (workspace) => {
    _.forEach(workspace.companies, (_, key) => {
      companies.push(key);
    });
  });

  return companies;
};

export const getAllCompaniesOldIds = (userData: UserData | null): number[] => {
  if (!userData) {
    return [];
  }
  const companies: number[] = [];
  _.forEach(userData.access, (workspace) => {
    _.forEach(workspace.companies, (company) => {
      companies.push(company.id);
    });
  });

  return companies;
};

export const getWorkspaces = (userData: UserData | undefined) => {
  if (!userData) {
    return [];
  }
  const workspaces: { name: string; key: string }[] = [];
  _.forEach(userData.access, (workspace, key) => {
    workspaces.push({
      name: workspace.name,
      key,
    });
  });
  return workspaces;
};

type CurrentsType = {
  currentWorkspace: string | undefined;
  oldCurrentWorkspace: number | undefined;
  currentCompany: string | undefined;
  oldCurrentCompany: number | undefined;
  userWorkspace: { id: string; oldId: number } | undefined;
};

export const getCurrentCompanyAndWorkspace = (userData: UserData | null) => {
  const currents: CurrentsType = {
    currentWorkspace: undefined,
    oldCurrentWorkspace: undefined,
    currentCompany: undefined,
    oldCurrentCompany: undefined,
    userWorkspace: undefined,
  };

  if (!userData) {
    return currents;
  }

  // Get company from localStorage, if not, from URL
  let localCompany = undefined;
  if (IS_SIIGO && !NEEDS_EZ_LOGIN) {
    localCompany = localStorage.getItem("companyRedirect");
    if (!localCompany) {
      const companyRedirect = localStorage.getItem("lastCompany");
      if (companyRedirect) {
        localCompany = companyRedirect;
      } else {
        const { search } = window.location;
        const searchClean = search.includes("?redirect=") ? search.split("?")[2] : search;
        const paramsCompany = new URLSearchParams(searchClean).get("cid");
        if (paramsCompany) {
          localCompany = paramsCompany;
        }
      }
    }
  } else {
    localCompany = localStorage.getItem("lastCompany");
    if (!localCompany) {
      const { search } = window.location;
      const searchClean = search.includes("?redirect=") ? search.split("?")[2] : search;
      const paramsCompany = new URLSearchParams(searchClean).get("cid");
      if (paramsCompany) {
        localCompany = paramsCompany;
      }
    }
  }

  if (localCompany) {
    const allCompanies = getAllCompanies(userData);
    const currentCompany = _.find(allCompanies, ["key", localCompany]);
    if (currentCompany) {
      localStorage.setItem("lastCompany", currentCompany.key);
      localStorage.setItem("lastWorkspace", currentCompany.workspace);
      return {
        userWorkspace: undefined,
        currentWorkspace: currentCompany.workspace,
        oldCurrentWorkspace: currentCompany.oldWorkspace,
        currentCompany: currentCompany.key,
        oldCurrentCompany: currentCompany.oldKey,
      };
    }
  }

  // Get and set user owner workspace
  const userId = userData.user.id;
  const getKeys = _.keys(userData.access);
  let userWorkspace: { id: string; oldId: number } | undefined;
  _.forEach(getKeys, (val) => {
    const loopingWorkspace = userData.access[val];
    if (loopingWorkspace.owner_id === userId) {
      userWorkspace = {
        id: val,
        oldId: loopingWorkspace.id,
      };
    }
  });

  if (userWorkspace === undefined && getKeys.length <= 1) {
    try {
      const [firstWorkspaceKey] = getKeys;
      const fdefWorkspace = userData.access[firstWorkspaceKey];
      userWorkspace = {
        id: firstWorkspaceKey,
        oldId: fdefWorkspace.id,
      };
    } catch (error) {
      throw new Error("User has no workspace");
    }
  }

  if (userWorkspace) {
    currents["userWorkspace"] = userWorkspace;
    currents["currentWorkspace"] = userWorkspace.id;
    currents["oldCurrentWorkspace"] = userWorkspace.oldId;
    return currents;
  }

  localStorage.removeItem("lastCompany");
  localStorage.removeItem("lastWorkspace");
  return {
    userWorkspace,
    currentWorkspace: undefined,
    oldCurrentWorkspace: undefined,
    currentCompany: undefined,
    oldCurrentCompany: undefined,
  };
};

export const hasModuleAccess = (data: {
  userData: UserData;
  workspace: string;
  company: string;
  module: string;
}) => {
  const { userData, workspace, company, module } = data;
  const selectedWorkspace = userData.access[workspace];
  if (!selectedWorkspace) {
    return false;
  }
  const selectedCompany = selectedWorkspace.companies[company];
  if (!selectedCompany) {
    return false;
  }
  const hasModule = selectedCompany.modules.includes(module);
  return hasModule;
};
