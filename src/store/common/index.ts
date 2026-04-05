import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getEfosPeriods } from "./getEfosPeriods";
import { getPeriods } from "./getPeriods";
import { getPeriodSelectorDates } from "./getPeriodSelectorDates";

interface CommonStore {
  error: string | null;
  efosError: string | null;
  periodDates: string | null;
  accumulatedDates: string | null;
  datesValue: string | null;
  efosPeriodDates: string | null;
  efosDateValue: string | null;
  efosAccumulatedDates: string | null;
  periodsTree: PeriodTree[] | null;
  efosPeriodTree: PeriodTree[] | null;
  periods: FormattedPeriodData[];
  efosPeriods: FormattedPeriodData[];
  editMode: boolean;
}

const initialState: CommonStore = {
  error: null,
  efosError: null,
  periodDates: null,
  accumulatedDates: null,
  datesValue: null,
  efosPeriodDates: null,
  efosAccumulatedDates: null,
  efosDateValue: null,
  periodsTree: null,
  efosPeriodTree: null,
  periods: [],
  efosPeriods: [],
  editMode: false,
};

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setDates: (state, { payload }: PayloadAction<string>) => {
      const dates = payload.split("|");
      state.periodDates = `${dates[0]}|${dates[1]}`;
      state.accumulatedDates = `${dates.length > 2 ? dates[2] : dates[0]}|${dates[1]}`;
      state.datesValue = payload;
    },
    setEfosDates: (state, { payload }: PayloadAction<string>) => {
      const dates = payload.split("|");
      state.efosPeriodDates = `${dates[0]}|${dates[1]}`;
      state.efosAccumulatedDates = `${dates.length > 2 ? dates[2] : dates[0]}|${dates[1]}`;
      state.efosDateValue = payload;
    },
    setEditMode: (state) => {
      state.editMode = !state.editMode;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPeriods.fulfilled, (state, { payload }) => {
      state.periods = payload.periods;
      // state.periodDates = payload.periodsDates
      // state.accumulatedDates = payload.accumulatedDates
      // state.datesValue = payload.datesValue
      // state.periodsTree = payload.periodsTree
    });
    builder.addCase(getPeriods.rejected, (state, { payload }) => {
      state.error = payload ?? null;
    });
    builder.addCase(getPeriods.pending, (state) => {
      state.error = null;
    });
    builder.addCase(getPeriodSelectorDates.fulfilled, (state, { payload }) => {
      state.datesValue = payload.datesValue;
      state.periodsTree = payload.periodsTree;
      state.periodDates = payload.periodDates;
      state.accumulatedDates = payload.accumulatedDates;
    });
    builder.addCase(getPeriodSelectorDates.rejected, (state, { payload }) => {
      state.error = payload ?? null;
    });
    builder.addCase(getPeriodSelectorDates.pending, (state) => {
      state.error = null;
      state.periodsTree = null;
    });
    builder.addCase(getEfosPeriods.fulfilled, (state, { payload }) => {
      state.efosPeriods = payload.efosPeriods;
      state.efosPeriodDates = payload.efosPeriodsDates;
      state.efosAccumulatedDates = payload.efosAccumulatedDates;
      state.efosDateValue = payload.efosDatesValue;
      state.efosPeriodTree = payload.efosPeriodsTree;
    });
    builder.addCase(getEfosPeriods.rejected, (state, { payload }) => {
      state.efosError = payload ?? null;
    });
    builder.addCase(getEfosPeriods.pending, (state) => {
      state.efosError = null;
      state.efosPeriodTree = null;
    });
  },
});

export const commonSelector = (state: RootState) => state.common;

export const { setDates, setEfosDates, setEditMode } = commonSlice.actions;

export default commonSlice.reducer;
