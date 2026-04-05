import { useMemo } from "react";
import { useSelector } from "react-redux";
import { hasModuleAccess } from "../rules/UserDataHelper";
import { authSelector } from "../store/authSlice";
import { companySelector } from "../store/companySlice";

export default function usePermissions() {
  const { userData, company, workspace } = useSelector(authSelector);
  const { companies } = useSelector(companySelector);

  const globalPermissions = useMemo(() => {
    const permissions = {
      canEditUsers: false,
      canInviteWithPayroll: false,
      canAccessPayroll: false,
      isWorkspaceOwner: false,
      isOwnerandInvited: false,
    };

    if (userData && workspace) {
      const workSpaceOwner = Object.values(userData.access).find(
        (wS) => wS.owner_id === userData.user.id
      );
      const workSpaceInvited = Object.values(userData.access).find(
        (wS) => wS.owner_id !== userData.user.id
      );

      if (workSpaceOwner) {
        permissions.isWorkspaceOwner = true;
        if (workSpaceInvited) {
          permissions.isOwnerandInvited = true;
        }
      }
    }

    if (!userData || !companies || !workspace || !company || companies.length === 0)
      return permissions;

    const companySelected = companies.find((c) => c.identifier === company);
    if (!companySelected) return permissions;

    if (companySelected?.workspace?.owner?.id === userData.user.id) {
      permissions.canEditUsers = true;
      permissions.canInviteWithPayroll = true;
      permissions.isWorkspaceOwner = true;
    }

    permissions.canAccessPayroll = hasModuleAccess({
      userData,
      workspace,
      company,
      module: "Payroll",
    });

    return permissions;
  }, [userData, companies, workspace, company]);

  return globalPermissions;
}
