import { Form, Input, Modal, message, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getExchangeRate } from 'apicalls/exchangerate';
import { getWallet } from 'apicalls/wallet';
import { convertCurrency } from 'apicalls/convert';

function ChangeCurrencyModal({ open, setOpen }) {
    const formRef = React.useRef();
    const rules = [{ required: true, message: 'Required' }];
    const [exchangeRate, setExchangeRate] = useState(null);
    const [wallet, setWallet] = useState({ totalAmountUSD: 0, totalAmountIQD: 0 });
    const { Option } = Select;

    useEffect(() => {
        const getWalletTotal = async () => {
            try {
                const response = await getWallet();
                if (response.success) {
                    setWallet(response.data);
                } else {
                    throw new Error(response.message);
                }
            } catch (error) {
                console.error(error);
            }
        };

        const fetchExchangeRate = async () => {
            try {
                const response = await getExchangeRate();
                if (response.success) {
                    setExchangeRate(response.data.exchangeRate);
                } else {
                    throw new Error(response.message);
                }
            } catch (error) {
                console.error("Error fetching exchange rate:", error);
            }
        };

        if (open) {
            getWalletTotal();
            fetchExchangeRate();
        }
    }, [open]);

    const validateDivisibleBy250 = (_, value) => {
        if (value && value % 250 !== 0) {
          return Promise.reject(new Error('Invalid amount'));
        }
        return Promise.resolve();
      };

    const onCurrencyTypeChange = (value) => {
        formRef.current.setFieldsValue({
            amount: value === 'USD to IQD' ? wallet.totalAmountUSD : wallet.totalAmountIQD,
            usdPrice: exchangeRate,
        });
    };

    const onFinish = async (values) => {
        const { currencyType, amount, usdPrice } = values;
        try {
            const response = await convertCurrency({ currencyType, amount, exchangeRate: usdPrice });
            if (response.success) {
                message.success('Conversion successful');
                setWallet({
                    totalAmountUSD: response.data.totalAmountUSD,
                    totalAmountIQD: response.data.totalAmountIQD,
                });
                setOpen(false);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            message.error(error.message);
        }
    };

    return (
        <Modal
            onCancel={() => setOpen(false)}
            open={open}
            centered
            title={"Change Currency"}
            onOk={() => {
                formRef.current.submit();
            }}
            okText={"Save"}
            cancelText={"Cancel"}
            okButtonProps={{ className: "custom-ok-button focus:outline-none bg-blue-500 text-white" }}
        >
            <div className='flex flex-col gap-2'>
                <Form layout='vertical' ref={formRef} onFinish={onFinish}>
                    <Form.Item name="currencyType" label="Currency Type" rules={rules}>
                        <Select onChange={onCurrencyTypeChange}>
                            <Option value="USD to IQD">USD to IQD</Option>
                            <Option value="IQD to USD">IQD to USD</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="amount" label="Amount" rules={formRef.current?.getFieldValue('currencyType') === 'IQD to USD' ? [rules, { validator: validateDivisibleBy250 }] : rules}>
                        <Input type="number" max={formRef.current?.getFieldValue('currencyType') === 'USD to IQD' ? wallet.totalAmountUSD : wallet.totalAmountIQD} />
                    </Form.Item>
                    <Form.Item name="usdPrice" label="USD Price" rules={rules}>
                        <Input type="number" value={exchangeRate} />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
}

ChangeCurrencyModal.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
};

export default ChangeCurrencyModal;
