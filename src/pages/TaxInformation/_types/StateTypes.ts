export interface PropsCurrentTab {
  title: string;
  updatePage: () => void;
  fetchDocument: () => void;
  fetchDocumentRetry: () => void;
  loadingStage: () => void;
  download: string;
  date: string;
  date_owner: string;
  url: string;
  loading: (status: boolean) => void;
  tab: string;
  status: "pending" | "scraped" | "error" | "";
  loading_tab: boolean;
  requesting_from_sat: boolean;
  requesting_from_sat_retry: boolean;
}

export interface PropsMessage {
  title?: string;
  text?: string;
  buttonText?: string;
  buttonIcon?: React.ReactElement;
  updatePage?: () => void;
  fetchDocument?: () => void;
  fetchDocumentRetry: () => void;
  type?: "warning" | "success" | "info" | "error";
  status: "pending" | "scraped" | "error" | "";
  loading_tab: boolean;
  url: string;
  requesting_from_sat: boolean;
  requesting_from_sat_retry: boolean;
  date: string;
}
