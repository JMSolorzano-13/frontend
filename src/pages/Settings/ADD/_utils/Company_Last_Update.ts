import moment from "moment";

export type CompanyLastUpdate = {
  companyIdentifier: string | null;
  last_update: string | null;
};

export function handleSaveCompanyLastUpdate(company_identifier: string | null) {
  const localStorageItem = localStorage.getItem("LastPastoCompanyRelationUpdate");
  const dateUpdate = moment().locale("es-mx").format("YYYY-MM-DD HH:mm:ss");

  if (localStorageItem) {
    try {
      const jsonLocalStorageItem = JSON.parse(localStorageItem);
      const currentCompany = jsonLocalStorageItem.find(
        (e: CompanyLastUpdate) => e.companyIdentifier === company_identifier
      );
      if (currentCompany) {
        jsonLocalStorageItem.map((e: CompanyLastUpdate) => {
          if (e.companyIdentifier === company_identifier) {
            e.last_update = dateUpdate;
          }
        });
        localStorage.setItem(
          "LastPastoCompanyRelationUpdate",
          JSON.stringify(jsonLocalStorageItem)
        );
      } else {
        jsonLocalStorageItem.push({
          companyIdentifier: company_identifier,
          last_update: dateUpdate,
        });
        localStorage.setItem(
          "LastPastoCompanyRelationUpdate",
          JSON.stringify(jsonLocalStorageItem)
        );
      }
    } catch (error) {
      const data = [
        {
          companyIdentifier: company_identifier,
          last_update: dateUpdate,
        },
      ];
      localStorage.setItem("LastPastoCompanyRelationUpdate", JSON.stringify(data));
    }
  } else {
    const data = [
      {
        companyIdentifier: company_identifier,
        last_update: dateUpdate,
      },
    ];
    localStorage.setItem("LastPastoCompanyRelationUpdate", JSON.stringify(data));
  }
}
