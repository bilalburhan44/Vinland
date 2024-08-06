import { Form, Input, Modal, message } from 'antd';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { updateDailyNote } from 'apicalls/dailyTotal';

function NoteModal({ open, setOpen, AddNote, EditNote, fetchData }) {
    const formRef = React.useRef();
    const [loading, setLoading] = useState(false);
    const rules = [{ required: true, message: 'Required' }];

    useEffect(() => {
        if (EditNote) {
            formRef.current.setFieldsValue({ note: EditNote.note }); // Only set note if EditNote exists
        } else {
            formRef.current.resetFields();
        }
    }, [EditNote]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            let response;
            const date = EditNote ? EditNote.date : AddNote?.date;
    
            if (!date) {
                throw new Error('Date is missing');
            }
    
            response = await updateDailyNote(date, values);
    
            if (response.success) {
                message.success(response.message);
                setOpen(false);
                fetchData();
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
            onCancel={() => setOpen(false)}
            open={open}
            centered
            title={EditNote ? "Edit Note" : "Add Note"}
            onOk={() => formRef.current.submit()}
            okText={EditNote ? "Save" : "Add Note"}
            cancelText="Cancel"
            okButtonProps={{ loading }}
        >
            <div className='flex flex-col gap-2'>
                <Form layout='vertical' ref={formRef} onFinish={onFinish}>
                    <Form.Item name="note" label="Write Your Note" rules={rules}>
                        <Input type="text" />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
}

NoteModal.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    EditNote: PropTypes.object,
    AddNote: PropTypes.object,
    fetchData: PropTypes.func.isRequired,
};

export default NoteModal;
