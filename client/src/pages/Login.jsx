import React from 'react';
import {Form,Input,message} from 'antd';
import "../styles/RegisterStyles.css";
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {showLoading,hideLoading} from "../redux/features/alertSlice";
import {useDispatch} from 'react-redux';

const Login = () => {
  const navigate=useNavigate();
  const dispatch=useDispatch();

  const onfinishHandler=async(values)=>{
    try {
      dispatch(showLoading());
      const res=await axios.post('/api/v1/user/login',values);
      window.location.reload();
      dispatch(hideLoading());
      if(res.data.success){
        localStorage.setItem('token',res.data.token);
        message.success('Login successfully');
        navigate('/')
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  }
  
  return (
    <>
      <div className='form-container'>

        <Form layout='vertical' onFinish={onfinishHandler} className='register-form'>
          <h3 className='text-center' >Login Form</h3>

          <Form.Item label="email" name="email" >
            <Input type='email' required />
          </Form.Item>

          <Form.Item label="password" name="password" >
            <Input type='password' required />
          </Form.Item>
          <Link to={'/register'} className='ms-2' >Not registered yet?</Link>
          <button className='btn btn-primary' type='submit' >Register</button>
        </Form>

      </div>
    </>
  )
}

export default Login