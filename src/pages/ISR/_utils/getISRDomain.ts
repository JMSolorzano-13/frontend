import { getISRDomainProps } from "../_types/ISRTypes";
import getDatesDomain from "./getDatesDomain";
import getISRCFDIDefaultDomain from "./getISRCFDIDefaultDomain";

export default function getISRDomain(props: getISRDomainProps) {
  const { company, topTab, tab, date, periodType, internalTab, filters } = props;
  const domain: DomainItem[] = [];
  if (company) {
    domain.push(["company_identifier", "=", company]);
  }

  const domainFilters = filters ? createDomainWithFilters(filters) : false;

  if (domainFilters) {
    domain.push(...domainFilters);
  }

  if (topTab === "incomes") {
    const defaultDomain: DomainItem[] = getISRCFDIDefaultDomain(tab, topTab);
    const datesDomain: DomainItem[] = getDatesDomain({ date, topTab, tab, periodType });

    domain.push(...defaultDomain, ...datesDomain);
    domain.push(["is_issued", "=", true]);

    return domain;
  } else {
    const defaultDomain: DomainItem[] = getISRCFDIDefaultDomain(tab, topTab, internalTab);
    const datesDomain: DomainItem[] = getDatesDomain({
      date,
      topTab,
      tab,
      periodType,
      internalTab,
    });

    domain.push(...defaultDomain, ...datesDomain);

    return domain;
  }
}

export function createDomainWithFilters(filters: any): false | DomainItem[] {
  const filtersNotNull = Object.keys(filters).filter((i) => filters[i] !== null);
  if (filtersNotNull) {
    return filtersNotNull.map((filterField) => [filterField, "in", filters[filterField]]);
  }
  return false;
}
