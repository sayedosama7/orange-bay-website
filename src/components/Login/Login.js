import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { baseURL, LOGIN } from '../Api/Api';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [linkEnabled, setLinkEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleUsernameChange = e => {
        const { value } = e.target;
        setUsername(value);
        checkInputValues(value, password);
    };

    const handlePasswordChange = e => {
        const { value } = e.target;
        setPassword(value);
        checkInputValues(username, value);
    };

    const checkInputValues = (username, password) => {
        if (username.trim() !== '' && password.trim() !== '') {
            setLinkEnabled(true);
        } else {
            setLinkEnabled(false);
        }
    };

    const handleLogin = async e => {
        e.preventDefault();
        if (linkEnabled) {
            setIsLoading(true);
            setError('');
            try {
                const response = await axios.post(
                    `${baseURL}/${LOGIN}`,
                    {
                        userName: username,
                        password: password,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const token = response.data.accessToken;
                localStorage.setItem('token', token);

                const decodedToken = jwtDecode(token);
                const role =
                    decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

                if (role === 'Admin') {
                    navigate('/');
                } else if (role === 'Employee') {
                    navigate('/');
                } else {
                    setError('Invalid role');
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setError('user name or password is in correct');
                } else {
                    setError('user name or password is in correct');
                }
                console.error('Login failed:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="all-login">
            <div className="container-fluid">
                <div className="row">
                    <div
                        className="col-md-5 mt-4 mx-3 rounded-4"
                        style={{
                            height: '90vh',
                            backgroundColor: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <div className="col-md-8  ml-auto mr-auto login-edit">
                            <div className='d-flex justify-content-center mb-4'>
                                <img src="/logo.png" alt="" />
                            </div>
                            <h3 className="mb-4" style={{ fontWeight: '600' }}>
                                Sign In
                            </h3>
                            <form onSubmit={handleLogin}>
                                <div className="form-group">
                                    <label
                                        className="d-flex"
                                        htmlFor="username"
                                    >
                                        User Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control "
                                        id="username"
                                        value={username}
                                        onChange={handleUsernameChange}
                                        autoComplete="username"
                                    />
                                </div>
                                <div className="form-group">
                                    <label
                                        className="d-flex"
                                        htmlFor="password"
                                    >
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        autoComplete="password"
                                    />
                                </div>
                                {error && <div className="alert alert-danger">{error}</div>}
                                <div>
                                    <button
                                        type="submit"
                                        className="btn btn-warning btn-block text-center mb-2"
                                        disabled={!linkEnabled || isLoading}
                                    >
                                        {isLoading ? '.signing in..' : 'sign in '}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
