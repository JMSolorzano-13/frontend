import { upperCase } from "lodash";

export default function splitNameAndGetTwo(name: string | undefined) {
  if (name) {
    const nameSplitted = name.split(" ");

    if (nameSplitted.length > 1) {
      return `${nameSplitted[0]} ${nameSplitted[1]}`;
    }

    return nameSplitted[0];
  }
}

export function splitNameAndGetChars(name: string | undefined) {
  if (name) {
    const nameSplitted = name.split(" ");

    if (nameSplitted.length > 1) {
      return upperCase(`${nameSplitted[0][0]}${nameSplitted[1][0]}`);
    }

    return upperCase(nameSplitted[0][0]);
  }
}
