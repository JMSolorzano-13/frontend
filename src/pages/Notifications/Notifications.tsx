import { useEffect, useMemo, useState } from "react";
import { Button, Card, Form, message, Select, Typography } from "antd";
import { useSelector } from "react-redux";
import { FormLayout } from "antd/lib/form/Form";
import { updateCompaniesNotifications } from "@api/company";
import { authSelector } from "@store/authSlice";
import { companySelector } from "@store/companySlice";
import { getCompanies } from "@store/companySlice/getCompanies";
import getUsers from "@store/userSlice/getUsers";
import { userSelector } from "@store/userSlice";
import { useAppDispatch } from "@store/store";

const { Title } = Typography;

export default function Notifications() {
  const dispatch = useAppDispatch();
  const { company, oldCompany, userData } = useSelector(authSelector);

  const companyStore = useSelector(companySelector);
  const { companies } = companyStore;

  const userStore = useSelector(userSelector);
  const { users } = userStore;

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [responsiveFormLayout, setResponsiveFormLayout] = useState<FormLayout | undefined>();

  useEffect(() => {
    if (companyStore.error) message.error(companyStore.error);
    if (userStore.error) message.error(userStore.error);
  }, [companyStore.error, userStore.error]);

  useEffect(() => {
    dispatch(getCompanies());
    if (userData) {
      dispatch(getUsers());
    }
  }, [dispatch]);

  useEffect(() => {
    if (companies && !companyStore.isFetching && company) {
      const currCompany = companies.find((c) => c.identifier === company);

      if (!currCompany) return;
      form.setFieldsValue({
        cfdisErrors: currCompany.emails_to_send_errors ?? [],
        efosErrors: currCompany.emails_to_send_efos ?? [],
        canceledErrors: currCompany.emails_to_send_canceled ?? [],
      });
    }
  }, [companies, companyStore.isFetching]);

  const onFinish = async (values: {
    cfdisErrors: string[];
    efosErrors: string[];
    canceledErrors: string[];
  }) => {
    if (loading || !company || !oldCompany) return;
    setLoading(true);
    const notifications = {
      emails_to_send_efos: values.efosErrors.map((email) => {
        return email.toLowerCase();
      }),
      emails_to_send_errors: values.cfdisErrors.map((email) => {
        return email.toLowerCase();
      }),
      emails_to_send_canceled: values.canceledErrors.map((email) => {
        return email.toLowerCase();
      }),
    };

    try {
      await updateCompaniesNotifications([company], notifications);
      message.success("Notificaciones actualizadas");
    } catch {
      message.error("Error al actualizar las notificaciones");
    }

    setLoading(false);
  };

  const usersOptions = useMemo(() => {
    const options: JSX.Element[] = [];
    users.forEach((user) => {
      options.push(
        <Select.Option key={user.id} value={user.email.toLowerCase()}>
          {user.email}
        </Select.Option>
      );
    });
    return options;
  }, [users]);

  const disabledOrLoading = useMemo(() => {
    return loading || companyStore.isFetching || userStore.isFetching;
  }, [loading, companyStore.isFetching, userStore.isFetching]);

  function setFormLayout() {
    if (window.innerWidth < 1200) {
      setResponsiveFormLayout("vertical");
    } else {
      setResponsiveFormLayout("horizontal");
    }
  }

  useEffect(() => {
    setFormLayout();
  }, []);

  window.onresize = setFormLayout;

  return (
    <>
      <Title level={5} style={{ fontWeight: 400 }} id="title-notificaciones">
        Notificaciones
      </Title>
      <Card>
        <Form
          form={form}
          layout={responsiveFormLayout}
          autoComplete="off"
          labelCol={{ xl: 4, xxl: 3 }}
          wrapperCol={{ xs: 24, xl: 12 }}
          onFinish={onFinish}
        >
          <Form.Item label="CFDIs con error" name="cfdisErrors">
            <Select
              mode="tags"
              disabled={disabledOrLoading}
              showSearch
              data-test="cfdi-errors-input"
            >
              {usersOptions}
            </Select>
          </Form.Item>
          <Form.Item label="Operaciones con EFOS" name="efosErrors">
            <Select mode="tags" disabled={disabledOrLoading} showSearch>
              {usersOptions}
            </Select>
          </Form.Item>
          <Form.Item
            label="CFDIs cancelados"
            name="canceledErrors"
            tooltip="Cancelados en el mes actual, emitidos en un mes anterior"
          >
            <Select mode="tags" disabled={disabledOrLoading} showSearch>
              {usersOptions}
            </Select>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              span: 12,
              xl: { offset: 4 },
              xxl: { offset: 3 },
            }}
          >
            <Button
              id="notif-save-button"
              type="primary"
              htmlType="submit"
              size="middle"
              loading={disabledOrLoading}
            >
              Guardar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
