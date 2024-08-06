import { Form, Input, Modal, message, DatePicker, Select, AutoComplete } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { getAllClients } from 'apicalls/client';
import { getTransactions } from 'apicalls/transaction';
import { getAllProjects } from 'apicalls/projects';
import { getClient } from 'apicalls/client';

function FilterModal({ filterOpen, setFilterOpen, setFilters }) {
    const formRef = useRef();
    const { user } = useSelector((state) => state.users);
    const rules = [{ required: true, message: 'Required' }];
    const dispatch = useDispatch();
    const { Option } = Select;
    const [paymentValue, setPaymentValue] = useState('');
    const [projects, setProjects] = useState([]);
    const [projectOption, setProjectOption] = useState([]);

    const handlePaymentChange = (value) => {
        setPaymentValue(value);
    };

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

    useEffect(() => {
        if (filterOpen) {
            fetchProjects();
        }
    }, [filterOpen]);

    const handleProjectSelect = async (value) => {
        const selectedProject = projects.find(project => project.project_name === value);
        if (selectedProject) {
          try {
            const clientDetails = await getClient(selectedProject.client_id);
            formRef.current.setFieldsValue({
              projectName: selectedProject.project_name,
              name: clientDetails.data.name,
              phoneNumber: clientDetails.data.phoneNumber,
            });
          } catch (error) {
            message.error('Failed to fetch client details');
          }
        }
      };

    const handleSearch = (value) => {
        const filteredOptions = projects
          .filter(project => project.project_name.toLowerCase().includes(value.toLowerCase()))
          .map(project => ({ value: project.name }));
          setProjectOption(filteredOptions);
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
                    <Form.Item label="Project Name" name="projectName" rules={rules}>
                    <AutoComplete
                      options={projectOption}
                      onSelect={handleProjectSelect}
                      onSearch={handleSearch}
                      placeholder="Search Project Name"
                    />
                  </Form.Item>
                  <Form.Item label="Client Name" name="name" rules={rules}>
                  <Input placeholder="Client Name" />
                  </Form.Item>
                  <Form.Item label="Phone Number" name="phoneNumber">
                    <Input placeholder="Phone Number" />
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
