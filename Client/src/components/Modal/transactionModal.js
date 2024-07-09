import { Form, Input, Modal, message, DatePicker, TimePicker, Select } from 'antd'
import { addTransaction } from 'apicalls/transaction';
import React , { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types'


function TransactionModal(
  {  open,
    setOpen 
}
) {
    const formRef = React.useRef();
    const { user } = useSelector((state) => state.users);
    const rules = [{ required: true, message: 'Required' }];
    const dispatch = useDispatch()
    const { Option } = Select;
    const [paymentValue, setPaymentValue] = React.useState(''); // State to store the selected payment value
// Function to handle change in the Payment Select
const handlePaymentChange = (value) => {
    setPaymentValue(value); // Update the payment value state
}
    const onFinish = async (values) => {
        const date = new Date(values.date); // Create a new Date object from the selected date
        const dateUTC = date.toISOString() // Convert selected date to UTC
        try {
            const response = await addTransaction({...values, date: dateUTC, userId : user.data.id});
            if (response.success) {
                message.success(response.message);
                setOpen(false);
            }else{
                throw new Error(response.message);
            }
        } catch (error) {
            message.error(error.message);
          
        }
    }
    return (
        <Modal onCancel={() => setOpen(false)}
         open={open} 
         centered title={"Add Transaction"} // Customize the OK button style
         className=' custom-ok-button focus:outline-none bg-blue-500 text-white'
         style={{ width: '80%' }}
         onOk={()=>{
            formRef.current.submit();
         }
        }
        
        okText={"Add Transaction"}
         cancelText={"Cancel"}
         okButtonProps={{className: "custom-ok-button focus:outline-none bg-blue-500 text-white"}}
        
         >
         <div className='flex flex-col gap-2'>
        <Form layout='vertical' ref={formRef} onFinish={onFinish}>
            <div className='flex flex-row gap-2'>
                <Form.Item name="clientName" label="Client Name" rules={rules} style={{ flex: 1 }}>
                    <Input />
                </Form.Item>
                <Form.Item name="phoneNumber" label="Phone Number" rules={rules} style={{ flex: 1 }}>
                    <Input type="number" />
                </Form.Item>
            </div>
            <div className='flex flex-row gap-2'>
                <Form.Item name="type" label="type" rules={rules} style={{ flex: 1 }}>
                    <Select onChange={handlePaymentChange}>
                        <Option value="income">Income</Option>
                        <Option value="outcome">Outcome</Option>
                    </Select>
                </Form.Item>
                {paymentValue === 'income' && (
                    <Form.Item name="payment" label="payment"  style={{ flex: 1 }}>
                        <Select>
                            <Option value="initial">Initial</Option>
                            <Option value="monthly">Monthly</Option>
                        </Select>
                    </Form.Item>
                )}
            </div>
            <div className='flex flex-row gap-2'>
                <Form.Item name="amountUSD" label="Amount USD" style={{ flex: 1 }}>
                    <Input type="number" min='0' />
                </Form.Item>
                <Form.Item name="amountIQD" label="Amount IQD" style={{ flex: 1 }}>
                    <Input type="number" min='0' />
                </Form.Item>
            </div>
            <Form.Item name="description" label="Description" rules={rules}>
                <Input.TextArea />
            </Form.Item>
            <div className='flex flex-row gap-2'>
                <Form.Item name="date" label="Date" rules={rules} style={{ flex: 1 }}>
                    <DatePicker />
                </Form.Item>
                <Form.Item name="time" label="Time" rules={rules} style={{ flex: 1 }}>
                    <TimePicker />
                </Form.Item>
            </div>
        </Form>
    </div>
        </Modal>
    )
}

TransactionModal.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
};

export default TransactionModal
