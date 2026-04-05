import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getCFDICount } from "./getCFDICount";
import { getMassiveExport } from "./getMassiveExport";
import { getCFDIs } from "./getCFDIs";
import { getPivotCFDIs } from "./getPivotCFDIs";
import { getTotals } from "./getTotals";
import { getCFDIMassiveExport } from "./getCFDIMassiveExport";
import { getCFDI } from "./getCFDI";
import { getPaymentsCount } from "./getPaymentsCount";
import { getIVAExport } from "./getIVAExports";
import { getExportToExcel } from "@store/ivaSlice/exportIVATable";
import { getPayrollTotals } from "./getPayrollTotals";
import { setPaymentDate } from "./setPaymentDate";
import { setCFDIConfig } from "./setCFDIConfig";
import { UpdateUUIDsType } from "@pages/IVA/_types/StateTypes";
import { getNominalIncome } from "./getNominalIncome";
import { getPolicy } from "./getPolicy";
import { getAttachments } from "./getAttachments";
import { uploadAttachments } from "./uploadAttachment";
import { downloadAttachment } from "./downloadAttachment";
import { deleteAttachment } from "./deleteAttachment";

interface CfdiState {
  isFetching: boolean;
  isFetchingTotals: boolean;
  isFetchingPivot: boolean;
  isFetchingEFOS: boolean;
  isFetchingCFDICount: boolean;
  isFetchingPayCFDICount: boolean;
  isFetchingMassiveExports: boolean;
  isFetchingIVAExports: boolean;
  isFetchingExports: boolean;
  isFetchingCFDI: boolean;
  isFetchingPolicy: boolean;
  isFetchingAttachment: boolean;
  isFetchingUploadAttachment: boolean;
  isFetchingNominalIncome: boolean;
  isFetchingDeleteAttachment: boolean;
  isDownloadingAttachment: boolean;
  error: string | null;
  pivotError: string | null;
  efosError: string | null;
  massiveExportsError: string | null;
  exportsError: string | null;
  downloadCFDIError: string | null;
  deleteAttachmentError: string | null;
  issuedCFDIs: GroupedCFDIs;
  receivedCFDIs: GroupedCFDIs;
  payroll: {
    cfdis: CFDI[];
    totals: PayrollTotals | null;
  };
  ivaCFDIs: {
    cfdis: CFDI[];
    totals: CFDIsTotals | null;
    quantity: number;
  };
  validationCFDIs: ValidationCFDIs;
  efosCFDIs: GroupedCFDIs;
  pivotCFDIs: CFDI[];
  cfdiCount: CFDICount | null;
  payCfdiCount: CFDICount | null;
  massiveExports: MassiveExportResponse;
  cfdiExports: CFDIExport[];
  ivaExports: IVAExport[];
  exportBanner: boolean;
  obtainedCFDI: CFDI | undefined;
  ObtainedCFDIError: string | null;
  uploadAttachmentError: string | null;
  IVAExportBanner: boolean;
  cfdiExportsQty: number;
  ivaExportsQty: number;
  updatingCFDIPaymentDate: boolean;
  updateCFDIConfigSucceded: boolean;
  setPaymentSucceded: boolean;
  nominalIncomeData: NominalData[] | null;
  policyActiveUUID: string | null;
  policyActive: Poliza | null;
  cfdiattachmentActiveUUID: string | null;
  cfdiattachmentActiveType: string | null;
  cfdiattachmentActive: CFDI | null;
  attachmentsActive: Attachment[] | null;
  updateAttachments: boolean;
  currentFileAttachment: string;
}

const initialState: CfdiState = {
  isFetching: false,
  isFetchingTotals: false,
  isFetchingPivot: false,
  isFetchingEFOS: false,
  isFetchingCFDICount: false,
  isFetchingPayCFDICount: false,
  isFetchingExports: false,
  isFetchingUploadAttachment: false,
  isFetchingMassiveExports: false,
  isFetchingIVAExports: false,
  isFetchingCFDI: false,
  isFetchingNominalIncome: false,
  isFetchingAttachment: false,
  isDownloadingAttachment: false,
  isFetchingDeleteAttachment: false,
  error: null,
  pivotError: null,
  efosError: null,
  massiveExportsError: null,
  exportsError: null,
  downloadCFDIError: null,
  deleteAttachmentError: null,
  issuedCFDIs: {
    cfdis: [],
    totals: null,
    quantity: 0,
  },
  receivedCFDIs: {
    cfdis: [],
    totals: null,
    quantity: 0,
  },
  payroll: {
    cfdis: [],
    totals: null,
  },
  ivaCFDIs: {
    cfdis: [],
    totals: null,
    quantity: 0,
  },
  efosCFDIs: {
    cfdis: [],
    totals: null,
    quantity: 0,
  },
  validationCFDIs: {
    cfdis: [],
    totals: {},
  },
  pivotCFDIs: [],
  cfdiCount: {
    E: "0",
    I: "0",
    N: "0",
    P: "0",
    T: "0",
    ALL: "0",
  },
  payCfdiCount: {
    E: "0",
    I: "0",
    N: "0",
    P: "0",
    T: "0",
    ALL: "0",
  },
  massiveExports: {
    cfdi_export_identifier: "",
  },
  cfdiExports: [],
  ivaExports: [],
  exportBanner: false,
  obtainedCFDI: undefined,
  ObtainedCFDIError: null,
  uploadAttachmentError: null,
  IVAExportBanner: false,
  cfdiExportsQty: 0,
  ivaExportsQty: 0,
  updatingCFDIPaymentDate: false,
  updateCFDIConfigSucceded: true,
  setPaymentSucceded: true,
  nominalIncomeData: null,
  isFetchingPolicy: false,
  policyActiveUUID: null,
  policyActive: null,
  attachmentsActive: null,
  cfdiattachmentActiveUUID: null,
  cfdiattachmentActiveType: null,
  updateAttachments: false,
  currentFileAttachment: "",
  cfdiattachmentActive: null
};

export const cfdiSlice = createSlice({
  name: "cfdi",
  initialState,
  reducers: {
    removeValidationTotalsId: (state, { payload }: PayloadAction<string>) => {
      delete state.validationCFDIs.totals[payload];
    },
    cleanErrors: (state) => {
      state.error = null;
      state.pivotError = null;
      state.efosError = null;
      state.downloadCFDIError = null;
      state.deleteAttachmentError = null;
    },
    closeExportBanner(state) {
      state.exportBanner = false;
    },
    closeIVAExportBanner(state) {
      state.IVAExportBanner = false;
    },
    setObtainedCFDI(state) {
      delete state.obtainedCFDI;
    },
    updateIssuedCFDIsByID: (state, { payload }: PayloadAction<UpdateUUIDsType>) => {
      const findCFDI = state.issuedCFDIs.cfdis.map((item) => {
        const findInPayload = payload.find((i) => i.uuid === item.UUID);
        if (findInPayload) {
          return {
            ...item,
            ExcludeFromIVA: !item.ExcludeFromIVA,
          };
        }
        return item;
      });
      state.issuedCFDIs.cfdis = findCFDI;
    },
    updateReceivedCFDIsByID: (state, { payload }: PayloadAction<UpdateUUIDsType>) => {
      const findCFDI = state.receivedCFDIs.cfdis.map((item) => {
        const findInPayload = payload.find((i) => i.uuid === item.UUID);
        if (findInPayload) {
          return {
            ...item,
            ExcludeFromIVA: !item.ExcludeFromIVA,
          };
        }
        return item;
      });
      state.receivedCFDIs.cfdis = findCFDI;
    },
    activePolicySet(state, { payload }: PayloadAction<string>) {
      state.policyActiveUUID = payload;
    },
    inactivePolicySet(state) {
      state.policyActiveUUID = null;
    },
    activeAttachmentsSet(state, { payload }: PayloadAction<{ uuid: string; type: string, cfdi: CFDI }>) {
      state.cfdiattachmentActiveUUID = payload.uuid;
      state.cfdiattachmentActiveType = payload.type;
      state.cfdiattachmentActive = payload.cfdi;
    },
    inactiveAttachmentsSet(state) {
      state.cfdiattachmentActiveUUID = null;
      state.cfdiattachmentActive = null;
      state.cfdiattachmentActiveType = null;
      state.uploadAttachmentError = null;
    },
    cleanErrorAttachment(state) {
      state.uploadAttachmentError = null;
    },
    setCurrentSelectedAttachment(state, { payload }: PayloadAction<string>) {
      state.currentFileAttachment = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCFDIs.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      if (payload.module === "issued") {
        state.cfdiCount = payload.cfdiCount ?? state.cfdiCount;
        state.payCfdiCount = payload.payCfdiCount ?? state.payCfdiCount;
        state.issuedCFDIs.cfdis = payload.CFDIs;
        state.issuedCFDIs.quantity = payload.quantity;
      }
      if (payload.module === "received") {
        state.cfdiCount = payload.cfdiCount ?? state.cfdiCount;
        state.payCfdiCount = payload.payCfdiCount ?? state.payCfdiCount;
        state.receivedCFDIs.cfdis = payload.CFDIs;
        state.receivedCFDIs.quantity = payload.quantity;
      }
      if (payload.module === "validation-complete") state.validationCFDIs.cfdis = payload.CFDIs;
      if (payload.module === "efos") state.efosCFDIs.cfdis = payload.CFDIs;
      if (payload.module === "iva") {
        state.ivaCFDIs.cfdis = payload.CFDIs;
        state.ivaCFDIs.quantity = payload.quantity;
      }
    });
    builder.addCase(getCFDIs.pending, (state) => {
      state.isFetching = true;
      state.error = null;
      state.ivaCFDIs.cfdis = [];
    });
    builder.addCase(getCFDIs.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.error = (payload as string) ?? null;
      state.issuedCFDIs.cfdis = [];
      state.issuedCFDIs.quantity = 0;
      state.receivedCFDIs.cfdis = [];
      state.receivedCFDIs.quantity = 0;
    });

    builder.addCase(getTotals.fulfilled, (state, { payload }) => {
      state.isFetchingTotals = false;
      if (payload.module === "issued") state.issuedCFDIs.totals = payload.totals;
      if (payload.module === "received") state.receivedCFDIs.totals = payload.totals;
      if (payload.module.startsWith("validation-") && payload.validationId)
        state.validationCFDIs.totals[payload.validationId] = payload.totals;
      if (payload.module === "efos") state.efosCFDIs.totals = payload.totals;
    });
    builder.addCase(getTotals.pending, (state) => {
      state.isFetchingTotals = true;
      state.error = null;
    });
    builder.addCase(getTotals.rejected, (state, { payload }) => {
      state.isFetchingTotals = false;
      state.error = payload ?? null;
    });

    builder.addCase(getCFDICount.fulfilled, (state, { payload }) => {
      state.isFetchingCFDICount = false;
      state.cfdiCount = payload.count;
    });
    builder.addCase(getCFDICount.pending, (state) => {
      state.isFetchingCFDICount = true;
      state.error = null;
    });
    builder.addCase(getCFDICount.rejected, (state, { payload }) => {
      state.isFetchingCFDICount = false;
      state.error = payload ?? null;
    });

    builder.addCase(getPaymentsCount.fulfilled, (state, { payload }) => {
      state.isFetchingPayCFDICount = false;
      state.payCfdiCount = payload.payCount;
    });
    builder.addCase(getPaymentsCount.pending, (state) => {
      state.isFetchingPayCFDICount = true;
      state.error = null;
    });
    builder.addCase(getPaymentsCount.rejected, (state, { payload }) => {
      state.isFetchingPayCFDICount = false;
      state.error = payload ?? null;
    });

    builder.addCase(getPivotCFDIs.fulfilled, (state, { payload }) => {
      state.pivotCFDIs = payload.CFDIs;
      state.isFetchingPivot = false;
    });
    builder.addCase(getPivotCFDIs.pending, (state) => {
      state.isFetchingPivot = true;
      state.pivotError = null;
    });
    builder.addCase(getPivotCFDIs.rejected, (state, { payload }) => {
      state.isFetchingPivot = false;
      state.pivotError = payload ?? null;
    });

    builder.addCase(getMassiveExport.fulfilled, (state, { payload }) => {
      state.massiveExports = payload.massiveExport;
      state.exportBanner = true;
      state.isFetchingMassiveExports = false;
    });
    builder.addCase(getMassiveExport.pending, (state) => {
      state.isFetchingMassiveExports = true;
      state.error = null;
    });
    builder.addCase(getMassiveExport.rejected, (state, { payload }) => {
      state.isFetchingMassiveExports = false;
      state.error = payload ?? null;
    });
    builder.addCase(getCFDIMassiveExport.fulfilled, (state, { payload }) => {
      state.cfdiExports = payload.exports;
      state.cfdiExportsQty = payload.totalRecords;
      state.isFetchingExports = false;
    });
    builder.addCase(getCFDIMassiveExport.pending, (state) => {
      state.isFetchingExports = true;
      state.massiveExportsError = null;
    });
    builder.addCase(getCFDIMassiveExport.rejected, (state, { payload }) => {
      state.isFetchingExports = false;
      state.massiveExportsError = payload ?? null;
    });

    builder.addCase(getExportToExcel.fulfilled, (state) => {
      state.IVAExportBanner = true;
      state.isFetchingIVAExports = false;
    });
    builder.addCase(getExportToExcel.pending, (state) => {
      state.IVAExportBanner = false;
      state.isFetchingIVAExports = true;
    });
    builder.addCase(getExportToExcel.rejected, (state) => {
      state.IVAExportBanner = false;
      state.isFetchingIVAExports = false;
    });

    builder.addCase(getIVAExport.fulfilled, (state, { payload }) => {
      state.ivaExportsQty = payload.totalRecords;
      state.isFetchingIVAExports = false;
      state.ivaExports = payload.exports;
    });
    builder.addCase(getIVAExport.pending, (state) => {
      state.isFetchingIVAExports = true;
      state.ivaExports = [];
    });
    builder.addCase(getIVAExport.rejected, (state) => {
      state.isFetchingIVAExports = false;
    });

    builder.addCase(getCFDI.fulfilled, (state, { payload }) => {
      state.obtainedCFDI = payload.obtainedCFDI;
      state.isFetchingCFDI = false;
    });
    builder.addCase(getCFDI.pending, (state) => {
      state.isFetchingCFDI = true;
      state.ObtainedCFDIError = null;
    });
    builder.addCase(getCFDI.rejected, (state, { payload }) => {
      state.isFetchingCFDI = false;
      state.ObtainedCFDIError = payload ?? null;
    });

    builder.addCase(getPolicy.fulfilled, (state, { payload }) => {
      state.policyActive = payload.obtainedCFDI as Poliza;
      state.isFetchingPolicy = false;
    });
    builder.addCase(getPolicy.pending, (state) => {
      state.isFetchingPolicy = true;
      state.ObtainedCFDIError = null;
    });
    builder.addCase(getPolicy.rejected, (state, { payload }) => {
      state.isFetchingPolicy = false;
      state.ObtainedCFDIError = payload ?? null;
    });
    // Download Attachments
    builder.addCase(getAttachments.fulfilled, (state, { payload }) => {
      state.attachmentsActive = payload.obtainedCFDI as Attachment[];
      state.isFetchingAttachment = false;
    });
    builder.addCase(getAttachments.pending, (state) => {
      state.isFetchingAttachment = true;
      state.ObtainedCFDIError = null;
    });
    builder.addCase(getAttachments.rejected, (state, { payload }) => {
      state.isFetchingAttachment = false;
      state.ObtainedCFDIError = payload ?? null;
    });

    builder.addCase(downloadAttachment.fulfilled, (state) => {
      state.isDownloadingAttachment = false;
    });
    builder.addCase(downloadAttachment.pending, (state) => {
      state.isDownloadingAttachment = true;
      state.downloadCFDIError = null;
    });
    builder.addCase(downloadAttachment.rejected, (state, { payload }) => {
      state.isDownloadingAttachment = false;
      state.downloadCFDIError = payload ?? null;
    });
    // Upload Attachments
    builder.addCase(uploadAttachments.fulfilled, (state, { payload }) => {
      state.isFetchingUploadAttachment = false;
      state.attachmentsActive = payload.obtainedCFDI as Attachment[];
      state.isFetchingAttachment = false;
      state.updateAttachments = true;
      state.uploadAttachmentError = null;
    });
    builder.addCase(uploadAttachments.pending, (state) => {
      state.isFetchingUploadAttachment = true;
      state.updateAttachments = false;
      state.uploadAttachmentError = null;
    });
    builder.addCase(uploadAttachments.rejected, (state, { payload }) => {
      state.isFetchingUploadAttachment = false;
      state.uploadAttachmentError = payload ?? null;
    });
    // Delete Attachments
    builder.addCase(deleteAttachment.fulfilled, (state) => {
      state.isFetchingDeleteAttachment = false;
      state.updateAttachments = true;
    });
    builder.addCase(deleteAttachment.pending, (state) => {
      state.isFetchingDeleteAttachment = true;
      state.updateAttachments = false;
      state.deleteAttachmentError = null;
    });
    builder.addCase(deleteAttachment.rejected, (state, { payload }) => {
      state.isFetchingDeleteAttachment = false;
      state.deleteAttachmentError = payload ?? null;
    });

    builder.addCase(getPayrollTotals.fulfilled, (state, { payload }) => {
      state.payroll.totals = payload.totals;
    });
    builder.addCase(getPayrollTotals.rejected, (state) => {
      state.payroll.totals = null;
    });
    builder.addCase(setPaymentDate.fulfilled, (state) => {
      state.setPaymentSucceded = true;
      state.updatingCFDIPaymentDate = false;
    });
    builder.addCase(setPaymentDate.pending, (state) => {
      state.setPaymentSucceded = false;
      state.updatingCFDIPaymentDate = true;
    });
    builder.addCase(setPaymentDate.rejected, (state) => {
      state.setPaymentSucceded = false;
      state.updatingCFDIPaymentDate = false;
    });
    builder.addCase(setCFDIConfig.pending, (state) => {
      state.updateCFDIConfigSucceded = false;
    });
    builder.addCase(setCFDIConfig.fulfilled, (state) => {
      state.updateCFDIConfigSucceded = true;
    });
    builder.addCase(setCFDIConfig.rejected, (state) => {
      state.updateCFDIConfigSucceded = false;
    });
    builder.addCase(getNominalIncome.fulfilled, (state, { payload }) => {
      state.nominalIncomeData = payload.nominalIncomeData;
      state.isFetchingNominalIncome = false;
      state.error = null;
    });
    builder.addCase(getNominalIncome.pending, (state) => {
      state.isFetchingNominalIncome = true;
      state.error = null;
    });
    builder.addCase(getNominalIncome.rejected, (state, { payload }) => {
      state.isFetchingNominalIncome = false;
      state.error = payload ?? null;
    });
  },
});

export const cfdiSelector = (state: RootState) => state.cfdi;

export const {
  removeValidationTotalsId,
  cleanErrors,
  closeExportBanner,
  setObtainedCFDI,
  closeIVAExportBanner,
  updateIssuedCFDIsByID,
  updateReceivedCFDIsByID,
  activePolicySet,
  inactivePolicySet,
  activeAttachmentsSet,
  inactiveAttachmentsSet,
  setCurrentSelectedAttachment,
  cleanErrorAttachment,
} = cfdiSlice.actions;

export default cfdiSlice.reducer;
