import { Form, Input, Modal, message, DatePicker, Select, AutoComplete } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { getTransactions } from 'apicalls/transaction';
import { getAllProjects } from 'apicalls/projects';
import { getClient } from 'apicalls/client';
import { getAllUsers } from 'apicalls/users';
import { getAllClients } from 'apicalls/client';

function FilterModal({ filterOpen, setFilterOpen, setFilters }) {
    const formRef = useRef();
    const { user } = useSelector((state) => state.users);
    const rules = [{ required: true, message: 'Required' }];
    const dispatch = useDispatch();
    const { Option } = Select;
    const [paymentValue, setPaymentValue] = useState('');
    const [receivers, setReceivers] = useState({});
    const [receiverOption, setReceiverOption] = useState([]);
    const [projects, setProjects] = useState([]);
    const [projectOption, setProjectOption] = useState([]);

    // Handle payment change
    const handlePaymentChange = (value) => {
        setPaymentValue(value);
    };

    // Fetch projects
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

    // Handle project select
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

    // Handle project search
    const handleSearch = (value) => {
        const filteredOptions = projects
          .filter(project => project.project_name.toLowerCase().includes(value.toLowerCase()))
          .map(project => ({ value: project.name }));
          setProjectOption(filteredOptions);
      };

      // Handle receiver select
  const  handleReceiverSelect= async (value) => {
    const selectedReceiver = receivers.find(receiver => receiver.name === value);
    if (selectedReceiver) {
    try {
        formRef.current.setFieldsValue({
        receiverName: value,
      });
    } catch (error) {
      message.error('Failed to fetch Receiver details');
    }
  }
};

 // Handle receiver search
 const handleReceiverSearch = (value) => {
    const filteredOptions = receivers
      .filter(receiver =>  receiver.name.toLowerCase().includes(value.toLowerCase()))
      ?.map(receiver => ({ value: receiver.name }));
      setReceiverOption(filteredOptions);
  };
      // Handle onFinish
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
                    <Form.Item label="Project Name" name="projectName">
                    <AutoComplete
                      options={projectOption}
                      onSelect={handleProjectSelect}
                      onSearch={handleSearch}
                      placeholder="Search Project Name"
                    />
                  </Form.Item>
                  <Form.Item label="Client Name" name="name">
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
                            <Form.Item label="Receiver" name="receiverName">
                            <AutoComplete
                              options={receiverOption}
                              onSelect={handleReceiverSelect}
                              onSearch={handleReceiverSearch}
                              placeholder="Search Receiver Name"
                            />
                          </Form.Item>
                    
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
