import { Form, Input, Modal, message, DatePicker, TimePicker, Select, AutoComplete } from 'antd'
import React , { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types'
import { addProject } from 'apicalls/projects';
import { updateProject } from 'apicalls/projects';
import { updateUser } from 'apicalls/users';



function UserModal({ open, setOpen, userToEdit, fetchUsers  }) {
    const formRef = React.useRef();
    const { user } = useSelector((state) => state.users);
    const [loading, setLoading] = useState(false);
    const rules = [{ required: true, message: 'Required' }];
   
    const { Option } = Select;

    useEffect(() => {
      if (userToEdit) {
        formRef.current.setFieldsValue({
          name: userToEdit.name,
          role: userToEdit.role,
        });
      } else {
        formRef.current.resetFields();
      }
    }, [userToEdit]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      let response;
      if (userToEdit) {
        response = await updateUser(userToEdit.id, values);
      }
      if (response.success) {
        message.success(response.message);
        setOpen(false);
        fetchUsers();
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
        <Modal onCancel={() => setOpen(false)}
        open={open}  
         centered title={"Edit User Information"} // Customize the OK button style
         style={{ width: '80%' }}
         onOk={()=>{
            formRef.current.submit();
         }
        }
        
        okText={"Save"}
         cancelText={"Cancel"}
         okButtonProps={{ loading }}         >
         <div className='flex flex-col gap-2'>
        <Form layout='vertical' ref={formRef} onFinish={onFinish} >
            <div className='flex flex-row gap-2'>
                <Form.Item name="name" label="User Name" rules={rules} style={{ flex: 1 }}>
                   <Input type="text" />
                </Form.Item> 
                <Form.Item name="password" label="Password" initialValues={0} style={{ flex: 1 }}>
                <Input type="text" />
                </Form.Item> 
                { user?.data?.role === 'admin' && <Form.Item name="role" label="Role" initialValues={0} style={{ flex: 1 }}>
                    <Select>
                        <Option value="admin">Admin</Option>
                        <Option value="moderator">Moderator</Option>
                    </Select>
                </Form.Item> }
            </div>
        </Form>
    </div>
        </Modal>
    )
}

UserModal.propTypes = {
   open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    userToEdit: PropTypes.object,
    fetchUsers: PropTypes.func.isRequired
};

export default UserModal
