import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Modal, Form, Input, Button, message, Select, DatePicker, TimePicker, AutoComplete } from "antd";
import moment from "moment";
import { updateTransaction, addTransaction } from "apicalls/transaction";
import { getAllClients } from "apicalls/client";
import { getAllProjects } from "apicalls/projects";
import { getClient } from "apicalls/client";
import { getAllUsers } from "apicalls/users";

const { Option } = Select;

const TransactionModal = ({ open, setOpen, transactionToEdit, refreshTransactions }) => {
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.users);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectOption, setProjectOption] = useState([]);
  const [receivers, setReceivers] = useState({});
  const [receiverOption, setReceiverOption] = useState([]);
  const [paymentValue, setPaymentValue] = useState(''); // State to store the selected payment value



  // Fetch clients
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

  // Fetch projects
  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await getAllProjects();
        if (response.success) {
          setProjects(response.data);
          setProjectOption(response.data.map(project => ({ value: project.project_name })));
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error(error);
        message.error("Failed to fetch projects");
      }
    }
    fetchProjects();

  }, []);

  // Fetch receivers
  useEffect(() => {
    async function fetchReceivers() {
      try {
        const response = await getAllClients();
        if (response.success) {
          setReceivers(response.data);
          setReceiverOption(response.data.map(receiver => ({ value: receiver.name })));
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error(error);
        message.error("Failed to fetch Receivers");
      }
    }
  
      fetchReceivers();
    
  }, []);

  // Set the payment value state based on the transaction type
  useEffect(() => {
    if (transactionToEdit) {
      form.setFieldsValue({
        projectName: transactionToEdit.project.project_name,
        clientName: transactionToEdit.Client.name,
        phoneNumber: transactionToEdit.Client.phoneNumber,
        type: transactionToEdit.type,
        payment: transactionToEdit.payment,
        receiverName: transactionToEdit.Client.name,
        amount_iqd: transactionToEdit.amount_iqd,
        amount_usd: transactionToEdit.amount_usd,
        description: transactionToEdit.description,
        date: moment(transactionToEdit.date),
        time: moment(transactionToEdit.date),
      });
      setPaymentValue(transactionToEdit.type); // Set the payment value state based on the transaction type
    } else {
      form.resetFields();
    }
  }, [transactionToEdit, form]);



  // Handle receiver select
  const  handleReceiverSelect= async (value) => {
      const selectedReceiver = receivers.find(receiver => receiver.name === value);
      if (selectedReceiver) {
      try {
        form.setFieldsValue({
          receiverName: value,
        });
      } catch (error) {
        message.error('Failed to fetch Receiver details');
      }
    }
  };

  // Handle project select
  const handleProjectSelect = async (value) => {
    const selectedProject = projects.find(project => project.project_name === value);
    if (selectedProject) {
      try {
        const clientDetails = await getClient(selectedProject.client_id);
        form.setFieldsValue({
          projectName: selectedProject.project_name,
          clientName: clientDetails.data.name,
          phoneNumber: clientDetails.data.phoneNumber,
        });
      } catch (error) {
        message.error('Failed to fetch client details');
      }
    }
  };

  // Handle project search
  const handleSearch = (value) => {
    const filteredOptions = projects
      .filter(project => project.project_name.toLowerCase().includes(value.toLowerCase()))
      .map(project => ({ value: project.name }));
      setProjectOption(filteredOptions);
  };

  // Handle receiver search
  const handleReceiverSearch = (value) => {
    const filteredOptions = receivers
      .filter(receiver =>  receiver.name.toLowerCase().includes(value.toLowerCase()))
      ?.map(receiver => ({ value: receiver.name }));
      setReceiverOption(filteredOptions);
  };

  // Handle payment change
  const handlePaymentChange = (value) => {
    setPaymentValue(value); // Update the payment value state
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      let response;
      const date = values.date.format("YYYY-MM-DD");
      const time = values.time.format("HH:mm:ss");
      const dateTime = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm:ss").toISOString();

      const amountUSD = values.amount_usd ? parseFloat(values.amount_usd).toFixed(2) : 0;  // Default to 0 if empty
      const amountIQD = values.amount_iqd ? parseInt(values.amount_iqd, 10) : 0; 

      if (transactionToEdit) {
        // Update transaction
        response = await updateTransaction(transactionToEdit.transaction_id, {
          ...values,
          amount_usd: amountUSD,
          amount_iqd: amountIQD,
          date: dateTime,
          userId: user.data.id
        });

      } else {
        // Create new transaction
        response = await addTransaction({
          ...values,
          amount_usd: amountUSD,
          amount_iqd: amountIQD,
          date: dateTime,
          userId: user.data.id
        });
      }
      if (response.success) {
        message.success(response.message);
        setOpen(false);
        refreshTransactions();
        form.resetFields();
      } else {
        throw new Error(response?.message);
      }
    } catch (error) {
      console.error(error);
      message.error('An error occurred while processing the transaction');
    } finally {
      setLoading(false);
    }
  };

  // Handle form cancel
  const handleCancel = () => {
  setOpen(false);
  form.resetFields(); // Reset form fields on cancel
};

  // Validation functions
  const validateDivisibleBy250 = (_, value) => {
    if (value && value % 250 !== 0) {
      return Promise.reject(new Error('Invalid amount'));
    }
    return Promise.resolve();
  };

  
  // Validation functions
  const validateAmount = (_, value) => {
    const amountUSD = form.getFieldValue('amount_usd');
    const amountIQD = form.getFieldValue('amount_iqd');

    if (!amountUSD && !amountIQD) {
      return Promise.reject(new Error('At least one amount is required (USD or IQD)'));
    }

    return Promise.resolve();
  };

  const rules = [{ required: true, message: "Required" }];
  const phonerules = [
    {
      required: true,
      message: 'Phone number is required',
    },
    {
      pattern: /^(075|077|078)\d{8}$/,
      message: 'Phone number must start with 075, 077, or 078 and be 11 digits',
    },
  ];

  return (
    <Modal
      title={transactionToEdit ? "Edit Transaction" : "Add Transaction"}
      open={open}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} 
      initialValues={{
        date: moment(),
        time: moment(),
      }}>
        <Form.Item label="Project Name" name="projectName" rules={rules}>
          <AutoComplete
            options={projectOption}
            onSelect={handleProjectSelect}
            onSearch={handleSearch}
            placeholder="Search Project Name"
          />
        </Form.Item>
        <Form.Item label="Client Name" name="clientName"  rules={rules}>
        <Input placeholder="Client Name" disabled />
        </Form.Item>
        <Form.Item label="Phone Number" name="phoneNumber" rules={phonerules}>
          <Input placeholder="Phone Number" disabled />
        </Form.Item>
        <Form.Item label="Type" name="type" rules={rules}>
          <Select
            placeholder="Select Type"
            onChange={handlePaymentChange} // Add the onChange handler for the Select component
          >
            <Option value="income">Income</Option>
            <Option value="outcome">Outcome</Option>
          </Select>
        </Form.Item>
        {paymentValue === "income" && (
          <Form.Item label="Payment" name="payment" rules={rules}>
            <Select placeholder="Select Payment Method">
              <Option value="initial">Initial</Option>
              <Option value="monthly">Monthly</Option>
            </Select>
          </Form.Item>
        )}
        {paymentValue === "outcome" && (
          <Form.Item label="Receiver" name="receiverName">
          <AutoComplete
            options={receiverOption}
            onSelect={handleReceiverSelect}
            onSearch={handleReceiverSearch}
            placeholder="Search Receiver Name"
          />
        </Form.Item>
        )}
        <Form.Item label="Amount (USD)" name="amount_usd" rules={[{ validator: validateAmount }]}>
          <Input placeholder="Amount in USD" type="number" />
        </Form.Item>
        <Form.Item
          label="Amount (IQD)"
          name="amount_iqd"
          rules={[
            { validator: validateDivisibleBy250 },
            { validator: validateAmount },
          ]}
        >
          <Input placeholder="Amount in IQD" type="number" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea placeholder="Description" />
        </Form.Item>
        <Form.Item label="Date" name="date" rules={rules} >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item label="Time" name="time" rules={rules}>
          <TimePicker format="HH:mm:ss" />
        </Form.Item>
        <div className="flex justify-end">
          <Button styales={{ marginRight: '10px' } } onClick={handleCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" styles={{ margingLeft: '10px' } } loading={loading}>Save</Button>
        </div>
      </Form>
    </Modal>
  );
};

TransactionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  transactionToEdit: PropTypes.object,
  refreshTransactions: PropTypes.func.isRequired,
};

export default TransactionModal;
