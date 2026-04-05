import { setupWorker } from "msw";
import { companyHandlers } from "./companyHandlers";
import { authHandlers } from "./authHandlers";
import { userHandlers } from "./userHandlers";
import { satHandlers } from "./satlogHandlers";
import { policiesHandler } from "./policies/getPoliciy";
import { cfdiAttachmentsHandlers } from "./attachments/getCFDIsAttachments";
import { attachmentsHandlers } from "./attachments/getAttachments";
import { uploadAttachmentsHandlers } from "./attachments/uploadAttachments";
import { test1Handlers } from "./attachments/s3.test-1";
import { test2Handlers } from "./attachments/s3.test-2";
import { NotificationsHandler } from "./notifications/getNotifications";
// import { cfdiHandlers } from "./cfdiHandlers";

export const worker = setupWorker(
  ...companyHandlers,
  ...authHandlers,
  ...userHandlers,
  ...policiesHandler,
  // ...cfdiHandlers,
  ...satHandlers,
  ...cfdiAttachmentsHandlers,
  ...attachmentsHandlers,
  ...uploadAttachmentsHandlers,
  ...test1Handlers,
  ...test2Handlers,
  ...NotificationsHandler
);
