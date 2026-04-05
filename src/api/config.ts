import http from "./_http";

/**
 * Fetch the configuration of a company
 * @param companyId the id of the company
 * @returns the configuration of the company
 */
export const fetchConfig = async (companyId: string) => {
  const { data } = await http.get(`/User/config/${companyId}`);
  return data as UserConfig;
};

/**
 * Update the configuration of a company
 * @param companyId company to be updated
 * @param config newly created config
 * @returns the updated config
 */
export const saveNewConfig = async (companyIdentifier: string, config: object) => {
  const payload = {
    company_identifier: companyIdentifier,
    config,
  };
  const { data } = await http.post("/User/config", payload);
  return data as string;
};
