import { UploadOutlined } from "@ant-design/icons";
import {
  Divider,
  Form,
  Upload,
  Input,
  Button,
  Row,
  Col,
  Typography,
  message,
  Space,
  Statistic,
} from "antd";
import forge from "node-forge";
import normFile from "@utils/normFile";
import { useEffect, useMemo, useState } from "react";
import formatSearchLocation from "@utils/formatSearchLocation";
import { UploadChangeParam, RcFile } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import { getSatConfig } from "@store/satSlice/getSatConfig";
import { uploadSatConfig } from "@api/sat";
import handleErrorMessage from "@pages/Settings/SATSettings/errorManager";
import { useSelector } from "react-redux";
import { authSelector } from "@store/authSlice";
import { useAppDispatch } from "@store/store";
import { useLocation } from "react-router-dom";
import convertBase64, { convertSatFiles } from "@utils/convertBase64";
import { satSelector } from "@store/satSlice";

const { Title } = Typography;

export default function SignPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { configError, currentConfig, isFetching } = useSelector(satSelector);
  const { company, rfc } = useSelector(authSelector);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [keyFile, setKeyFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(getSatConfig());
  }, []);

  useEffect(() => {
    if (configError) message.error(configError);
  }, [configError]);

  useEffect(() => {
    if (certFile) {
      convertBase64(certFile).then((certString) => {
        const cerKey = forge.util.decode64(certString as string);
        const asnObj = forge.asn1.fromDer(cerKey);
        const pem = forge.pki.certificateFromAsn1(asnObj);

        const rfcObject = pem.subject.attributes.find((el) => el.type === "2.5.4.45")
          ?.value as string;

        const rfcString = rfcObject?.split(" ")[0];

        if (rfc !== rfcString) {
          message.error("El RFC del certificado no coincide con el RFC de la compañía actual");
          form.setFieldsValue({
            cert: [],
          });
          setCertFile(null);
        }
      });
    }
  }, [certFile]);

  const { uploadBtnText } = useMemo(() => {
    const formattedLocation = formatSearchLocation(location.search);
    return {
      uploadBtnText: formattedLocation.workspace === "hidden" ? "Arrastra archivo aquí" : "Subir",
    };
  }, [location.search]);

  const handleCertUpload = (info: UploadChangeParam<UploadFile<any>>) => {
    try {
      setCertFile(info.fileList[0].originFileObj as File);
    } catch (error) {
      console.warn("Setting cert as null");
      setCertFile(null);
    }
  };

  const handleCertBefore = (file: RcFile) => {
    if (file.name.split(".")[1] === "cer") {
      return false;
    }
    return Upload.LIST_IGNORE;
  };

  const handleKeyUpload = (info: UploadChangeParam<UploadFile<any>>) => {
    try {
      setKeyFile(info.fileList[0].originFileObj as File);
    } catch (error) {
      console.warn("Setting key as null");
      setKeyFile(null);
    }
  };

  const handleKeyBefore = (file: RcFile) => {
    if (file.name.split(".")[1] === "key") {
      return false;
    }
    return Upload.LIST_IGNORE;
  };

  const handleFormSubmit = async () => {
    if (certFile && keyFile) {
      setLoading(true);
      const { password } = form.getFieldsValue(true);
      try {
        const { cerData, keyData } = await convertSatFiles(certFile, keyFile);
        await uploadSatConfig(company, cerData, keyData, password);
        dispatch(getSatConfig());
        message.success("La FIEL se actualizó correctamente", 5);
        form.resetFields();
        setCertFile(null);
        setKeyFile(null);
      } catch (error: any) {
        const errorData = handleErrorMessage(error.response.data.Message as string);
        message.error(errorData.message, errorData.duration);
      } finally {
        setLoading(false);
      }
    } else {
      message.error("Archivos faltantes", 5);
    }
  };

  return (
    <>
      <Title level={5} style={{ fontWeight: 400, marginBottom: 10 }} id="title-actualizar-efirma">
        Actualizar e.firma
      </Title>
      <div className="bg-white p-6">
        <Title level={5}>Configuración actual</Title>
        <Space direction="horizontal" size="large" data-test="actual-config">
          <Statistic
            title="RFC"
            value={currentConfig?.rfc}
            style={{ minWidth: 100 }}
            valueStyle={{ fontSize: 16 }}
            loading={!currentConfig || isFetching}
          />
          <Statistic
            title="Expira"
            value={currentConfig ? new Date(`${currentConfig.expires}Z`).toLocaleDateString() : "-"}
            style={{ minWidth: 100 }}
            valueStyle={{ fontSize: 16 }}
            loading={!currentConfig || isFetching}
          />
        </Space>
        <Divider />
        <Title level={5}>Actualizar configuración</Title>
        <Form
          autoComplete="off"
          layout="vertical"
          style={{ maxWidth: 400 }}
          form={form}
          onFinish={handleFormSubmit}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Certificado de la FIEL"
                name="cert"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  accept=".cer"
                  beforeUpload={handleCertBefore}
                  onChange={handleCertUpload}
                  maxCount={1}
                  disabled={loading}
                >
                  <Button id="adv-upload-cert" icon={<UploadOutlined />}>
                    {uploadBtnText}
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Key"
                name="key"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  accept=".key"
                  beforeUpload={handleKeyBefore}
                  onChange={handleKeyUpload}
                  maxCount={1}
                  disabled={loading}
                >
                  <Button id="adv-upload-key" icon={<UploadOutlined />}>
                    {uploadBtnText}
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Contraseña de la FIEL"
            name="password"
            required={false}
            rules={[{ required: true, message: "Contraseña faltante" }]}
          >
            <Input.Password id="adv-sat-password" disabled={loading} />
          </Form.Item>
          <Button id="adv-sat-submit-button" type="primary" htmlType="submit">
            Guardar
          </Button>
        </Form>
      </div>
    </>
  );
}
