import React from 'react';
import "../loginPage/LoginPage.scss";
import logo from "../../../assets/logo.png";
import LoginForm from '../loginForm/LoginForm';

/**
 * The LoginPage component displays the login page UI.
 * 
 * @returns The login page UI.
 */
const LoginPage = () => {
  return (
    <div className='login-container'>
        <div className='header'>
            <img src = {logo} alt="" />
            <span>  Sole & Sapori</span>
        </div>
        <div className='form-container'>
            <span>Benvenuto in Sole & Sapori, qui puoi trovare tante deliziose ricette!</span>
            <LoginForm />
        </div>
    </div>
  )
}

export default LoginPage;