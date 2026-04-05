import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getDocument } from "./getDocument";
import { updateDocument } from "./updateDocument";

interface InformationState {
  response: InformationTAXResponse;
  sqs_executable: boolean;
  document_received: boolean;
  loading_tab: boolean;
  requesting_from_sat: boolean;
  requesting_from_sat_retry: boolean;
}

const initialState: InformationState = {
  response: {
    url: "",
    urlDownload: "",
    date: "",
    scrap_status_constancy: {
      current_status: "",
      updated_at: "",
      export_data: {
        file_name: "",
      },
    },
    scrap_status_opinion: {
      current_status: "",
      updated_at: "",
      export_data: {
        file_name: "",
      },
    },
  },
  sqs_executable: false,
  document_received: false,
  loading_tab: false,
  requesting_from_sat: false,
  requesting_from_sat_retry: false,
};

export const InformationReducer = createSlice({
  name: "information",
  initialState,
  reducers: {
    fetch_action: (state) => {
      state.response = {
        ...state.response,
        scrap_status_opinion: {
          current_status: "pending",
          updated_at: "",
          export_data: {
            file_name: "",
          },
        },
        scrap_status_constancy: {
          current_status: "pending",
          updated_at: "",
          export_data: {
            file_name: "",
          },
        },
      };

      state.loading_tab = true;
    },
    fetchSuccess: (state, payload) => {
      state.sqs_executable = true;
      state.response = payload.payload;
      state.loading_tab = false;
    },
    fetchErrors: (state) => {
      state.response = {
        ...state.response,
        scrap_status_opinion: {
          current_status: "error",
          updated_at: "",
          export_data: {
            file_name: "",
          },
        },
        scrap_status_constancy: {
          current_status: "error",
          updated_at: "",
          export_data: {
            file_name: "",
          },
        },
      };
      state.loading_tab = false;
    },
    fetch_action_retry: (state) => {
      state.response = {
        ...state.response,
        scrap_status_opinion: {
          current_status: "pending",
          updated_at: "",
          export_data: {
            file_name: "",
          },
        },
        scrap_status_constancy: {
          current_status: "pending",
          updated_at: "",
          export_data: {
            file_name: "",
          },
        },
      };
      state.requesting_from_sat_retry = true;
    },
    fetchSuccess_retry: (state, payload) => {
      state.sqs_executable = true;
      state.response = payload.payload;
      state.requesting_from_sat_retry = false;
    },
    fetchErrors_retry: (state) => {
      state.response = {
        ...state.response,
        scrap_status_opinion: {
          current_status: "error",
          updated_at: "",
          export_data: {
            file_name: "",
          },
        },
        scrap_status_constancy: {
          current_status: "error",
          updated_at: "",
          export_data: {
            file_name: "",
          },
        },
      };
      state.requesting_from_sat_retry = false;
    },
    update_action: (state) => {
      state.sqs_executable = false;
      state.response = {
        ...state.response,
        scrap_status_opinion: {
          current_status: "pending",
          updated_at: "",
          export_data: {
            file_name: "",
          },
        },
        scrap_status_constancy: {
          current_status: "pending",
          updated_at: "",
          export_data: {
            file_name: "",
          },
        },
      };
      state.requesting_from_sat = true;
    },
    updateSuccess: (state, payload) => {
      state.sqs_executable = true;
      state.response = payload.payload;
      state.requesting_from_sat = false;
    },
    updateErrors: (state) => {
      state.sqs_executable = false;
      state.response = {
        ...state.response,
        scrap_status_opinion: {
          current_status: "error",
          updated_at: "",
          export_data: {
            file_name: "",
          },
        },
        scrap_status_constancy: {
          current_status: "error",
          updated_at: "",
          export_data: {
            file_name: "",
          },
        },
      };
      state.requesting_from_sat = false;
    },
    loading: (state) => {
      state.response = {
        ...state.response,
        scrap_status_opinion: {
          current_status: "scraped",
          updated_at: "",
          export_data: {
            file_name: "",
          },
        },
        scrap_status_constancy: {
          current_status: "scraped",
          updated_at: "",
          export_data: {
            file_name: "",
          },
        },
      };
    },
    error: (state) => {
      state.response = {
        ...state.response,
        scrap_status_opinion: {
          current_status: "error",
          updated_at: "",
          export_data: {
            file_name: "",
          },
        },
        scrap_status_constancy: {
          current_status: "error",
          updated_at: "",
          export_data: {
            file_name: "",
          },
        },
      };
    },
    pending: (state) => {
      state.response = {
        ...state.response,
        scrap_status_opinion: {
          current_status: "pending",
          updated_at: "",
          export_data: {
            file_name: "",
          },
        },
        scrap_status_constancy: {
          current_status: "pending",
          updated_at: "",
          export_data: {
            file_name: "",
          },
        },
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDocument.pending, (state) => {
      state.sqs_executable = false;
      state.document_received = true;
      state.loading_tab = true;
      state.requesting_from_sat = true;
      state.requesting_from_sat_retry = false;
    });
    builder.addCase(getDocument.rejected, (state) => {
      state.sqs_executable = true;
      state.document_received = false;
      state.loading_tab = false;
      state.requesting_from_sat = false;
      state.requesting_from_sat_retry = true;
    });
    builder.addCase(getDocument.fulfilled, (state, { payload }) => {
      state.response = payload as any;
      state.sqs_executable = true;
      state.document_received = false;
      state.loading_tab = false;
      state.requesting_from_sat = false;
      state.requesting_from_sat_retry = true;
    });

    builder.addCase(updateDocument.pending, (state) => {
      state.sqs_executable = false;
      state.document_received = false;
      state.loading_tab = false;
      state.requesting_from_sat = true;
      state.requesting_from_sat_retry = true;
    });
    builder.addCase(updateDocument.fulfilled, (state) => {
      state.sqs_executable = true;
      state.document_received = true;
      state.loading_tab = true;
      state.requesting_from_sat = false;
      state.requesting_from_sat_retry = false;
    });
    builder.addCase(updateDocument.rejected, (state) => {
      state.sqs_executable = true;
      state.document_received = true;
      state.loading_tab = true;
      state.requesting_from_sat = false;
      state.requesting_from_sat_retry = false;
    });
  },
});

export const informationSelector = (state: RootState) => state.taxinformation;
export default InformationReducer.reducer;
