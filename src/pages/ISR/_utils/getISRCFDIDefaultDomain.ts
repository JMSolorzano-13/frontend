import { InternalTabType, TabType, TopTabSectionType } from "../_types/ISRTypes";

// export type TabType =
//   | "ALL"
//   | "CASH"
//   | "PAYMENT"
//   | "EXCLUDED"
//   | "EXCLUDED-PREFILLED"
//   | "DISCOUNTS"
//   | "EGRESS"
//   | "INVESTMENTS";

export default function getISRCFDIDefaultDomain(
  tab: TabType,
  topTab: TopTabSectionType,
  internalTab?: InternalTabType
): DomainItem[] {
  let defaultDomain: DomainItem[] = [
    ["Estatus", "=", true],
    ["Version", "=", "4.0"],
    ["used_in_isr", "=", true],
    ["ExcludeFromISR", "=", false],
  ];

  // Incomes
  if (topTab === "incomes" && tab === "CASH") {
    defaultDomain = [
      ["MetodoPago", "=", "PUE"],
      ["Estatus", "=", true],
      ["Version", "=", "4.0"],
      ["TipoDeComprobante", "=", "I"],
      ["ExcludeFromISR", "=", false],
    ];
  }

  if (topTab === "incomes" && tab === "PAYMENT") {
    defaultDomain = [
      ["Estatus", "=", true],
      ["TipoDeComprobante", "=", "P"],
      ["Version", "=", "4.0"],
      ["ExcludeFromISR", "=", false],
    ];
  }

  if (topTab === "incomes" && tab === "EXCLUDED") {
    defaultDomain = [
      ["Estatus", "=", true],
      ["Version", "=", "4.0"],
      ["TipoDeComprobante", "in", ["I", "P"]],
      ["ExcludeFromISR", "=", true],
    ];
  }

  // Deductions
  if (topTab === "deductions" && tab === "CASH") {
    defaultDomain = [
      ["TipoDeComprobante", "=", "I"],
      ["Estatus", "=", true],
      ["MetodoPago", "=", "PUE"],
      ["Version", "=", "4.0"],
      ["FormaPago", "in", ["02", "03", "04", "05", "06", "28", "29"]],
      ["UsoCFDIReceptor", "in", ["G03", "G01"]],
      ["is_issued", "=", false],
      ["ExcludeFromISR", "=", false],
    ];
  }

  if (topTab === "deductions" && tab === "PAYMENT") {
    defaultDomain = [
      ["cfdi_origin.TipoDeComprobante", "=", "P"],
      ["payment_related.FormaDePagoP", "in", ["02", "03", "04", "05", "06", "28", "29"]],
      ["cfdi_related.UsoCFDIReceptor", "in", ["G01", "G03"]],
      ["ExcludeFromISR", "=", false],
      ["cfdi_origin.Estatus", "=", true],
      ["cfdi_origin.is_issued", "=", false],
    ];
  }

  if (
    topTab === "deductions" &&
    tab === "EXCLUDED-PREFILLED" &&
    internalTab === "EXCLUDED-PREFILLED-INCOMES"
  ) {
    defaultDomain = [
      ["is_issued", "=", false],
      ["TipoDeComprobante", "=", "I"],
      ["MetodoPago", "=", "PUE"],
      ["Estatus", "=", true],
      ["Version", "=", "4.0"],
      ["ExcludeFromISR", "=", false],
      [
        "FormaPago",
        "in",
        ["01", "08", "12", "13", "14", "15", "17", "23", "24", "25", "26", "27", "30", "31", "99"],
      ],
    ];
  }
  if (
    topTab === "deductions" &&
    tab === "EXCLUDED-PREFILLED" &&
    internalTab === "EXCLUDED-PREFILLED-PAYMENT"
  ) {
    defaultDomain = [
      ["cfdi_origin.is_issued", "=", true],
      ["cfdi_origin.Estatus", "=", true],
      [
        "payment_related.FormaDePagoP",
        "in",
        ["01", "08", "12", "13", "14", "15", "17", "23", "24", "25", "26", "27", "30", "31", "99"],
      ],
      [
        "cfdi_related.UsoCFDIReceptor",
        "not in",
        ["I01", "I02", "I03", "I04", "I05", "I06", "I07", "I08"],
      ],
      ["ExcludeFromISR", "=", false],
    ];
  }

  if (tab === "DISCOUNTS" && internalTab === "DISCOUNTS-INCOMES") {
    defaultDomain = [
      ["is_issued", "=", true],
      ["TipoDeComprobante", "=", "I"],
      ["Estatus", "=", true],
      ["MetodoPago", "=", "PUE"],
      ["ExcludeFromISR", "=", false],
      ["Version", "=", "4.0"],
    ];
  }

  if (topTab === "deductions" && tab === "DISCOUNTS" && internalTab === "DISCOUNTS-EGRESS") {
    defaultDomain = [
      ["is_issued", "=", true],
      ["TipoDeComprobante", "=", "E"],
      ["Estatus", "=", true],
      ["MetodoPago", "=", "PUE"],
      ["ExcludeFromISR", "=", false],
      ["Version", "=", "4.0"],
    ];
  }

  if (topTab === "deductions" && tab === "EGRESS") {
    defaultDomain = [
      ["is_issued", "=", false],
      ["TipoDeComprobante", "=", "E"],
      ["Estatus", "=", true],
      ["Version", "=", "4.0"],
      ["ExcludeFromISR", "=", false],
    ];
  }

  if (topTab === "deductions" && tab === "INVESTMENTS") {
    defaultDomain = [
      ["is_issued", "=", false],
      ["TipoDeComprobante", "=", "I"],
      ["Estatus", "=", true],
      ["Version", "=", "4.0"],
      ["UsoCFDIReceptor", "in", ["I01", "I02", "I03", "I04", "I05", "I06", "I07", "I08"]],
    ];
  }

  // Excluded Deductions
  if (topTab === "deductions" && tab === "EXCLUDED" && internalTab === "CASH") {
    defaultDomain = [
      ["TipoDeComprobante", "=", "I"],
      ["Estatus", "=", true],
      ["MetodoPago", "=", "PUE"],
      ["Version", "=", "4.0"],
      ["FormaPago", "in", ["02", "03", "04", "05", "06", "28", "29"]],
      ["UsoCFDIReceptor", "in", ["G03", "G01"]],
      ["is_issued", "=", false],
      ["ExcludeFromISR", "=", true],
    ];
  }
  if (topTab === "deductions" && tab === "EXCLUDED" && internalTab === "PAYMENT") {
    defaultDomain = [
      ["cfdi_origin.TipoDeComprobante", "=", "P"],
      ["payment_related.FormaDePagoP", "in", ["02", "03", "04", "05", "06", "28", "29"]],
      ["cfdi_related.UsoCFDIReceptor", "in", ["G01", "G03"]],
      ["ExcludeFromISR", "=", true],
      ["cfdi_origin.Estatus", "=", true],
      ["cfdi_origin.is_issued", "=", false],
    ];
  }
  if (topTab === "deductions" && tab === "EXCLUDED" && internalTab === "EXCLUDED-INCOMES") {
    defaultDomain = [
      ["is_issued", "=", true],
      ["TipoDeComprobante", "=", "I"],
      ["Estatus", "=", true],
      ["MetodoPago", "=", "PUE"],
      ["ExcludeFromISR", "=", true],
      ["Version", "=", "4.0"],
    ];
  }

  if (topTab === "deductions" && tab === "EXCLUDED" && internalTab === "EXCLUDED-EGRESS") {
    defaultDomain = [
      ["is_issued", "=", true],
      ["TipoDeComprobante", "=", "E"],
      ["Estatus", "=", true],
      ["MetodoPago", "=", "PUE"],
      ["ExcludeFromISR", "=", true],
      ["Version", "=", "4.0"],
    ];
  }

  if (topTab === "deductions" && tab === "EXCLUDED" && internalTab === "EXCLUDED-INCOMES-PUE") {
    defaultDomain = [
      ["is_issued", "=", false],
      ["TipoDeComprobante", "=", "I"],
      ["MetodoPago", "=", "PUE"],
      ["Estatus", "=", true],
      ["Version", "=", "4.0"],
      ["ExcludeFromISR", "=", true],
      [
        "FormaPago",
        "in",
        ["01", "08", "12", "13", "14", "15", "17", "23", "24", "25", "26", "27", "30", "31", "99"],
      ],
    ];
  }

  if (topTab === "deductions" && tab === "EXCLUDED" && internalTab === "EGRESS") {
    defaultDomain = [
      ["is_issued", "=", false],
      ["TipoDeComprobante", "=", "E"],
      ["Estatus", "=", true],
      ["Version", "=", "4.0"],
      ["ExcludeFromISR", "=", true],
    ];
  }

  if (topTab === "deductions" && tab === "EXCLUDED" && internalTab === "EXCLUDED-PAYMENTS") {
    defaultDomain = [
      ["cfdi_origin.is_issued", "=", true],
      ["cfdi_origin.Estatus", "=", true],
      [
        "payment_related.FormaDePagoP",
        "in",
        ["01", "08", "12", "13", "14", "15", "17", "23", "24", "25", "26", "27", "30", "31", "99"],
      ],
      [
        "cfdi_related.UsoCFDIReceptor",
        "not in",
        ["I01", "I02", "I03", "I04", "I05", "I06", "I07", "I08"],
      ],
      ["ExcludeFromISR", "=", true],
    ];
  }
  return defaultDomain;
}
