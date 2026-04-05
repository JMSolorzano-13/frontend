import { ADD_CFDI_Types } from "@constants/Enums";
import moment from "moment";

export function formatDatesWithOperators(domain: Domain) {
  const formattedDomain: Domain = [];
  domain.forEach((d) => {
    if (["FechaFiltro", "FechaCertificacionSat"].includes(d[0]) && d[2]) {
      const date = new Date(String(d[2]));
      if (d[1] === "=") {
        const initialDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const finalDate = new Date(initialDate.getTime() + 24 * 60 * 60 * 1000);
        formattedDomain.push([
          d[0],
          ">=",
          initialDate
            .toISOString()
            .replaceAll("Z", "")
            .replace("05:00:00.000", "00:00:00.000")
            .replace("06:00:00.000", "00:00:00.000"),
        ]);
        formattedDomain.push([
          d[0],
          "<",
          finalDate
            .toISOString()
            .replaceAll("Z", "")
            .replace("05:00:00.000", "00:00:00.000")
            .replace("06:00:00.000", "00:00:00.000"),
        ]);
      } else if (d[1] === ">") {
        const finalDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          23,
          59,
          59,
          999
        );
        formattedDomain.push([
          d[0],
          ">",
          finalDate
            .toISOString()
            .replaceAll("Z", "")
            .replace("05:00:00.000", "00:00:00.000")
            .replace("06:00:00.000", "00:00:00.000"),
        ]);
      } else if (d[1] === ">=") {
        const finalDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
        formattedDomain.push([
          d[0],
          ">=",
          finalDate
            .toISOString()
            .replaceAll("Z", "")
            .replace("05:00:00.000", "00:00:00.000")
            .replace("06:00:00.000", "00:00:00.000"),
        ]);
      } else if (d[1] === "<") {
        const initialDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          0,
          0,
          0,
          0
        );
        formattedDomain.push([
          d[0],
          "<",
          initialDate
            .toISOString()
            .replaceAll("Z", "")
            .replace("05:00:00.000", "00:00:00.000")
            .replace("06:00:00.000", "00:00:00.000"),
        ]);
      } else if (d[1] === "<=") {
        const initialDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          23,
          59,
          59,
          999
        );
        formattedDomain.push([
          d[0],
          "<=",
          initialDate
            .toISOString()
            .replaceAll("Z", "")
            .replace("05:00:00.000", "00:00:00.000")
            .replace("06:00:00.000", "00:00:00.000"),
        ]);
      }
    } else {
      formattedDomain.push(d);
    }
  });

  return formattedDomain;
}

// TODO: Is this for efos? Why is this being used in ADD totals?
export const efosDomainBuilder = (efosPeriodDates: string): Domain => {
  const pdates = efosPeriodDates.split("|");
  const dateDomain: Domain = [
    ["Fecha", ">=", new Date(pdates[0]).toISOString().replaceAll("Z", "")],
    ["Fecha", "<", new Date(pdates[1]).toISOString().replaceAll("Z", "")],
  ];
  return dateDomain;
};

export const domainBuilderForDates = (periodDates: string): Domain => {
  const pdates = periodDates.split("|");
  const dateDomain: Domain = [
    ["Fecha", ">=", new Date(pdates[0]).toISOString().replaceAll("Z", "")],
    ["Fecha", "<", new Date(pdates[1]).toISOString().replaceAll("Z", "")],
  ];
  return dateDomain;
};

export function buildModalDomain(module: CFDIModule, efos: Domain, extraDomain: Domain) {
  const tickettype: Domain = [
    [
      "TipoDeComprobante",
      "in",
      [
        ADD_CFDI_Types.INGRESS,
        ADD_CFDI_Types.EGRESS,
        ADD_CFDI_Types.PAYMENT,
        ADD_CFDI_Types.PAYROLL,
        ADD_CFDI_Types.TRANSFER,
      ],
    ],
  ];
  const availableCanBeSend: Domain = [
    ...efos,
    ...tickettype,
    ...extraDomain,
    ["Estatus", "=", true],
    ["from_xml", "=", true],
    ["add_exists", "=", false],
  ];

  const canceledCanBeSend: Domain = [...efos, ...tickettype, ["Estatus", "=", false]];

  if (module === "issued") {
    const receivedAvailableCanBeSend: Domain = [...availableCanBeSend, ["is_issued", "=", false]];
    const receivedCanceledCanBeSend: Domain = [
      ...canceledCanBeSend,
      ["is_issued", "=", false],
      ["add_exists", "=", true],
      ["add_cancel_date", "=", null],
    ];
    const receivedCanceledCanBeBoth: Domain = [
      ...canceledCanBeSend,
      ["is_issued", "=", false],
      ["add_exists", "=", false],
      ["add_cancel_date", "=", null],
      ["from_xml", "=", true],
    ];

    return {
      available: receivedAvailableCanBeSend,
      canceled: receivedCanceledCanBeSend,
      canceledBoth: receivedCanceledCanBeBoth,
    };
  }

  const issuedAvailableCanBeSend: Domain = [...availableCanBeSend, ["is_issued", "=", true]];
  const issuedCanceledCanBeSend: Domain = [
    ...canceledCanBeSend,
    ["is_issued", "=", true],
    ["add_exists", "=", true],
    ["add_cancel_date", "=", null],
  ];
  const issuedCanceledCanBeBoth: Domain = [
    ...canceledCanBeSend,
    ["is_issued", "=", true],
    ["add_exists", "=", false],
    ["add_cancel_date", "=", null],
    ["from_xml", "=", true],
  ];

  return {
    available: issuedAvailableCanBeSend,
    canceled: issuedCanceledCanBeSend,
    canceledBoth: issuedCanceledCanBeBoth,
  };
}

export function buildIVADomain(
  tab: TabIVAType,
  date: string[],
  modalType: "transferred" | "creditable",
  isYear: boolean,
  isExercise: boolean
) {
  const domain: Domain = [];
  if (tab === "ALL") {
    domain.push(
      ["is_issued", "=", modalType === "transferred" ? true : false],
      ["Estatus", "=", true],
      ["Version", "=", "4.0"]
    );
    if (modalType === "creditable") {
      domain.push(
        ["FechaFiltro", ">=", date[0].replaceAll("Z", "")],
        ["FechaFiltro", "<", date[1].replaceAll("Z", "")]
      );
    }
  }
  // <Cash Stuff>
  if (tab === "CASH") {
    domain.push(
      ["MetodoPago", "=", "PUE"],
      ["is_issued", "=", modalType === "transferred" ? true : false],
      ["Version", "=", "4.0"],
      ["Estatus", "=", true]
    );
    if (isYear && isExercise) {
      domain.push(
        ["PaymentDate", ">=", `${moment.utc(date[0]).format("YYYY")}-01-01T00:00:00.000`],
        ["PaymentDate", "<", `${moment.utc(date[1]).format("YYYY")}-01-01T00:00:00.000`]
      );
    } else if (!isYear && isExercise) {
      domain.push(
        ["PaymentDate", ">=", `${moment.utc(date[0]).format("YYYY")}-01-01T00:00:00.000`],
        [
          "PaymentDate",
          "<",
          `${moment.utc(date[0]).add(1, "month").format("YYYY-MM")}-01T00:00:00.000`,
        ]
      );
    } else {
      domain.push(
        ["PaymentDate", ">=", date[0].replaceAll("Z", "")],
        ["PaymentDate", "<", date[1].replaceAll("Z", "")]
      );
    }
  }
  // </Cash Stuff>
  if (tab === "CREDIT") {
    domain.push(
      ["is_issued", "=", modalType === "transferred" ? true : false],
      ["Version", "=", "4.0"],
      ["Estatus", "=", true]
    );
    if (isYear && isExercise) {
      domain.push(
        ["PaymentDate", ">=", date[0].replaceAll("Z", "")],
        ["PaymentDate", "<", date[1].replaceAll("Z", "")]
      );
    } else if (!isYear && isExercise) {
      domain.push(
        ["PaymentDate", ">=", `${moment.utc(date[0]).format("YYYY")}-01-01T00:00:00.000`],
        [
          "PaymentDate",
          "<",
          `${moment.utc(date[0]).add(1, "month").format("YYYY-MM")}-01T00:00:00.000`,
        ]
      );
    } else {
      domain.push(
        ["PaymentDate", ">=", date[0].replaceAll("Z", "")],
        ["PaymentDate", "<", date[1].replaceAll("Z", "")]
      );
    }
  }
  if (tab === "WITHHOLDINGCASH") {
    domain.push(
      ["MetodoPago", "=", "PUE"],
      ["is_issued", "=", modalType === "transferred" ? true : false],
      ["Version", "=", "4.0"],
      ["Estatus", "=", true],
      ["RetencionesIVAMXN", ">", 0]
    );
    if (isYear && isExercise) {
      domain.push(
        [
          "PaymentDate",
          ">=",
          `${moment.utc(date[0]).subtract(1, "year").format("YYYY")}-12-01T00:00:00.000`,
        ],
        ["PaymentDate", "<", `${moment.utc(date[0]).format("YYYY")}-01-01T00:00:00.000`]
      );
    } else if (!isYear && isExercise) {
      domain.push(
        [
          "PaymentDate",
          ">=",
          `${moment.utc(date[0]).subtract(1, "year").format("YYYY")}-12-01T00:00:00.000`,
        ],
        ["PaymentDate", "<", `${moment.utc(date[0]).format("YYYY-01")}-01T00:00:00.000`]
      );
    } else {
      domain.push(
        [
          "PaymentDate",
          ">=",
          `${moment.utc(date[0]).subtract(1, "month").format("YYYY-MM")}-01T00:00:00.000`,
        ],
        ["PaymentDate", "<", `${moment.utc(date[0]).format("YYYY-MM")}-01T00:00:00.000`]
      );
    }
  }
  if (tab === "WITHHOLDINGCREDIT") {
    domain.push(
      ["is_issued", "=", modalType === "transferred" ? true : false],
      ["Version", "=", "4.0"],
      ["Estatus", "=", true],
      ["RetencionesIVAMXN", ">", 0]
    );
    if (isExercise && isYear) {
      domain.push(
        [
          "PaymentDate",
          ">=",
          `${moment.utc(date[0]).subtract(1, "year").format("YYYY")}-12-01T00:00:00.000`,
        ],
        ["PaymentDate", "<", `${moment.utc(date[0]).format("YYYY")}-01-01T00:00:00.000`]
      );
    } else if (!isYear && isExercise) {
      domain.push(
        [
          "PaymentDate",
          ">=",
          `${moment.utc(date[0]).subtract(1, "year").format("YYYY")}-12-01T00:00:00.000`,
        ],
        ["PaymentDate", "<", `${moment.utc(date[0]).format("YYYY-01")}-01T00:00:00.000`]
      );
    } else {
      domain.push(
        [
          "PaymentDate",
          ">=",
          `${moment.utc(date[0]).subtract(1, "month").format("YYYY-MM")}-01T00:00:00.000`,
        ],
        ["PaymentDate", "<", `${moment.utc(date[0]).format("YYYY-MM")}-01T00:00:00.000`]
      );
    }
  }
  if (tab === "CREDIT_NOTES") {
    domain.push(
      ["is_issued", "=", modalType === "transferred" ? true : false],
      ["Version", "=", "4.0"],
      ["Estatus", "=", true],
      ["TipoDeComprobante", "=", "E"]
    );
    if (isYear && isExercise) {
      domain.push(
        ["PaymentDate", ">=", `${moment.utc(date[0]).format("YYYY")}-01-01T00:00:00.000`],
        ["PaymentDate", "<", `${moment.utc(date[1]).format("YYYY")}-01-01T00:00:00.000`]
      );
    } else if (!isYear && isExercise) {
      domain.push(
        ["PaymentDate", ">=", `${moment.utc(date[0]).format("YYYY")}-01-01T00:00:00.000`],
        [
          "PaymentDate",
          "<",
          `${moment.utc(date[0]).add(1, "month").format("YYYY-MM")}-01T00:00:00.000`,
        ]
      );
    } else {
      domain.push(
        ["PaymentDate", ">=", date[0].replaceAll("Z", "")],
        ["PaymentDate", "<", date[1].replaceAll("Z", "")]
      );
    }
  }
  return domain;
}

export function getDomainDate(periodToSend: string, periodType: string, yearly: boolean) {
  // By default we pass the period (Not Yearly)
  let startDate = periodToSend;
  let endDate = moment(periodToSend).add(1, "month").format("YYYY-MM-DD");

  // Exercise
  if (periodType === "excercise" && !yearly) {
    startDate = `${moment(periodToSend).format("YYYY")}-01-01`;
    endDate = moment(periodToSend).add(1, "month").format("YYYY-MM-DD");
  }

  // Yearly
  if (periodType === "excercise" && yearly) {
    const currentYear = `${moment(periodToSend).format("YYYY")}-01-01`;
    startDate = currentYear;
    endDate = moment(currentYear).add(1, "year").format("YYYY-MM-DD");
  }

  return { startDate, endDate };
}

export function buildNotConsiderIVA(modalType: "creditable" | "transferred", pdates: string[]) {
  const domain: Domain = [
    ["Estatus", "=", true],
    ["Version", "=", "4.0"],
    ["is_issued", "=", !(modalType === "creditable")],
    ["ExcludeFromIVA", "=", true],
  ];
  if (modalType === "creditable") {
    domain?.push(
      ["TipoDeComprobante", "in", ["I", "E"]],
      ["FechaFiltro", ">=", `${moment.utc(pdates[0]).format("YYYY-MM-DD")}T00:00:00.000`],
      ["FechaFiltro", "<", `${moment.utc(pdates[1]).format("YYYY-MM-DD")}T00:00:00.000`]
    );
  }

  if (modalType === "transferred") {
    domain?.push(
      ["TipoDeComprobante", "in", ["I", "E", "P"]],
      ["PaymentDate", ">=", `${moment.utc(pdates[0]).format("YYYY-MM-DD")}T00:00:00.000`],
      ["PaymentDate", "<", `${moment.utc(pdates[1]).format("YYYY-MM-DD")}T00:00:00.000`]
    );
  }
  return domain;
}

export function buildMovedIVA(modalType: "creditable" | "transferred", pdates: string[]) {
  const domain: Domain = [
    ["Estatus", "=", true],
    ["Version", "=", "4.0"],
    ["is_issued", "=", !(modalType === "creditable")],
    ["is_moved", "=", true],
    ["ExcludeFromIVA", "=", false],
    ["TipoDeComprobante", "in", ["I", "E"]],
  ];

  if (modalType === "creditable") {
    domain?.push(
      ["FechaFiltro", ">=", `${moment.utc(pdates[0]).format("YYYY-MM-DD")}T00:00:00.000`],
      ["FechaFiltro", "<", `${moment.utc(pdates[1]).format("YYYY-MM-DD")}T00:00:00.000`]
    );
  }
  return domain;
}
