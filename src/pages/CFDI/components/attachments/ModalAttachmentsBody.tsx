import { Button, Col, Descriptions, Divider, List, Row, Skeleton, Space, Spin, Tooltip, Upload } from "antd";
import { CSSProperties, Dispatch, SetStateAction, useState } from "react";
import { useSelector } from "react-redux";
import { cfdiSelector, cleanErrorAttachment, cleanErrors, setCurrentSelectedAttachment } from "@store/cfdiSlice";
import { CFDI_Types } from "@constants/Enums";
import { DeleteOutlined, DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { useAppDispatch } from "@store/store";
import { uploadAttachments } from "@store/cfdiSlice/uploadAttachment";
import debounce from "lodash/debounce";
import { downloadAttachment } from "@store/cfdiSlice/downloadAttachment";
import { deleteAttachment } from "@store/cfdiSlice/deleteAttachment";
import { getAttachments } from "@store/cfdiSlice/getAttachments";
import CFDIModalHeader from "@components/cfdis/Modal/CFDIModalHeader";
import { hashFileSHA256 } from "@utils/CFDI/hashFiles";
import { FIELDS_ATTACHMENTS } from "@pages/CFDI/_utils/fieldsAttachments";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { FilesFormat } from "@api/cfdi";

const emptyStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "200px",
};

type Props = {
  visible: boolean;
  setVisible: (newState: boolean) => void;
  setCFDIToDisplay: (state: string) => void;
  setCFDIModalType: (state: string) => void;
  visibleAttachments: boolean;
  setVisibleAttachments: (visible: boolean) => void;
  attachmentsActive: Attachment[];
  setCFDITypeToRequest: (state: CFDI_Types) => void;
  cfdiattachmentActiveUUID: string | null;
  messageApi: any;
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  cfdiattachmentActive: CFDI | null
  cfdiattachmentActiveType: string | null
  modalType: string
};
const titleStyle: CSSProperties = {
  fontWeight: 600,
  paddingTop: "10px",
  fontSize: "15px",
};

const itemStyle: CSSProperties = {
  padding: 0,
};


export default function ModalAttachmentsBody({
  attachmentsActive,
  cfdiattachmentActiveUUID,
  messageApi,
  files,
  setFiles,
  visibleAttachments,
  cfdiattachmentActiveType,
  modalType
}: Props) {
  const dispatch = useAppDispatch();
  const { obtainedCFDI, isFetchingCFDI } = useSelector(cfdiSelector)
  const [uploadKey, setUploadKey] = useState(0);
  const {
    isFetchingAttachment,
    isFetchingUploadAttachment,
    uploadAttachmentError,
    downloadCFDIError,
    deleteAttachmentError,
    isDownloadingAttachment,
    isFetchingDeleteAttachment,
    currentFileAttachment,
  } = useSelector(cfdiSelector);

  const handleBatchUpload = debounce(async (fileList: { originFileObj: File }[]) => {
    const newFiles = fileList.map((f) => f.originFileObj);

    const filesFormat: FilesFormat[] = await Promise.all(
      newFiles.map(async (file) => ({
        file_name: file.name,
        size: file.size,
        content_hash: await hashFileSHA256(file),
      }))
    );
    dispatch(
      uploadAttachments({
        filesFormat,
        files: newFiles,
        uuid: cfdiattachmentActiveUUID,
        setFiles,
        options: {
          domain: [["cfdi_uuid", "=", cfdiattachmentActiveUUID]],
          fields: FIELDS_ATTACHMENTS,
        },
      })
    )
      .unwrap()
      .finally(() => {
        setFiles([]);
        dispatch(cleanErrorAttachment())
        setUploadKey((prev) => prev + 1);
      });
  }, 300);

  const handleDownload = (column: any) => {
    dispatch(setCurrentSelectedAttachment(column.file_name));
    dispatch(
      downloadAttachment({ url: column.url, file_name: column.file_name, uuid: column.cfdi_uuid })
    );
  };

  const handleDeleteAttachment = (column: any) => {
    dispatch(setCurrentSelectedAttachment(column.file_name));
    dispatch(deleteAttachment({ uuid: column.cfdi_uuid, file_name: column.file_name })).finally(
      () => {
        dispatch(
          getAttachments({
            uuid: cfdiattachmentActiveUUID,
            options: {
              domain: [["cfdi_uuid", "=", cfdiattachmentActiveUUID]],
              fields: FIELDS_ATTACHMENTS,
            },
          })
        );
      }
    );
  };

  const currentAttachments = attachmentsActive.filter((att) => att.state !== "DELETED");

  const propsUpload = {
    multiple: true,
    beforeUpload: (file: File) => {
      setFiles((prev) => [...prev, file]);
      return false;
    },
    onChange: (info: any) => {
      handleBatchUpload(info.fileList);
    },
    showUploadList: false,
  };

  if (isFetchingAttachment) {
    return (
      <Space style={emptyStyle}>
        <Spin size="large" />
      </Space>
    );
  }

  if (uploadAttachmentError && visibleAttachments) {
    messageApi.error(uploadAttachmentError);
  }

  if (downloadCFDIError) {
    messageApi.error(downloadCFDIError);
    dispatch(cleanErrors());
  }

  if (deleteAttachmentError) {
    messageApi.error(deleteAttachmentError);
    dispatch(cleanErrors());
  }

  return (
    <>
      <CFDIModalHeader
        cfdi={obtainedCFDI ?? {} as CFDI}
        isFetchingCFDI={isFetchingCFDI}
        modalType={cfdiattachmentActiveType ?? ''}
      />
      <Row
        id="details_modal_body"
        gutter={16}
        style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: 12 }}
      >
        <Col xs={24} md={12}>
          <h6 style={titleStyle}>Emisor</h6>
          <Descriptions
            size="small"
            labelStyle={{ fontWeight: 500 }}
            layout="horizontal"
            contentStyle={{ padding: 0 }}
          >
            <Descriptions.Item style={itemStyle} span={3} label="Nombre">
              {isFetchingCFDI ? (
                <Skeleton active={true} paragraph={{ rows: 0, width: 100 }} />
              ) : modalType === "normal" ? (
                obtainedCFDI?.NombreEmisor
              ) : (
                obtainedCFDI?.NombreEmisor
              )}
            </Descriptions.Item>
            <Descriptions.Item style={itemStyle} span={3} label="RFC">
              {isFetchingCFDI ? (
                <Skeleton active paragraph={{ rows: 0, width: 100 }} />
              ) : modalType === "normal" ? (
                obtainedCFDI?.RfcEmisor
              ) : (
                obtainedCFDI?.RfcEmisor
              )}
            </Descriptions.Item>
          </Descriptions>
        </Col>

        <Col xs={24} md={12}>
          <h6 style={titleStyle}>Receptor</h6>
          <Descriptions size="small" labelStyle={{ fontWeight: 500 }} layout="horizontal">
            <Descriptions.Item style={itemStyle} span={3} label="Nombre">
              {isFetchingCFDI ? (
                <Skeleton active paragraph={{ rows: 0, width: 100 }} />
              ) : !modalType ? (
                obtainedCFDI?.NombreReceptor
              ) : (
                obtainedCFDI?.NombreReceptor
              )}
            </Descriptions.Item>
            <Descriptions.Item style={itemStyle} span={3} label="RFC">
              {isFetchingCFDI ? (
                <Skeleton active paragraph={{ rows: 0, width: 100 }} />
              ) : !modalType ? (
                obtainedCFDI?.RfcReceptor
              ) : (
                obtainedCFDI?.RfcReceptor
              )}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>


      <Row gutter={16}>
        <Col xs={24} md={6}>
          <h6 style={titleStyle}>Fecha de emisión</h6>
          <Descriptions size="small" labelStyle={{ fontWeight: 500 }} layout="horizontal">
            <Descriptions.Item style={itemStyle} span={3}>
              {isFetchingCFDI ? (
                <Skeleton active paragraph={{ rows: 0, width: 100 }} />
              ) : (
                (formatDisplay(
                  modalType === "normal" ? obtainedCFDI?.Fecha : obtainedCFDI?.Fecha,
                  DisplayType.DATE
                ) as string)
              )}
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col xs={24} md={10}>
          <h6 style={titleStyle}>Folio fiscal</h6>
          <Descriptions
            size="small"
            labelStyle={{ fontWeight: 500 }}
            layout="horizontal"
            contentStyle={{ padding: 0 }}
          >
            <Descriptions.Item style={itemStyle} span={3}>
              {isFetchingCFDI ? (
                <Skeleton active paragraph={{ rows: 0, width: 100 }} />
              ) : modalType === "normal" ? (
                obtainedCFDI?.UUID
              ) : (
                obtainedCFDI?.UUID
              )}
            </Descriptions.Item>
          </Descriptions>
        </Col>
        {
          (obtainedCFDI?.TipoDeComprobante === 'N' || obtainedCFDI?.TipoDeComprobante === 'P') &&
          <Col xs={24} md={8}>
            <h6 style={titleStyle}>Fecha de pago</h6>
            <Descriptions size="small" labelStyle={{ fontWeight: 500 }} layout="horizontal">
              <Descriptions.Item style={itemStyle} span={3}>
                {isFetchingCFDI ? (
                  <Skeleton active paragraph={{ rows: 0, width: 100 }} />
                ) : (
                  (formatDisplay(
                    modalType === "normal" ? obtainedCFDI?.FechaFiltro : obtainedCFDI?.FechaFiltro,
                    DisplayType.DATE
                  ) as string)
                )}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        }
      </Row>

      <Divider style={{ marginTop: 10 }} />

      <Upload.Dragger
        {...propsUpload}
        key={uploadKey}
        style={{
          border: isFetchingUploadAttachment ? "2px dashed #91C9F7" : "2px dashed #91C9F7",
          borderRadius: 8,
          padding: 35,
          textAlign: "center",
          marginBottom: 25,
          opacity: isFetchingUploadAttachment ? 0.5 : 1,
          pointerEvents: isFetchingUploadAttachment ? "none" : "auto",
          transition: "opacity 0.3s",
        }}
      >
        <p className="ant-upload-drag-icon">
          <UploadOutlined style={{ fontSize: 30 }} />
        </p>
        <p style={{ marginTop: "1px" }}>Arrastra aquí los archivos de evidencia.</p>
      </Upload.Dragger>

      {files?.length > 0 && (
        <List
          dataSource={files}
          renderItem={(file) => {
            return (
              <List.Item>
                <span>{file.name.length > 95 ? `${file.name.slice(0, 95)}...` : file.name}</span>
                <Button
                  style={{ border: "none", color: '#009dff' }}
                  loading
                />
              </List.Item>
            );
          }}
        />
      )}
      {currentAttachments?.length > 0 && (
        <List
          dataSource={currentAttachments}
          renderItem={(column) => (
            <List.Item style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                href={column?.url}
                style={{
                  cursor: "pointer",
                  border: "none",
                  padding: 0,
                  flex: 1,
                  display: "flex",
                  justifyContent: "start",
                }}
              >
                <span>
                  {column?.file_name?.length > 95
                    ? `${column?.file_name?.slice(0, 95)}...`
                    : column?.file_name}
                </span>
              </Button>

              <Space>
                <Tooltip title="Descargar">
                  <Button
                    style={{ border: "none" }}
                    loading={isDownloadingAttachment && currentFileAttachment === column.file_name}
                    onClick={() => handleDownload(column)}
                    icon={<DownloadOutlined style={{ cursor: "pointer", color: "#009dff" }} />}
                  />
                </Tooltip>

                <Tooltip title="Eliminar evidencia">
                  <Button
                    style={{ border: "none" }}
                    loading={
                      isFetchingDeleteAttachment && currentFileAttachment === column.file_name
                    }
                    icon={<DeleteOutlined style={{ cursor: "pointer", color: "#009dff" }} />}
                    onClick={() => handleDeleteAttachment(column)}
                  />
                </Tooltip>
              </Space>
            </List.Item>
          )}
        />
      )}

      <Divider />
    </>
  );
}
