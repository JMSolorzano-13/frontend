import { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Input, message, Modal, Row, Select, Typography } from "antd";
import { useSelector } from "react-redux";
import { authSelector } from "@store/authSlice";
import { EmailRegex, rfcRegex } from "@utils/regexValues";
import { invoiceSelector } from "@store/invoiceSlice";
import { getRegimeCatalogue } from "@store/invoiceSlice/getRegimeCatalogue";
import { getFiscalData } from "@store/invoiceSlice/getFiscalData";
import { setFiscalData } from "@api/invoice";
import { useAppDispatch } from "@store/store";

type Props = {
  visible: boolean;
  setVisible: (newState: boolean) => void;
};

export default function InvoiceDetailsModal(props: Props) {
  const dispatch = useAppDispatch();
  const { visible, setVisible } = props;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [userEmail, setUserEmail] = useState("");
  const { userData } = useSelector(authSelector);
  const { regimeCatalogue, isFetchingRegimeCatalogue, fiscalData, isFetchingFiscalData } =
    useSelector(invoiceSelector);

  const onCancel = () => {
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    let taxRegime;
    if (regimeCatalogue) {
      taxRegime = Object.values(regimeCatalogue).findIndex((val) => val === values.taxRegime);
    }

    try {
      setLoading(true);
      const invoiceInfo = {
        options: {
          regimen_fiscal_id: taxRegime && taxRegime !== -1 ? taxRegime + 1 : values.taxRegime,
          nombre: values.name,
          rfc: values.rfc,
          cp: values.zipcode,
          email: values.invoice_email,
        },
      };
      await setFiscalData(invoiceInfo.options);
      message.success("Datos de facturación guardados");
      setVisible(false);
    } catch (error) {
      message.error("No se pudieron guardar los datos de facturación");
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    dispatch(getRegimeCatalogue());
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      name: fiscalData?.nombre || "",
      rfc: fiscalData?.rfc || "",
      invoice_email: fiscalData?.email || userEmail,
      taxRegime:
        regimeCatalogue && fiscalData ? regimeCatalogue[fiscalData?.regimen_fiscal_id] : "",
      zipcode: fiscalData?.cp || "",
    });
  }, [fiscalData]);

  useEffect(() => {
    dispatch(getFiscalData());
  }, []);

  useEffect(() => {
    if (userData) {
      setUserEmail(userData.user.email);
    }
  }, [userEmail]);

  const selectValues = useMemo(() => {
    if (regimeCatalogue !== undefined) {
      return Object.entries(regimeCatalogue).map((value) => (
        <Select.Option key={value[0]} value={value[0]}>
          {value[1]}
        </Select.Option>
      ));
    }
    return null;
  }, [isFetchingRegimeCatalogue]);

  return (
    <Modal
      onCancel={onCancel}
      open={visible}
      width={600}
      title="Datos de facturación"
      closable={false}
      footer={[
        <Button type="default" disabled={loading} onClick={onCancel} key="cancelBtn">
          Cancelar
        </Button>,
        <Button type="primary" loading={loading} onClick={form.submit} key="submitBtn">
          Guardar
        </Button>,
      ]}
    >
      <Form
        form={form}
        autoComplete="off"
        layout="vertical"
        requiredMark={false}
        onFinish={onFinish}
      >
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Form.Item
              label="Nombre o Razón Social"
              name="name"
              rules={[{ required: true, message: "Requerido" }]}
            >
              <Input disabled={loading || isFetchingFiscalData || isFetchingRegimeCatalogue} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="RFC"
              name="rfc"
              rules={[
                { required: true, message: "Requerido" },
                { pattern: rfcRegex, message: "RFC inválido" },
              ]}
            >
              <Input disabled={loading || isFetchingFiscalData || isFetchingRegimeCatalogue} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Form.Item
              label="Correo electrónico de envío de factura"
              name="invoice_email"
              rules={[
                { required: true, message: "Requerido" },
                { pattern: EmailRegex, message: "Correo inválido" },
              ]}
            >
              <Input disabled value={userEmail} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Régimen fiscal"
              name="taxRegime"
              rules={[{ required: true, message: "Requerido" }]}
            >
              <Select
                placeholder="Selecciona una opción"
                loading={isFetchingRegimeCatalogue}
                disabled={loading || isFetchingFiscalData || isFetchingRegimeCatalogue}
              >
                {selectValues}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Form.Item
              label="Código postal"
              name="zipcode"
              rules={[{ required: true, message: "Requerido" }]}
            >
              <Input disabled={loading || isFetchingFiscalData || isFetchingRegimeCatalogue} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Uso de CFDI">
              <Input disabled value="G03 gastos en general" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Typography.Text>
        Mandar su constancia de situación fiscal al correo{" "}
        <a href="mailto:facturacion@ezaudita.com">facturacion@ezaudita.com</a>
      </Typography.Text>
    </Modal>
  );
}
