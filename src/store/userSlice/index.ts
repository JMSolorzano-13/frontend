import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {RootState} from '../store'
import getUsers from './getUsers'
import getUsersAlerts from './getUsersAlerts'
import saveUsersAlerts from './saveUsersAlerts'

interface UserState {
  isFetching: boolean
  error: string | null
  users: UserWithPermissions[]
  isFetchingAlerts: boolean
  usersWithAlerts: UserWithAlerts[]
  needsSave: boolean
  needsReload: boolean
}

const initialState: UserState = {
  isFetching: false,
  error: null,
  users: [],
  isFetchingAlerts: false,
  usersWithAlerts: [],
  needsSave: false,
  needsReload: false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleAlert(
      state,
      action: PayloadAction<{userId: number; alertId: string}>
    ) {
      const {userId, alertId} = action.payload
      const user = state.usersWithAlerts.find((user) => user.id === userId)
      if (user) {
        const index = user.alerts.indexOf(alertId)
        if (index > -1) {
          user.alerts.splice(index, 1)
        } else {
          user.alerts.push(alertId)
        }
      }
      if (!state.needsSave) {
        state.needsSave = true
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUsers.fulfilled, (state, {payload}) => {
      state.isFetching = false
      state.users = payload.usersWithPermissions
    })
    builder.addCase(getUsers.pending, (state) => {
      state.isFetching = true
      state.error = null
    })
    builder.addCase(getUsers.rejected, (state, {payload}) => {
      state.isFetching = false
      state.error = payload ?? null
    })

    builder.addCase(getUsersAlerts.fulfilled, (state, {payload}) => {
      state.isFetchingAlerts = false
      state.usersWithAlerts = payload.usersWithAlerts
    })
    builder.addCase(getUsersAlerts.pending, (state) => {
      state.isFetchingAlerts = true
      state.error = null
    })
    builder.addCase(getUsersAlerts.rejected, (state, {payload}) => {
      state.isFetchingAlerts = false
      state.error = payload ?? null
    })

    builder.addCase(saveUsersAlerts.fulfilled, (state) => {
      state.needsReload = false
    })
    builder.addCase(saveUsersAlerts.pending, (state) => {
      state.needsSave = false
      state.error = null
    })
    builder.addCase(saveUsersAlerts.rejected, (state, {payload}) => {
      state.error = payload ?? null
      state.needsReload = true
    })
  },
})

export const {toggleAlert} = userSlice.actions
export const userSelector = (state: RootState) => state.user

export default userSlice.reducer
