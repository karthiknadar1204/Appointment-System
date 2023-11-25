import React from 'react'
import {Form,Input, message} from 'antd'
import "../styles/RegisterStyles.css"
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import {showLoading,hideLoading} from "../redux/features/alertSlice";
import {useDispatch} from 'react-redux';

const Register = () => {
  const navigate=useNavigate();
  const dispatch=useDispatch();

  const onfinishHandler=async(values)=>{
    try {
      dispatch(showLoading());
      const res=await axios.post('/api/v1/user/register',values);
      dispatch(hideLoading());
      if(res.data.success){
        message.success("registered successfully")
        navigate('/login')
      }else{
        dispatch(hideLoading());
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error('something went wrong');
    }
  }
  return (
    <>
      <div className='form-container'>

        <Form layout='vertical' onFinish={onfinishHandler} className='register-form'>
          <h3 className='text-center' >Register Form</h3>
          <Form.Item label="Name" name="name" >
            <Input type='text' required />
          </Form.Item>

          <Form.Item label="email" name="email" >
            <Input type='email' required />
          </Form.Item>

          <Form.Item label="password" name="password" >
            <Input type='password' required />
          </Form.Item>
          <Link to={'/login'} className='ms-2' >Already logged in?</Link>
          <button className='btn btn-primary' type='submit' >Register</button>
        </Form>

      </div>
    </>
  )
}

export default Register