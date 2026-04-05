import { AnyAction, ThunkDispatch, configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import createSagaMiddleware from "@redux-saga/core";
import SatReducer from "./satSlice";
import CfdiReducer from "./cfdiSlice";
import CommonReducer from "./common";
import AuthReducer from "./authSlice";
import CompanyReducer from "./companySlice";
import EfosReducer from "./efosSlice";
import UserReducer from "./userSlice";
import SalesReducer from "./salesSlice";
import InvoiceReducer from "./invoiceSlice";
import addReducer from "./addSlice";
import IVAReducer from "./ivaSlice";
import InformationReducer from "./taxInformationSlice";
import payrollReducer from "./payrollSlice";
import rootSaga from "./rootSaga";

import ISRReducer from "@pages/ISR/_state/ISRSlice";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    sat: SatReducer,
    cfdi: CfdiReducer,
    common: CommonReducer,
    auth: AuthReducer,
    company: CompanyReducer,
    efos: EfosReducer,
    user: UserReducer,
    sales: SalesReducer,
    invoice: InvoiceReducer,
    add: addReducer,
    iva: IVAReducer,
    payroll: payrollReducer,
    isr: ISRReducer,
    taxinformation: InformationReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppThunkDispatch = ThunkDispatch<RootState, any, AnyAction>;
export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
