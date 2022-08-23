import React from 'react';
import PropTypes from 'prop-types';
import { Button, Drawer, Form } from 'antd';
import InputField from 'custom-fields/InputField';
import ButtonCustom from 'components/ButtonCustom';
import './Auth.scss';

import { LoginSocialFacebook, LoginSocialGoogle, LoginSocialGithub } from 'reactjs-social-login';
import { FacebookLoginButton, GoogleLoginButton, GithubLoginButton } from 'react-social-login-buttons'


Auth.propTypes = {

};

function Auth(props) {

    const [isLoginMode, setIsLoginMode] = React.useState(true)

    const onLogin = (values) => {
        const url = '';
        console.log(values)
    }

    const onRegister = (values) => {
        const url = '';
        console.log(values)
    }

    return (
        <div className='auth-wrapper'>
            {false &&
                <Drawer visible={true} title={isLoginMode ? 'Đăng nhập' : 'Đăng ký'} placement="right" >
                    {/* login */}
                    {
                        isLoginMode ?
                            <Form layout='vertical'
                                onFinish={(values) => onLogin(values)}
                            >
                                <InputField name='userName' label='Tài khoản' />
                                <InputField name='passWord' label='Mật khẩu' type='password' />
                                <a>Quên mật khẩu?</a>
                                <ButtonCustom type='submit' style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} text="Đăng nhập" />
                                <Button block style={{ marginTop: '1rem' }} onClick={() => setIsLoginMode(false)}>Đăng ký tài khoản mới</Button>
                                <br />
                                <br />
                                <div className="group-login-social-media">
                                    <p>or</p>
                                    <LoginSocialFacebook
                                        isOnlyGetToken
                                        appId={process.env.REACT_APP_FB_APP_ID || ''}
                                        onLoginStart=""
                                        onResolve=""
                                        onReject=""
                                    >
                                        <FacebookLoginButton className='btn-social-media' />
                                    </LoginSocialFacebook>

                                    <LoginSocialGoogle
                                        isOnlyGetToken
                                        appId={process.env.REACT_APP_GG_APP_ID || ''}
                                        onLoginStart=""
                                        onResolve=""
                                        onReject=""
                                    >
                                        <GoogleLoginButton className='btn-social-media' />
                                    </LoginSocialGoogle>

                                    <LoginSocialGithub
                                        isOnlyGetToken
                                        client_id={process.env.REACT_APP_GITHUB_APP_ID || ''}
                                        client_secret={process.env.REACT_APP_GITHUB_APP_SECRET || ''}
                                        onLoginStart=""
                                        onResolve=""
                                        onReject=""
                                    >
                                        <GithubLoginButton className='btn-social-media' />
                                    </LoginSocialGithub>

                                </div>
                            </Form> :
                            <Form
                                layout='vertical'
                                onFinish={(values) => onRegister(values)}>
                                <InputField name='userName' label='Tài khoản' />
                                <InputField name='passWord' label='Mật khẩu' type='password' />
                                <InputField name='mail' label='Email' type='email' />
                                <InputField name='phone' label='Số điện thoại' />
                                <InputField name='address' label='Địa chỉ' type='textarea' rows={5} />
                                <ButtonCustom style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} text="Đăng ký" />
                                <Button block style={{ marginTop: '1rem' }} onClick={() => setIsLoginMode(true)}>Đã có tài khoản?</Button>
                            </Form>
                    }
                </Drawer>
            }
        </div >
    );
}

export default Auth;