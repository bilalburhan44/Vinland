import { Form, Input, Modal, message, Select } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { addClient, updateClient } from 'apicalls/client';

function ClientsModal({ open, setOpen, ClientsToEdit, refreshClients }) {
  const formRef = useRef();
  const { user } = useSelector((state) => state.users);
  const [loading, setLoading] = useState(false);
  const rules = [{ required: true, message: 'Required' }];
  const phonerules = [
    {
      required: true,
      message: 'Phone number is required',
    },
    {
      pattern: /^(075|077|078)\d{8}$/,
      message: 'Phone number must start with 075, 077, or 078 and be exactly 11 digits long',
    },
  ];
  const { Option } = Select;

  useEffect(() => {
    if (open) {
      if (ClientsToEdit) {
        formRef.current.setFieldsValue(ClientsToEdit);
      } else {
        formRef.current.resetFields();
      }
    }
  }, [open, ClientsToEdit]);

  const handleCancel = () => {
    formRef.current.resetFields();
    setOpen(false);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      let response;
      if (ClientsToEdit) {
        response = await updateClient(ClientsToEdit.id, values);
      } else {
        response = await addClient(values);
      }
      if (response.success) {
        message.success(response.message);
        formRef.current.resetFields();
        setOpen(false);
        refreshClients();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      onCancel={handleCancel}
      open={open}
      centered
      title={ClientsToEdit ? "Edit Client" : "Add Client"}
      onOk={() => formRef.current.submit()}
      okText={ClientsToEdit ? "Save" : "Add Client"}
      cancelText="Cancel"
      okButtonProps={{ loading }}
    >
      <div className='flex flex-col gap-2'>
        <Form layout='vertical' ref={formRef} onFinish={onFinish}>
          <div className='flex flex-row gap-2'>
            <Form.Item name="name" label="Client Name" rules={rules} style={{ flex: 1 }}>
              <Input type="text" />
            </Form.Item>
            <Form.Item name="phoneNumber" label="Phone Number" rules={phonerules} style={{ flex: 1 }}>
              <Input type="number" />
            </Form.Item>
          </div>
          <div className='flex flex-row gap-2'>
            <Form.Item name="address" label="Client Address" style={{ flex: 1 }}>
              <Input type="text" />
            </Form.Item>
            <Form.Item name="source" label="Source" style={{ flex: 1 }}>
              <Select>
                <Option value="Social Media">Social Media</Option>
                <Option value="Word of Mouth">Word of Mouth</Option>
                <Option value="Advertisement">Advertisement</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </div>
    </Modal>
  );
}

ClientsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  ClientsToEdit: PropTypes.object,
  refreshClients: PropTypes.func.isRequired,
};

export default ClientsModal;
