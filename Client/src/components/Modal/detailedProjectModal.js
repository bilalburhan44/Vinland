import { Form, Input, Modal, message, DatePicker, TimePicker, Select, AutoComplete } from "antd";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { addProject } from "apicalls/projects";
import { updateProject } from "apicalls/projects";
import { getAllClients } from "apicalls/client";
import { getClient } from "apicalls/client";

function DetailedProjectModal({ open, setOpen, fetchProjects }) {
  const formRef = React.useRef();
  const { user } = useSelector((state) => state.users);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [clientOptions, setClientOptions] = useState([]);
  const rules = [{ required: true, message: "Required" }];
  const [form] = Form.useForm();
  const { Option } = Select;

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await getAllClients();
        if (response.success) {
          setClients(response.data);
          setClientOptions(response.data.map(client => ({ value: client.name })));
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error(error);
        message.error("Failed to fetch clients");
      }
    }
    fetchClients();

  }, []);


  const onFinish = async (values) => {
    setLoading(true);
    try {
        formRef.current.resetFields();
        const response = await addProject({ ...values, client_id: selectedClientId, user_id: user.data.id });
      if (response.success) {
        message.success(response.message);
        setOpen(false);
        fetchProjects();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = async (value) => {
    const selectedClient = clients.find(client => client.name === value);
    if (selectedClient) {
      setSelectedClientId(selectedClient.id); // Store the client ID
      try {
        const clientDetails = await getClient(selectedClient.id);
        form.setFieldsValue({
          clientName: clientDetails.data.name,
          phoneNumber: clientDetails.data.phoneNumber,
        });
      } catch (error) {
        message.error('Failed to fetch client details');
      }
    }
  };

  const handleSearch = (value) => {
    const filteredOptions = clients
      .filter(client => client.name.toLowerCase().includes(value.toLowerCase()))
      .map(client => ({ value: client.name }));
      setProjectOption(filteredOptions);
  };

  return (
    <Modal
      onCancel={() => setOpen(false)}
      open={open}
      centered
      title={"Add Project"} // Customize the OK button style
      style={{ width: "80%" }}
      onOk={() => {
        formRef.current.submit();
      }}
      okText={"Add Project"}
      cancelText={"Cancel"}
      okButtonProps={{ loading }}
    >
      <div className="flex flex-col gap-2">
        <Form
          layout="vertical"
          ref={formRef}
          onFinish={onFinish}
          initialValues={ { status: "First Stage" }}
          form={form}
        >
          <div className="flex flex-row gap-2">
            <Form.Item name="project_name" label="Project Name" rules={rules} style={{ flex: 1 }}>
              <Input type="text" />
            </Form.Item>
            <Form.Item label="Client Name" name="clientName" rules={rules}>
            <AutoComplete
            options={clientOptions}
            onSelect={handleClientSelect}
            onSearch={handleSearch}
            placeholder="Search Client Name"
          />
            </Form.Item>
            <Form.Item label="Phone Number" name="phoneNumber" >
              <Input placeholder="Phone Number" disabled />
            </Form.Item>
            <Form.Item
              name="expectedIncome"
              label="ExpectedIncome"
              initialValues={0}
              style={{ flex: 1 }}
            >
              <Input type="Number" />
            </Form.Item>
          </div>
          <div className="flex flex-row gap-2">
            <Form.Item name="status" label="status" style={{ flex: 1 }}>
              <Select>
                <Option value="first stage">Fisrt Stage</Option>
                <Option value="second stage">Second Stage</Option>
                <Option value="third stage">Third Stage</Option>
                <Option value="fourth stage">Fourth Stage</Option>
                <Option value="completed">Completed</Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </div>
    </Modal>
  );
}

DetailedProjectModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  fetchProjects: PropTypes.func.isRequired,
};

export default DetailedProjectModal;
