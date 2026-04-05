import { Col, Row } from "antd";
import Title from "antd/lib/typography/Title";
import { ViewPDF } from "./ViewPDF";
import { ViewAlerts } from "./ViewAlerts";
import { PropsCurrentTab } from "../_types/StateTypes";

export const CurrentTab = ({
  fetchDocument,
  updatePage,
  title,
  url,
  download,
  tab,
  status,
  loading,
  loading_tab,
  requesting_from_sat,
  requesting_from_sat_retry,
  fetchDocumentRetry,
  date,
  date_owner,
  loadingStage,
}: PropsCurrentTab) => {
  return (
    <Row gutter={[0, 16]}>
      <Col span={24}>
        <Title className="capitalize-first-letter" level={4} style={{ marginBottom: 0 }}>
          {title}
        </Title>
      </Col>
      <Col span={24}>
        {url ? (
          <ViewPDF
            date_owner={date_owner}
            updatePage={updatePage}
            fetchDocument={fetchDocument}
            fetchDocumentRetry={fetchDocumentRetry}
            url={url}
            title={title}
            download={download}
            tab={tab}
            status={status}
            loading={loading}
            requesting_from_sat={requesting_from_sat}
            loading_tab={loading_tab}
            requesting_from_sat_retry={requesting_from_sat_retry}
            date={date}
            loadingStage={loadingStage}
          />
        ) : (
          <ViewAlerts
            title={title}
            updatePage={updatePage}
            fetchDocument={fetchDocument}
            fetchDocumentRetry={fetchDocumentRetry}
            status={status}
            loading_tab={loading_tab}
            url={url}
            requesting_from_sat={requesting_from_sat}
            requesting_from_sat_retry={requesting_from_sat_retry}
            date={date}
          />
        )}
      </Col>
    </Row>
  );
};
