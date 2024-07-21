import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Modal, Form, Input, Button, message, Select, DatePicker, TimePicker, AutoComplete } from "antd";
import moment from "moment";
import { updateTransaction, addTransaction } from "apicalls/transaction";
import { getAllClients } from "apicalls/client";

const { Option } = Select;

const TransactionModal = ({ open, setOpen, transactionToEdit, refreshTransactions }) => {
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.users);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);
  const [paymentValue, setPaymentValue] = useState(''); // State to store the selected payment value
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

  

  useEffect(() => {
    if (transactionToEdit) {
      form.setFieldsValue({
        clientName: transactionToEdit.Client.name,
        phoneNumber: transactionToEdit.Client.phoneNumber,
        type: transactionToEdit.type,
        payment: transactionToEdit.payment,
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

  const handleClientSelect = (value) => {
    const selectedClient = clients.find(client => client.name === value);
    if (selectedClient) {
      form.setFieldsValue({
        clientName: selectedClient.name,
        phoneNumber: selectedClient.phoneNumber,
      });
    }
  };

  const handleSearch = (value) => {
    const filteredOptions = clients
      .filter(client => client.name.toLowerCase().includes(value.toLowerCase()))
      .map(client => ({ value: client.name }));
    setClientOptions(filteredOptions);
  };

  const handlePaymentChange = (value) => {
    setPaymentValue(value); // Update the payment value state
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      let response;
      const date = values.date.format("YYYY-MM-DD");
      const time = values.time.format("HH:mm:ss");
      const dateTime = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm:ss").toISOString();

      if (transactionToEdit) {
        // Update transaction
        response = await updateTransaction(transactionToEdit.transaction_id, {
          ...values,
          date: dateTime,
          userId: user.data.id
        });

      } else {
        // Create new transaction
        response = await addTransaction({
          ...values,
          date: dateTime,
          userId: user.data.id
        });
      }
      if (response?.success) {
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

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const validateDivisibleBy250 = (_, value) => {
    if (value && value % 250 !== 0) {
      return Promise.reject(new Error('Invalid amount'));
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
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Client Name" name="clientName" rules={rules}>
          <AutoComplete
            options={clientOptions}
            onSelect={handleClientSelect}
            onSearch={handleSearch}
            placeholder="Search Client Name"
          />
        </Form.Item>
        <Form.Item label="Phone Number" name="phoneNumber" rules={phonerules}>
          <Input placeholder="Phone Number" />
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
        <Form.Item label="Amount (USD)" name="amount_usd" rules={rules}>
          <Input placeholder="Amount in USD" type="number" />
        </Form.Item>
        <Form.Item
          label="Amount (IQD)"
          name="amount_iqd"
          rules={[
            { required: true, message: 'Amount is required' },
            { validator: validateDivisibleBy250 }
          ]}
        >
          <Input placeholder="Amount in IQD" type="number" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea placeholder="Description" />
        </Form.Item>
        <Form.Item label="Date" name="date" rules={rules}>
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
  fetchData: PropTypes.func.isRequired,
  refreshTransactions: PropTypes.func.isRequired,
};

export default TransactionModal;
