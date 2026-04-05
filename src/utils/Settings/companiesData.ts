export const getColumnsCompanies = (companies: Company[], userData: UserData | null) => {
  const data = companies.map((company) => ({
    empresa: company.name,
    rfc: company.rfc,
    owner: company.workspace.owner.email,
    id: company.id,
  }));

  const data2 = Object.values(userData?.access || {})
    .map((ud) => Object.values(ud.companies))
    .flat();
  const data3 = Object.values(userData?.access || {})
    .map((access) =>
      Object.entries(access.companies).map(([, company]) => ({
        ...company,
        owner_id: access.owner_id,
      }))
    )
    .flat();

  const combinedData = data.map((item) => {
    const companyData2 = data2.find((c) => c.id === item.id);
    const companyData3 = data3.find((c) => c.id === item.id);

    return {
      ...item,
      payroll: companyData2?.modules.includes("Payroll") ? "Sí" : "No",
      rol: companyData3?.owner_id === userData?.user.id ? "Propietario" : "Invitado",
    };
  });

  return [...combinedData];
};
