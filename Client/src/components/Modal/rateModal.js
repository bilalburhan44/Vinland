import { Form, Input, Modal, message } from 'antd';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { addExchangeRate } from 'apicalls/exchangerate';

function RateModal({ rateOpen, setRateOpen, initialRate, fetchExchangeRate }) {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (rateOpen) {
            form.setFieldsValue({ rate: initialRate });
        }
    }, [rateOpen, initialRate, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await addExchangeRate({ rate: values.rate });
            if (response.success) {
                setRateOpen(false);
                fetchExchangeRate();
                message.success("Rate updated successfully!");
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error(error.message);
            message.error("Failed to update the rate.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            onCancel={() => setRateOpen(false)}
            open={rateOpen}
            centered
            title="Add New Exchange Rate"
            onOk={() => form.submit()}
            okText="Save Rate"
            cancelText="Cancel"
            okButtonProps={{ loading }}
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
                initialValues={{ rate: initialRate }}
            >
                <Form.Item
                    name="rate"
                    label="Rate"
                    rules={[{ required: true, message: 'Please input the new rate!' }]}
                >
                    <Input type="number" autoFocus />
                </Form.Item>
            </Form>
        </Modal>
    );
}

RateModal.propTypes = {
    rateOpen: PropTypes.bool.isRequired,
    setRateOpen: PropTypes.func.isRequired,
    initialRate: PropTypes.string.isRequired,
    fetchExchangeRate: PropTypes.func.isRequired
};

export default RateModal;
