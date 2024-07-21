import { Form, Input, Modal, message, DatePicker, Select, AutoComplete } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { getAllClients } from 'apicalls/client';
import { getTransactions } from 'apicalls/transaction';

function FilterModal({ filterOpen, setFilterOpen, setFilters }) {
    const formRef = useRef();
    const { user } = useSelector((state) => state.users);
    const rules = [{ required: true, message: 'Required' }];
    const dispatch = useDispatch();
    const { Option } = Select;
    const [paymentValue, setPaymentValue] = useState('');
    const [clients, setClients] = useState([]);
    const [clientOptions, setClientOptions] = useState([]);

    const handlePaymentChange = (value) => {
        setPaymentValue(value);
    };

    const getClients = async () => {
        try {
            const response = await getAllClients();
            if (response.success) {
                setClients(response.data);
                setClientOptions(response.data.map(client => ({ value: client.name })));
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            message.error(error.message);
        }
    };

    useEffect(() => {
        if (filterOpen) {
            getClients();
        }
    }, [filterOpen]);

    const handleClientSelect = (value) => {
        const selectedClient = clients.find(client => client.name === value);
        if (selectedClient) {
            formRef.current.setFieldsValue({
                clientName: selectedClient.name,
                phoneNumber: selectedClient.phoneNumber,
            });
        }
    };

    const handleSearch = (value) => {
        const filteredOptions = clients
            .filter(client => client.name.toLowerCase().includes(value.toLowerCase()))
            .map(client => ({ value: client.name, key: client.id }));
        setClientOptions(filteredOptions);
    };

    const onFinish = async (values) => {
        const filters = {
            ...values,
            startDate: values.dateRange ? values.dateRange[0].toISOString() : undefined,
            endDate: values.dateRange ? values.dateRange[1].toISOString() : undefined,
        };
        setFilters(filters);
        setFilterOpen(false);
        try {
            const response = await getTransactions(filters);
            if (response.success) {
                message.success('Filters applied');
                // Handle the response data (e.g., update the state or dispatch an action)
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            message.error(error.message);
        } finally {
            setFilterOpen(false);
        }
    };

    return (
        <Modal
            onCancel={() => setFilterOpen(false)}
            open={filterOpen}
            centered
            title="Filter Transactions"
            onOk={() => {
                formRef.current.submit();
            }}
            okText="Apply Filters"
            cancelText="Cancel"
            okButtonProps={{ className: "custom-ok-button focus:outline-none bg-blue-500 text-white" }}
        >
            <div className="flex flex-col gap-2">
                <Form layout="vertical" ref={formRef} onFinish={onFinish}>
                    <div className="flex flex-row gap-2">
                        <Form.Item name="clientName" label="Client Name" style={{ flex: 1 }}>
                            <AutoComplete
                                options={clientOptions}
                                onSelect={handleClientSelect}
                                onSearch={handleSearch}
                                filterOption={false}
                            >
                                <Input />
                            </AutoComplete>
                        </Form.Item>
                        <Form.Item name="phoneNumber" label="Phone Number" style={{ flex: 1 }}>
                            <Input type="number" />
                        </Form.Item>
                    </div>
                    <div className="flex flex-row gap-2">
                        <Form.Item name="type" label="Type" style={{ flex: 1 }}>
                            <Select onChange={handlePaymentChange}>
                                <Option value="income">Income</Option>
                                <Option value="outcome">Outcome</Option>
                            </Select>
                        </Form.Item>
                        {paymentValue === 'income' && (
                            <Form.Item name="payment" label="Payment" style={{ flex: 1 }}>
                                <Select>
                                    <Option value="initial">Initial</Option>
                                    <Option value="monthly">Monthly</Option>
                                </Select>
                            </Form.Item>
                        )}
                    </div>
                    <div className="flex flex-row gap-2">
                        <Form.Item name="amountUSDMin" label="Min Amount USD" style={{ flex: 1 }}>
                            <Input type="number" min="0" />
                        </Form.Item>
                        <Form.Item name="amountUSDMax" label="Max Amount USD" style={{ flex: 1 }}>
                            <Input type="number" min="0" />
                        </Form.Item>
                    </div>
                    <div className="flex flex-row gap-2">
                        <Form.Item name="amountIQDMin" label="Min Amount IQD" style={{ flex: 1 }}>
                            <Input type="number" min="0" />
                        </Form.Item>
                        <Form.Item name="amountIQDMax" label="Max Amount IQD" style={{ flex: 1 }}>
                            <Input type="number" min="0" />
                        </Form.Item>
                    </div>
                    <div className="flex flex-row gap-2">
                        <Form.Item name="dateRange" label="Date Range" style={{ flex: 1 }}>
                            <DatePicker.RangePicker />
                        </Form.Item>
                    </div>
                </Form>
            </div>
        </Modal>
    );
}

FilterModal.propTypes = {
    filterOpen: PropTypes.bool.isRequired,
    setFilterOpen: PropTypes.func.isRequired,
    setFilters: PropTypes.func.isRequired, // Add PropTypes
};

export default FilterModal;
