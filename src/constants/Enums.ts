export enum Tables {
  // CFDI ISSUED TABLE IDs
  CFDI_ISSUED = "cfdi_issued_table_v160424",
  CFDI_ISSUED_INGRESS = "cfdi_issued_ingress_v160424",
  CFDI_ISSUED_EGRESS = "cfdi_issued_egress_v160424",
  CFDI_ISSUED_TRANSFER = "cfdi_issued_transfer_v160424",
  CFDI_ISSUED_PAYROLL = "cfdi_issued_payroll_table_v210624",
  CFDI_ISSUED_PAYMENT = "cfdi_issued_payment_v160424",
  // CFDI RECEIVED TABLE IDs
  CFDI_RECEIVED = "cfdi_received_v160424",
  CFDI_RECEIVED_INGRESS = "cfdi_received_ingress_v160424",
  CFDI_RECEIVED_EGRESS = "cfdi_received_egress_v160424",
  CFDI_RECEIVED_TRANSFER = "cfdi_received_transfer_v160424",
  CFDI_RECEIVED_PAYROLL = "cfdi_received_payroll_v160424",
  CFDI_RECEIVED_PAYMENT = "cfdi_received_payment_v160424",
   // CFDI RECEIVED TABLE IDs for SIIGO
  SIIGO_CFDI_RECEIVED = "cfdi_received_v160424",
  SIIGO_CFDI_RECEIVED_INGRESS = "cfdi_received_ingress_v111225",
  SIIGO_CFDI_RECEIVED_EGRESS = "cfdi_received_egress_v160424",
  SIIGO_CFDI_RECEIVED_TRANSFER = "cfdi_received_transfer_v160424",
  SIIGO_CFDI_RECEIVED_PAYROLL = "cfdi_received_payroll_v160424",
  SIIGO_CFDI_RECEIVED_PAYMENT = "cfdi_received_payment_v160424",
  // CFDI ISSUED TOTALS TABLE IDs
  CFDI_ISSUED_TOTALS = "cfdi_issued_totals_v160424",
  CFDI_ISSUED_INGRESS_TOTALS = "cfdi_issued_ingress_totals_v160424",
  CFDI_ISSUED_EGRESS_TOTALS = "cfdi_issued_egress_totals_v160424",
  CFDI_ISSUED_TRANSFER_TOTALS = "cfdi_issued_transfer_totals_v160424",
  CFDI_ISSUED_PAYROLL_TOTALS = "cfdi_issued_payroll_totals_table_v160424",
  CFDI_ISSUED_PAYMENT_TOTALS = "cfdi_issued_payment_totals_v160424",
  // CFDI RECEIVED TOTALS TABLE IDs
  CFDI_RECEIVED_TOTALS = "cfdi_received_totals_v160424",
  CFDI_RECEIVED_INGRESS_TOTALS = "cfdi_received_ingress_totals_v160424",
  CFDI_RECEIVED_EGRESS_TOTALS = "cfdi_received_egress_totals_v160424",
  CFDI_RECEIVED_TRANSFER_TOTALS = "cfdi_received_transfer_totals_v160424",
  CFDI_RECEIVED_PAYROLL_TOTALS = "cfdi_received_payroll_totals_v160424",
  CFDI_RECEIVED_PAYMENT_TOTALS = "cfdi_received_payment_totals_v160424",
  // CFDI EFOS TABLE IDs
  CFDI_EFOS = "cfdi_efos",
  CFDI_EFOS_INGRESS = "cfdi_efos_ingress_v160424",
  CFDI_EFOS_EGRESS = "cfdi_efos_egress_v160424",
  CFDI_EFOS_TRANSFER = "cfdi_efos_transfer_v160424",
  CFDI_EFOS_PAYROLL = "cfdi_efos_payroll_v160424",
  CFDI_EFOS_PAYMENT = "cfdi_efos_payment_v160424",
  CFDI_EFOS_TOTALS = "cfdi_efos_totals_v160424",
  // ADD TABLE IDs
  ADD_ISSUED = "add_issued_v160424",
  ADD_ALL_ISSUED = "add_all_issued_v160424",
  ADD_RECEIVED = "add_received_v160424",
  ADD_ALL_RECEIVED = "add_all_received_v160424",
  // OTHER TABLE IDs
  CFDI_INGRESS_DETAILS_ISSUED = "cfdi_ingress_details_issued_v230524",
  CFDI_INGRESS_DETAILS_RECEIVED = "cfdi_ingress_details_received_v230524",
  CFDI_PAYROLL_DETAILS_ISSUED = "cfdi_payroll_details_issued_v220724",
  CFDI_PAYROLL_DETAILS_RECEIVED = "cfdi_payroll_details_received_v220724",
  CFDI_PAYMENT_DETAILS_ISSUED = "cfdi_payment_details_issued_v261124",
  CFDI_PAYMENT_DETAILS_RECEIVED = "cfdi_payment_details_received_v261124",
}

export enum CFDI_Types {
  INGRESS = "I",
  EGRESS = "E",
  TRANSFER = "T",
  PAYROLL = "N",
  PAYMENT = "P",
}

export enum ADD_CFDI_Types {
  ALL = "ALL",
  INGRESS = "I",
  EGRESS = "E",
  TRANSFER = "T",
  PAYROLL = "N",
  PAYMENT = "P",
}
