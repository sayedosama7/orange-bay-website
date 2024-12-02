import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../store/Login/LoginApi';

export default function Login() {
    const [login, { isLoading, error, data }] = useLoginMutation();
    const navigate = useNavigate();

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    useEffect(() => {
        if (data) {
            localStorage.setItem('token', data.token);

            if (data.role === 'Admin') {
                navigate('/');
            } else if (data.role === 'Employee') {
                navigate('/');
            } else {
                console.error('Invalid role');
            }
        }
    }, [data, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        await login({ username, password });
    };

    return (
        <div className="all-login">
            <div className="container-fluid">
                <div className="row">
                    <div
                        className="col-md-5 mt-4 m-lg-3 m-0 rounded-4 login-form"
                        style={{
                            height: '90vh',
                            backgroundColor: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <div className="col-md-8 ml-auto mr-auto login-edit">
                            <div className="d-flex justify-content-center mb-4">
                                <img src="/logo.png" alt="" />
                            </div>
                            <h3 className="mb-4" style={{ fontWeight: '600' }}>
                                Sign In
                            </h3>
                            <form onSubmit={handleLogin}>
                                <div className="form-group">
                                    <label className="d-flex" htmlFor="username">
                                        User Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        autoComplete="username"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="d-flex" htmlFor="password">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="password"
                                    />
                                </div>
                                {error && (
                                    <div className="alert alert-danger">
                                        {error.data && typeof error.data === 'object' && error.data.errors && error.data.errors.length > 0
                                            ? error.data.errors[0].message
                                            : error.data && error.data.detail
                                                ? error.data.detail
                                                : 'Invalid username or password'}
                                    </div>
                                )}

                                <div>
                                    <button
                                        type="submit"
                                        className="btn btn-warning btn-block text-center mb-2"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Signing in...' : 'Sign in'}
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
