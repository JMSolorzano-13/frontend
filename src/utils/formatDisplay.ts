import { format } from "@formkit/tempo";
import moment from "moment";

const moneyFormatter = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const moneyFormatterInt = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});

export enum DisplayType {
  STRING,
  INTEGER,
  FLOAT,
  DATE,
  DATETIME,
  DATETIMEHOURS,
  TIMEZONE,
  TIMEZONEDATE,
  TIMEZONEHOURS,
  PUREDATE,
  PUREDATETIME,
  MONEY,
  MONEYWITHINTEGER,
  COMMAS,
  MONEY_CLEAN,
  SIIGO,
}

const TIMEZONE = "America/Mexico_City";

export function formatDisplay(
  value: string | number | Date | null | undefined,
  displayType: DisplayType
) {
  if (value === null || value === undefined) {
    return "-";
  }
  switch (displayType) {
    case DisplayType.STRING:
      return String(value);
    case DisplayType.INTEGER:
      return Math.trunc(Number(value));
    case DisplayType.FLOAT:
      return Number(value).toFixed(2);
    case DisplayType.MONEY:
      return moneyFormatter.format(Number(value));
    case DisplayType.MONEYWITHINTEGER:
      return moneyFormatterInt.format(Math.trunc(Number(value)));
    case DisplayType.DATE: {
      return new Date(`${value}Z`).toLocaleDateString();
    }
    case DisplayType.DATETIME: {
      return new Date(`${value}Z`).toLocaleString();
    }
    case DisplayType.DATETIMEHOURS: {
      return new Date(`${value}Z`).toLocaleTimeString();
    }
    case DisplayType.TIMEZONE: {
      return new Date(value).toLocaleString("es-MX", {
        timeZone: TIMEZONE,
      });
    }
    case DisplayType.TIMEZONEDATE: {
      return new Date(value).toLocaleDateString("es-MX", {
        timeZone: TIMEZONE,
      });
    }
    case DisplayType.TIMEZONEHOURS: {
      return new Date(value).toLocaleTimeString("es-MX", {
        timeZone: TIMEZONE,
      });
    }
    case DisplayType.PUREDATE: {
      return moment(value).format("DD/MM/YYYY");
    }
    case DisplayType.PUREDATETIME: {
      return new Date(value).toLocaleString();
    }
    case DisplayType.COMMAS: {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    case DisplayType.MONEY_CLEAN:
      return value ? moneyFormatter.format(Number(value)) : " ";
    case DisplayType.SIIGO: {
      const time = new Date(`${value}Z`);
      return `${format({
        date: time,
        format: "D MMM YYYY, h:mm",
        locale: "es",
        tz: TIMEZONE,
      })} ${format({
        date: time,
        format: "a",
        locale: "en",
        tz: TIMEZONE,
      })}`;
    }
    default:
      return value === undefined || null ? "" : (value as string);
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
function manageReturn(value: undefined | null) {
  return "";
}
/* eslint-enable @typescript-eslint/no-unused-vars */
