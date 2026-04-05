import { useDisableButtonsCFDI } from "@hooks/useDisableButtonsCFDI";

type propsType = {
  isFetchingCFDICount: boolean;
  isFetchingPayCFDICount: boolean;
  customDomain: Domain;
  payCfdiCount: CFDICount | null;
  cfdiCount: CFDICount | null;
  canAccessPayroll: boolean;
  search: string;
  advancedFilterDomain: Domain;
};

export default function getCFDITabs(props: propsType) {
  const {
    isFetchingCFDICount,
    isFetchingPayCFDICount,
    customDomain,
    payCfdiCount,
    cfdiCount,
    canAccessPayroll,
    search,
    advancedFilterDomain,
  } = props;

  const isCFDIButtonDisabled = useDisableButtonsCFDI();

  const isSearchOrFilter = search !== "" || advancedFilterDomain.length > 0;

  const tabs = [
    {
      label:
        isSearchOrFilter && cfdiCount?.I === ""
          ? "Ingreso"
          : `Ingreso (${
              isFetchingPayCFDICount || isFetchingCFDICount
                ? "..."
                : customDomain.length > 0
                ? payCfdiCount?.I
                : cfdiCount?.I
            })`,
      key: "I",
      style: {
        backgroundColor: "white",
        padding: "15px 15px 0 15px",
      },
      disabled: isCFDIButtonDisabled,
    },
    {
      label:
        isSearchOrFilter && cfdiCount?.E === ""
          ? "Egreso"
          : `Egreso (${isFetchingCFDICount ? "..." : cfdiCount?.E})`,
      key: "E",
      style: {
        backgroundColor: "white",
        padding: "15px 15px 0 15px",
      },
      disabled: isCFDIButtonDisabled,
    },
    {
      label:
        isSearchOrFilter && cfdiCount?.T === ""
          ? "Traslado"
          : `Traslado (${isFetchingCFDICount ? "..." : cfdiCount?.T})`,
      key: "T",
      style: {
        backgroundColor: "white",
        padding: "15px 15px 0 15px",
      },
      disabled: isCFDIButtonDisabled,
    },
  ];
  if (canAccessPayroll) {
    tabs.push({
      label:
        isSearchOrFilter && cfdiCount?.N === ""
          ? "Nómina"
          : `Nómina (${isFetchingCFDICount ? "..." : cfdiCount?.N})`,
      key: "N",
      style: {
        backgroundColor: "white",
        padding: "15px 15px 0 15px",
      },
      disabled: isCFDIButtonDisabled,
    });
  }
  tabs.push({
    label:
      isSearchOrFilter && cfdiCount?.P === ""
        ? "Pago"
        : `Pago (${isFetchingCFDICount ? "..." : cfdiCount?.P})`,
    key: "P",
    style: {
      backgroundColor: "white",
      padding: "15px 15px 0 15px",
    },
    disabled: isCFDIButtonDisabled,
  });

  return tabs;
}
