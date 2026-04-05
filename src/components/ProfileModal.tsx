import React, { useState } from "react";
import { Button, Form, Input, message, Modal } from "antd";
import { updateUser } from "../api/user";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export default function ProfileModal(props: Props) {
  const { visible, setVisible } = props;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: { name: string; lastname: string }) => {
    setLoading(true);
    try {
      await updateUser({ name: `${values.name} ${values.lastname}` });
      message.success("Nombre de usuario actualizado");
      setVisible(false);
    } catch (error) {
      message.error(
        "Error al actualizar el nombre de usuario, intente de nuevo"
      );
    }
    setLoading(false);
  };

  return (
    <Modal
      title='Nombre de usuario faltante'
      open={visible}
      onCancel={undefined}
      closable={false}
      footer={[
        <Button
          key='submit'
          id='profile-modal-submit'
          type='primary'
          loading={loading}
          onClick={form.submit}>
          Continuar
        </Button>,
      ]}>
      <Form
        form={form}
        onFinish={onFinish}
        layout='vertical'
        autoComplete='off'
        requiredMark={false}>
        <h6 style={{ marginBottom: 30 }}>
          Favor de completar estos datos para continuar
        </h6>
        <Form.Item
          label='Nombre'
          name='name'
          rules={[{ required: true, message: "Por favor ingrese su nombre" }]}>
          <Input size='large' />
        </Form.Item>
        <Form.Item
          label='Apellido'
          name='lastname'
          rules={[
            { required: true, message: "Por favor ingrese su apellido" },
          ]}>
          <Input size='large' />
        </Form.Item>
      </Form>
    </Modal>
  );
}
