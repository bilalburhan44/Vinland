import { Form, Input, Modal, message, DatePicker, TimePicker, Select, AutoComplete } from 'antd'
import React , { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types'
import { addProject } from 'apicalls/projects';
import { updateProject } from 'apicalls/projects';



function ProjectModal({ open, setOpen,client_id, projectToEdit, fetchProjects  }) {
    const formRef = React.useRef();
    const { user } = useSelector((state) => state.users);
    const [loading, setLoading] = useState(false);
    const rules = [{ required: true, message: 'Required' }];
   
    const { Option } = Select;

    useEffect(() => {
      if (projectToEdit) {
        formRef.current.setFieldsValue(projectToEdit);
      } else {
        formRef.current.resetFields();
      }
    }, [projectToEdit]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      let response;
      if (projectToEdit) {
        response = await updateProject(projectToEdit.id, values);
      } else {
        formRef.current.resetFields();
        response = await addProject({...values,client_id, user_id: user.data.id});
      }
      if (response.success) {
        message.success(response.message);
        setOpen(false);
        fetchProjects();
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
         centered title={projectToEdit ? "Edit Project" : "Add Project"} // Customize the OK button style
         style={{ width: '80%' }}
         onOk={()=>{
            formRef.current.submit();
         }
        }
        
        okText={projectToEdit ? "Save" : "Add Project"}
         cancelText={"Cancel"}
         okButtonProps={{ loading }}         >
         <div className='flex flex-col gap-2'>
        <Form layout='vertical' ref={formRef} onFinish={onFinish} initialValues={!projectToEdit && { status: "First Stage"}}>
            <div className='flex flex-row gap-2'>
                <Form.Item name="project_name" label="Project Name" rules={rules} style={{ flex: 1 }}>
                   <Input type="text" />
                </Form.Item> 
                <Form.Item name="expectedIncome" label="ExpectedIncome" style={{ flex: 1 }}>
                   <Input type="Number" />
                </Form.Item> 
            </div>
            <div className='flex flex-row gap-2'>
                <Form.Item name="status" label="status" style={{ flex: 1 }}>
                    <Select>
                        <Option value="first stage">Fisrt Stage</Option>
                        <Option value="second stage">Second Stage</Option>
                        <Option value="third stage">Third Stage</Option>
                        <Option value="fourth stage">Fourth Stage</Option>
                        <Option value="completed">Completed</Option>
                        </Select>
                </Form.Item>
            </div>
        </Form>
    </div>
        </Modal>
    )
}

ProjectModal.propTypes = {
   open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    client_id: PropTypes.number,
    projectToEdit: PropTypes.object,
    fetchProjects: PropTypes.func.isRequired
};

export default ProjectModal