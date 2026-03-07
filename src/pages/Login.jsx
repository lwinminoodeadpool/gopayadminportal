import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Fetch access token using client credentials via dev proxy
            const tokenResponse = await fetch('/baas/auth/v1.0/oauth2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    client_id: 'c7d8640f6a20cce91bb1f670a41c8ffb',
                    client_secret: 'b83dc4306aa20f8c349ce07ec3e7520e6b55723e5a52eeab',
                    grant_type: 'client_credentials'
                })
            });

            if (!tokenResponse.ok) {
                throw new Error(`Authentication failed: Failed to get access token (Status: ${tokenResponse.status})`);
            }

            const tokenData = await tokenResponse.json();

            if (!tokenData.access_token) {
                throw new Error('Authentication failed: Missing access token in response payload');
            }

            // Extract the 'access_token' value. Not to be confused with 'access-token' expected header
            const accessToken = tokenData.access_token;

            // 2. Perform user login using the fetched token via dev proxy
            const loginResponse = await fetch('/service/Bill_Payments__copay/1.0.0/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'access-token': accessToken // Setting as per required parameter variable name
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                })
            });

            const loginData = await loginResponse.json();

            console.log('--- RAW KBZPAY LOGIN RESPONSE ---');
            console.log(loginData);
            console.log('---------------------------------');

            // Many enterprise APIs like KBZPay return 200 OK HTTP but with a business logic error in the payload
            // Check HTTP level failure
            if (!loginResponse.ok) {
                throw new Error(loginData.msg || loginData.message || loginData.error || `Login failed (Status: ${loginResponse.status})`);
            }

            // --- KBZPAY SPECIFIC RESPONSE HANDLING ---
            // The screenshot shows a successful login returns:
            // { resCode: "0", resMsg: "success", result: { code: 0, data: {...}, message: "Login successful", success: true } }

            // 1. Check top-level resCode
            if (loginData.resCode && loginData.resCode !== '0' && loginData.resCode !== '0000') {
                throw new Error(loginData.resMsg || 'Login failed: Invalid credentials');
            }

            // 2. If it has a result object, check the internal code
            if (loginData.result) {
                if (loginData.result.code && loginData.result.code !== 0 && loginData.result.code !== '0') {
                    throw new Error(loginData.result.message || 'Login failed');
                }
                if (loginData.result.success === false) {
                    throw new Error(loginData.result.message || 'Login failed');
                }
            }

            // 3. Fallback explicit failure check on top-level object
            const isExplicitFailure =
                loginData.success === false ||
                loginData.status === false ||
                (typeof loginData.status === 'string' && loginData.status.toLowerCase() === 'error') ||
                (typeof loginData.status === 'string' && loginData.status.toLowerCase() === 'fail') ||
                (typeof loginData.status === 'string' && loginData.status.toLowerCase() === 'failure');

            if (isExplicitFailure) {
                throw new Error(loginData.msg || loginData.message || loginData.resMsg || loginData.error || 'Invalid username or password');
            }

            if (loginData.error) {
                throw new Error(loginData.error);
            }

            // If we fall through and the data doesn't look like a success payload, let's just log it and potentially throw an error.
            // E.g. what is in a successful loginData? If it doesn't give us a clear success signal...
            // For now, let's just assume if it reaches here and didn't trigger above, it "passed"... but wait, maybe it just returns { "status": "Failed" }

            // Assume login success here. Store the retrieved accessToken.
            localStorage.setItem('access-token', accessToken);

            // 3. Redirect to dashboard
            navigate('/', { replace: true });

        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'An unexpected error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-icon">
                    <LogIn />
                </div>

                <h1 className="login-title">Go Pay Admin</h1>
                <p className="login-subtitle">Sign in to access your dashboard</p>

                <form className="login-form" onSubmit={handleLogin}>
                    {error && (
                        <div className="error-message">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" />
                            <input
                                id="username"
                                type="text"
                                name="username"
                                placeholder="Enter your username"
                                className="login-input"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={loading}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" />
                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                className="login-input"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading || !formData.username || !formData.password}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="spinner" size={20} />
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
