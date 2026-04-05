import {
  AppConfigDataClient,
  GetLatestConfigurationCommand,
  StartConfigurationSessionCommand,
} from "@aws-sdk/client-appconfigdata";
const client = new AppConfigDataClient({
  region: import.meta.env.VITE_REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_REACT_APP_AWS_KEY,
    secretAccessKey: import.meta.env.VITE_REACT_APP_AWS_SECRET,
  },
});

let existingToken: string;

const getToken = async () => {
  const getSession = new StartConfigurationSessionCommand({
    ApplicationIdentifier: import.meta.env.VITE_REACT_APP_AWS_APID,
    ConfigurationProfileIdentifier: import.meta.env.VITE_REACT_APP_AWS_CPI,
    EnvironmentIdentifier: import.meta.env.VITE_REACT_APP_AWS_ENVI,
  });

  const sessionToken = await client.send(getSession);
  return sessionToken.InitialConfigurationToken || "";
};

export const featureFlag = async () => {
  if (!existingToken) {
    existingToken = await getToken();
  }
  try {
    const command = new GetLatestConfigurationCommand({
      ConfigurationToken: existingToken,
    });
    const response = await client.send(command);
    const configString = new TextDecoder().decode(response.Configuration);

    const config = JSON.parse(configString);

    const isActiveFlag = config.list_company_block.enabled;
    const blockedCompanyIdentifiers = config.list_company_block.list_company_block;

    return {
      isActiveFlag,
      blockedCompanyIdentifiers,
    };
  } catch (err) {
    console.error("Error fetching feature flag:", err);

    return {
      isActiveFlag: false,
      blockedCompanyIdentifiers: [],
    };
  }
};

export const fetchFlag = async () => {
  const result = await featureFlag();
  return result;
};
