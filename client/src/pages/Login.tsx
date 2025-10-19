import React, { useState } from 'react';
import { Button, Form, type FormProps, Input, Layout } from 'antd';
import '../styles/client.css';
import { Link, NavigateFunction, useLocation, useNavigate } from 'react-router-dom';
import { login } from '../connections/connection'
import { useLogin } from '../context/loginProvider';

type FieldType = {
    username?: string;
    password?: string;
};

const Login = () => {
    let navigate: NavigateFunction = useNavigate();
    const { setIsLoggedIn } = useLogin();
    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        try {
            const value = await login(values);
            if (value != null) {
                navigate("/home",);
                setIsLoggedIn(true);
            }

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);

        }
    }

    const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = async (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (

        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600}}
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
                    Login
                </Button>
                <Link to="/Register" style={{ marginLeft: 20 }}>
                    <Button>
                        Register
                    </Button>
                </Link>
            </Form.Item>
        </Form>
    );
}

export default Login;