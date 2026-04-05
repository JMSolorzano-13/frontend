import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";
import { getAllCompanies, getCompanies } from "@rules/UserDataHelper";
import { RootState } from "../store";
import login from "./login";
import resetUserConfig from "./resetUserConfig";
import saveUserConfig from "./saveUserConfig";
import { eraseCookie } from "@utils/cookies";
import viewNotifications from "./notifications";

interface AuthState {
  email: string | null;
  isLogged: boolean;
  isFetching: boolean;
  userData: UserData | null;
  license: License | null;
  token: string | null;
  defaultWorkspace: { id: string; oldId: number } | null;
  workspace: string | null;
  oldWorkspace: number | null;
  company: string | null;
  oldCompany: number | null;
  rfc: string | null;
  error: string | null;
  status: number | null;
  config: UserConfig;
  isFetchingConfig: boolean;
  challengeName: string | null;
  challengeSession: string | null;
  hasPendingPayment: boolean;
  hasADDConfig: boolean;
  customErrorMessage: string | null;
  conditions: CompanyStatus | undefined;
  wasUserChanged: boolean;
  addEnabled: boolean;
  subNoCompany: boolean;
  isNotificationView: NotificationView;
}

const token = localStorage.getItem("token");

const initialState: AuthState = {
  email: null,
  isLogged: false,
  isFetching: false,
  token,
  userData: null,
  license: null,
  defaultWorkspace: null,
  workspace: null,
  oldWorkspace: null,
  company: null,
  oldCompany: null,
  rfc: null,
  error: null,
  status: null,
  config: {
    dashboardIds: [],
    validationIds: [],
    IVAIds: [],
    pivotLayouts: {},
    tableColumns: {},
    scrap_status_constancy: {
      current_status: "",
      updated_at: "",
    },
    scrap_status_opinion: {
      current_status: "",
      updated_at: "",
    },
  },
  isFetchingConfig: false,
  challengeName: null,
  challengeSession: null,
  hasPendingPayment: false,
  hasADDConfig: false,
  customErrorMessage: null,
  conditions: undefined,
  wasUserChanged: false,
  addEnabled: false,
  subNoCompany: false,
  isNotificationView: {
    isFreeTrialNotificationView: false,
    isAfterDaysNotificationsView: false,
    trialRemainingDays: 0,
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUsername: (state, { payload }: { payload: { username: string } }) => {
      if (state.userData) {
        if (state.userData.user) {
          state.userData.user.name = payload.username;
        }
      }
    },
    setConditions: (state, { payload }) => {
      state.conditions = payload;
    },
    setUserData(state, { payload }) {
      state.userData = payload;
    },
    setCompany(state, { payload }) {
      const companies = state.workspace
        ? getCompanies(state.userData, state.workspace)
        : getAllCompanies(state.userData);
      const hasCompany = _.find(companies, ["key", payload]);

      if (hasCompany && state.company !== payload) {
        localStorage.setItem("lastCompany", String(payload));

        state.company = payload;
      } else if (companies.length > 0) {
        state.company = companies[0].key;
      }
    },
    setRFC(state, { payload }) {
      if (state.rfc !== payload) {
        state.rfc = payload;
      }
    },
    setHasPendingPayment(state, { payload }: PayloadAction<boolean>) {
      state.hasPendingPayment = payload;
    },
    logout(state) {
      eraseCookie("token");
      eraseCookie("refreshToken");
      localStorage.removeItem("lastCompany");
      localStorage.removeItem("lastWorkspace");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("h-menu-state");
      localStorage.removeItem("subNoCompany");
      localStorage.removeItem("pathnameRedirect");
      localStorage.removeItem("locationSearchRedirect");
      state.isLogged = false;
      state.token = null;
    },
    setPasswordCompleted(state) {
      state.status = null;
      state.error = null;
      state.challengeName = null;
      state.challengeSession = null;
    },
    forceChangeCompany(state, { payload }) {
      localStorage.setItem("lastCompany", String(payload));
      state.company = payload;
    },
    toggleId: (
      state,
      {
        payload,
      }: PayloadAction<{
        collection: "validationIds" | "dashboardIds" | "IVAIds";
        id: string;
        toggled: boolean;
      }>
    ) => {
      const index = _.findIndex(state.config[payload.collection], (v) => v === payload.id);
      if (state.config[payload.collection]) {
        if (payload.toggled && index === -1) {
          state.config[payload.collection].push(payload.id);
        } else if (!payload.toggled && index > -1) {
          state.config[payload.collection].splice(index, 1);
        }
      } else {
        state.config = { ...state.config, IVAIds: [payload.id] };
      }
    },
    createLayout: (
      state,
      {
        payload,
      }: PayloadAction<{
        origin: string;
        values: PivotLayout;
      }>
    ) => {
      if (!state.config.pivotLayouts[payload.origin]) {
        state.config.pivotLayouts[payload.origin] = [];
      }
      state.config.pivotLayouts[payload.origin].push(payload.values);
    },
    updateLayout: (
      state,
      {
        payload,
      }: PayloadAction<{
        origin: string;
        id: string;
        values: PivotLayout;
      }>
    ) => {
      const index = _.findIndex(
        state.config.pivotLayouts[payload.origin],
        (v) => v.id === payload.id
      );
      if (index > -1) {
        state.config.pivotLayouts[payload.origin][index] = payload.values;
      }
    },
    deleteLayout: (
      state,
      {
        payload,
      }: PayloadAction<{
        origin: string;
        id: string;
      }>
    ) => {
      const index = _.findIndex(
        state.config.pivotLayouts[payload.origin],
        (v) => v.id === payload.id
      );
      if (index > -1) {
        state.config.pivotLayouts[payload.origin].splice(index, 1);
      }
    },
    setTableColumns: (
      state,
      {
        payload,
      }: PayloadAction<{
        table: string;
        columns: { column: string; visible: boolean }[];
      }>
    ) => {
      state.config.tableColumns[payload.table] = payload.columns;
    },
    setTableColumnsOrder: (
      state,
      { payload }: PayloadAction<{ table: string; columns: string[] }>
    ) => {
      const table = state.config.tableColumns[payload.table];
      if (table) {
        const newColumns: { column: string; visible: boolean }[] = [];
        payload.columns.forEach((column) => {
          const index = _.findIndex(table, (v) => v.column === column);
          if (index > -1) {
            newColumns.push(table[index]);
          }
        });
        state.config.tableColumns[payload.table] = newColumns;
      }
    },
    setHasADDConfig: (state, { payload }: PayloadAction<{ company: Company }>) => {
      if (state.userData && state.workspace) {
        const addData = state.userData.access[state.workspace];
        if (
          addData.pasto_worker_id &&
          payload.company.pasto_company_identifier &&
          addData.pasto_installed
        ) {
          state.hasADDConfig = true;
        } else {
          state.hasADDConfig = false;
        }
      }
    },
    showAddSectionMenu: (state) => {
      state.hasADDConfig = true;
    },
    toggleColumn: (state, { payload }: PayloadAction<{ table: string; column: string }>) => {
      const index = _.findIndex(
        state.config.tableColumns[payload.table],
        (v) => v.column === payload.column
      );
      if (index > -1) {
        state.config.tableColumns[payload.table][index].visible =
          !state.config.tableColumns[payload.table][index].visible;
      }
    },
    setWasUserChanged: (state, { payload }: PayloadAction<boolean>) => {
      state.wasUserChanged = payload;
    },
  },
  extraReducers: (builder) => {
    // Login reducer
    builder.addCase(login.fulfilled, (state, { payload }) => {
      state.email = payload.userData.user.email;
      state.isLogged = true;
      state.isFetching = false;
      state.isFetchingConfig = false;
      state.userData = payload.userData;
      state.license = payload.license;
      state.token = payload.token;
      state.defaultWorkspace = payload.defaultWorkspace;
      state.workspace = payload.workspace;
      state.oldWorkspace = payload.oldWorkspace;
      state.company = payload.company;
      state.oldCompany = payload.oldCompany;
      if (payload.config) {
        state.config = payload.config;
      }
      state.challengeName = null;
      state.challengeSession = null;
      state.status = null;
      state.addEnabled = payload.addEnabled;
    });
    builder.addCase(login.pending, (state) => {
      state.isFetching = true;
      state.isFetchingConfig = true;
      state.error = null;
      state.addEnabled = false;
    });
    builder.addCase(login.rejected, (state, { payload }) => {
      if (payload) {
        const { message, status, challengeName, challengeSession, email, customMessage } = payload;
        state.email = email ?? null;
        state.error = message ?? null;
        state.isFetching = false;
        state.token = null;
        state.status = status ?? null;
        state.challengeName = challengeName ?? null;
        state.challengeSession = challengeSession ?? null;
        state.customErrorMessage = customMessage ?? null;
        state.isFetchingConfig = false;
        state.addEnabled = false;
      }
    });
    // End Login reducer

    // Save config reducer
    builder.addCase(saveUserConfig.fulfilled, (state, { payload }) => {
      state.config = payload;
      state.isFetchingConfig = false;
    });
    builder.addCase(saveUserConfig.pending, (state) => {
      state.error = null;
      state.isFetchingConfig = true;
    });
    builder.addCase(saveUserConfig.rejected, (state, { payload }) => {
      state.error = payload ?? null;
      state.isFetchingConfig = false;
    });
    // End Save config reducer

    // Reset config reducer
    builder.addCase(resetUserConfig.fulfilled, (state, { payload }) => {
      state.config = payload;
      state.isFetchingConfig = false;
    });
    builder.addCase(resetUserConfig.pending, (state) => {
      state.error = null;
      state.isFetchingConfig = true;
    });
    builder.addCase(resetUserConfig.rejected, (state, { payload }) => {
      state.error = payload ?? null;
      state.isFetchingConfig = false;
    });
    // End Save config reducer

    // Notifications
    builder.addCase(viewNotifications.fulfilled, (state, { payload }) => {
      state.isNotificationView = payload.notifications;
    });
    builder.addCase(viewNotifications.pending, (state) => {
      state.isNotificationView = {
        trialRemainingDays: 0,
        isFreeTrialNotificationView: false,
        isAfterDaysNotificationsView: false,
      };
    });
    builder.addCase(viewNotifications.rejected, (state) => {
      state.isNotificationView = {
        trialRemainingDays: 0,
        isFreeTrialNotificationView: false,
        isAfterDaysNotificationsView: false,
      };
    });
    // Notifications
  },
});

export const authSelector = (state: RootState) => state.auth;
export const {
  logout,
  forceChangeCompany,
  toggleId,
  setPasswordCompleted,
  createLayout,
  updateLayout,
  deleteLayout,
  setUserData,
  setTableColumns,
  setTableColumnsOrder,
  toggleColumn,
  setUsername,
  setCompany,
  setRFC,
  setHasPendingPayment,
  setHasADDConfig,
  showAddSectionMenu,
  setConditions,
  setWasUserChanged,
} = authSlice.actions;

export default authSlice.reducer;
