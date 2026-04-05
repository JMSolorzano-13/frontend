import { fetchSingleCFDI } from "@api/cfdi";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@store/store";
import { generatePeriodTree } from "@utils/generatePeriodTree";

type Out = {
  periodsTree: PeriodTree[];
  datesValue: string;
  periodDates: string;
  accumulatedDates: string;
};

export const getPeriodSelectorDates = createAsyncThunk<
  Out,
  void,
  { rejectValue: string; state: RootState }
>("common/getPeriodSelectorDates", async (_, { rejectWithValue, getState }) => {
  try {
    const { company } = getState().auth;
    if (!company) {
      console.error("Error in getPeriods: no company selected");
      return rejectWithValue("Sin compañía seleccionada");
    }

    const oldestCFDI = await fetchSingleCFDI(company, {
      fields: ["FechaFiltro"],
      orderBy: '"FechaFiltro" asc',
    });
    const oldestDate = oldestCFDI.cfdis[0]?.FechaFiltro || new Date().toString();
    const periodsTree = generatePeriodTree(oldestDate);
    let datesValue = "Todos";
    let periodDates = "Todos";
    let accumulatedDates = "Todos";

    if (periodsTree.length > 0) {
      for (let i = 0; i < periodsTree.length; i += 1) {
        const period = periodsTree[i];
        if (period.children.length > 0) {
          const c = period.children[0];
          const cDates = c.value.split("|");
          periodDates = `${cDates[0]}|${cDates[1]}`;
          accumulatedDates = `${cDates[2]}|${cDates[1]}`;
          datesValue = c.value;
          break;
        }
      }
    }

    return {
      periodsTree,
      datesValue,
      periodDates,
      accumulatedDates,
    };
  } catch (e: any) {
    console.error("Unexpected error in getPeriodSelectorDates", e);
    return rejectWithValue("Error al obtener la lista de períodos");
  }
});
