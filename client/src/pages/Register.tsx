import React from 'react';
import { Button, Form, type FormProps, Input } from 'antd';
import '../styles/client.css';
import { registerUser } from '../connections/connection'
import { NavigateFunction, useNavigate } from 'react-router-dom';

type FieldType = {
  username?: string;
  password?: string;
};

const Register = () => {
  let navigate: NavigateFunction = useNavigate();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      const value = await registerUser(values);
      console.log(value)
      if (value != null) {
        navigate("/login");
      }

    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);

    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (

    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
}
export default Register;