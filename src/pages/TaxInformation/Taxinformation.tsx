import { useEffect, useState } from "react";
import { Card, Space, Tabs, Grid, TabsProps } from "antd";
import Container, { PropsFromRedux } from "./TaxInformationContainer";
import { CurrentTab } from "./_components/CurrentTab";
import Title from "antd/lib/typography/Title";

const { useBreakpoint } = Grid;

const Taxinformation = ({
  actions,
  response,
  loading_tab,
  requesting_from_sat,
  requesting_from_sat_retry,
}: PropsFromRedux) => {
  const screens = useBreakpoint();
  const [tab, setTab] = useState("constancy");
  const items: TabsProps["items"] = [
    {
      id: "constancy",
      label: "Constancia",
      key: "constancy",
      disabled: requesting_from_sat || requesting_from_sat_retry,
      style: { marginTop: 20 },
      children: (
        <CurrentTab
          updatePage={() => actions.updateInformation(true)}
          fetchDocument={() => actions.fetchInformation(true)}
          fetchDocumentRetry={() => actions.fetchInformationretry(true)}
          loadingStage={() => actions.loadingInformation(true)}
          download={response?.urlDownload}
          title="constancia de situación fiscal"
          loading={actions.loadingInformation}
          url={response?.url}
          date_owner={response.date}
          date={response?.scrap_status_constancy?.updated_at}
          tab={tab}
          status={response?.scrap_status_constancy?.current_status}
          loading_tab={loading_tab}
          requesting_from_sat={requesting_from_sat}
          requesting_from_sat_retry={requesting_from_sat_retry}
        />
      ),
    },
    {
      id: "opinion",
      label: "Opinión",
      key: "opinion",
      disabled: requesting_from_sat || requesting_from_sat_retry,
      style: { marginTop: 20 },
      children: (
        <CurrentTab
          updatePage={() => actions.updateInformation(false)}
          fetchDocument={() => actions.fetchInformation(false)}
          fetchDocumentRetry={() => actions.fetchInformationretry(false)}
          loadingStage={() => actions.loadingInformation(false)}
          download={response?.urlDownload}
          date_owner={response.date}
          date={response?.scrap_status_opinion?.updated_at}
          title="opinión de cumplimiento"
          loading={actions.loadingInformation}
          url={response?.url}
          tab={tab}
          status={response?.scrap_status_opinion?.current_status}
          loading_tab={loading_tab}
          requesting_from_sat={requesting_from_sat}
          requesting_from_sat_retry={requesting_from_sat_retry}
        />
      ),
    },
  ];

  
  useEffect(() => {
    actions.fetchInformation(tab === "constancy");
  }, [tab]);

  return (
    <>
      <Title level={5} style={{ fontWeight: 400 }} id="title-tax-information">
        Información fiscal
      </Title>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Card>
          <Tabs
            activeKey={tab}
            onChange={(newTab) => setTab(newTab)}
            items={items}
            tabPosition={screens.sm ? "left" : "top"}
          />
        </Card>
      </Space>
    </>
  );
};

export default Container(Taxinformation);
