import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPermissions } from "../../api/user";
import { getCompaniesOldIds } from "../../rules/UserDataHelper";
import { RootState } from "../store";

type Out = {
  usersWithPermissions: UserWithPermissions[];
};

export const getUsers = createAsyncThunk<
  Out,
  SearchOptions | undefined,
  { rejectValue: string; state: RootState }
>("user/getUsers", async (_, { rejectWithValue, getState }) => {
  const { workspace, userData } = getState().auth;
  if (!workspace || !userData) {
    console.error("Error in getUsers: no workspace or userData selected");
    return rejectWithValue("Sin workspace o userData seleccionado");
  }
  const companies = getCompaniesOldIds(userData, workspace);

  try {
    const permissions = await fetchPermissions(companies);

    const usersWithPermissions: UserWithPermissions[] = [];
    const users: { [key: string]: UserWithPermissions } = {};
    permissions.forEach((permission: Permission) => {
      if (!users[permission.user.id]) {
        users[permission.user.id] = {
          id: permission.user.id,
          email: permission.user.email,
          name: permission.user.name,
          sourceName: permission.user.source_name,
          permissions: [
            {
              companyId: permission.company.id,
              identifier: permission.company.identifier,
              companyName: permission.company.name,
              roles: [permission.role],
            },
          ],
        };
      } else {
        // find the user and check if the company is already in the permissions, if not add it
        const user = users[permission.user.id];
        const companyPermissions = user.permissions.find(
          (p) => p.companyId === permission.company.id
        );
        if (!companyPermissions) {
          user.permissions.push({
            companyId: permission.company.id,
            companyName: permission.company.name,
            identifier: permission.company.identifier,
            roles: [permission.role],
          });
        } else {
          // if the company is already in the permissions, add the role
          companyPermissions.roles.push(permission.role);
        }
      }
    });

    Object.keys(users).forEach((key) => {
      usersWithPermissions.push(users[key]);
    });

    // const usersFiltered = usersWithPermissions.filter(
    //   (val) => val.id !== userData.user.id
    // )

    return {
      usersWithPermissions,
    };
  } catch (e: any) {
    console.error("Unexpected error in getUsers: ", e);
    return rejectWithValue("Error al obtener los usuarios");
  }
});

export default getUsers;
