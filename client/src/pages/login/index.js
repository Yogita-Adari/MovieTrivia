import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { auth, googleAuth } from '../../service/firebase';
import { checkUser, currentUser, createGoogleUser } from '../../functions';

import './index.css';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        handleCheckUser();
    }

    const handleCheckUser = () => {
        checkUser(email)
            .then(res => {
                if (res.status === 202) {
                    toast.error(res.data.message);
                    navigate(res.data.pathname);
                    setLoading(false);
                } else {
                    validateCredentials();
                }
            })
            .catch((err) => {
                toast.error(err);
                setLoading(false);
            })
    }

    const validateCredentials = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(res => {
                const { user } = res;
                toast.success('Login Success!');
                dispatchUserDetails(user);
                setLoading(false);
            })
            .catch(e => {
                toast.error('Invalid Credentials or Signin with Google');
                setLoading(false);
            })
    }

    const googleLogin = async () => {
        googleAuth.setCustomParameters({ prompt: "select_account" }); 
        await signInWithPopup(auth, googleAuth)
            .then(async (res) => {
                setLoading(true);
                const { user } = res;
                createGoogleUser(user.accessToken)
                    .then((res) => {
                        const newSignin = res.data.new;
                        const { idToken } = res.config.headers;
                        const options = ['Dashboard', 'Manage Profile'];
                        const { firstName, email, _id } = res.data.user;
                        let payload = { firstName, email, _id, options, token: idToken };
                        if (!newSignin) {
                            const { lastName, dob, gender, contact, address, state, city, zipCode } = res.data.user;
                            payload = { ...payload, lastName, dob, gender, contact, address, state, city, zipCode };
                        }
                        dispatch({
                            type: "LOGGED_IN_USER",
                            payload
                        });
                        toast.success('Login Success!');
                        toast.success(`Welcome ${firstName}! `);
                        navigate('/');
                        setLoading(false);
                    })
                    .catch((err) => {
                        setLoading(false);
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.message);
                setLoading(false);
            });
    };

    const dispatchUserDetails = async (user) => {
        const idTokenResult = await user.getIdTokenResult();
        let options = [];
        currentUser(user.email, idTokenResult.token)
            .then((res) => {
                if (res.status === 200) {
                    const { firstName, lastName, dob, gender, email, contact, address, state, city, zipCode, role, _id } = res.data.user;
                    toast.success(`Welcome ${firstName}! `);
                    const { idToken } = res.config.headers;
                    options = ['Dashboard', 'Manage Profile'];
                    dispatch({
                        type: 'LOGGED_IN_USER',
                        payload: { firstName, lastName, dob, gender, email, contact, address, state, city, zipCode, role, _id, options, token: idToken }
                    });
                    navigate('/');
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch(() => toast.error('Something went wromg...please try again'))
    }

    return (
        <div className='container mt-5 login-container'>
            <div className='row mt-5 pt-5'>
                <div className='col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-10 offset-1 shadow p-lg-5 p-md-4 p-3'>
                    <form onSubmit={handleSubmit} className='container-fluid'>
                        <div className='form-group mb-4 text-center'>
                            {loading ? <h3>Loading...</h3> : <h3>{"Login"}</h3>}
                        </div>
                        <div className='form-group my-3 row p-0'>
                            <label htmlFor='email' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Email</label>
                            <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                <input
                                    id='email'
                                    type='email'
                                    className='form-control w-100'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='abc@example.com'
                                />
                            </div>
                        </div>
                        <div className='form-group my-3 row p-0'>
                            <label htmlFor='password' className='col-md-3 d-none d-md-block col-form-label text-xl-end fw-bold fs-6'>Password</label>
                            <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                <input
                                    id='password'
                                    type='password'
                                    className='form-control w-100'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder='Password'
                                />
                            </div>
                        </div>


                        <div className='d-flex row p-0'>
                            <div className='col-3 offset-3 text-start p-0'>
                                <button className='btn btn-raised btn-filled' type='submit' disabled={!email || password.length < 6}>
                                    Login
                                </button>
                            </div>
                            <div className='col-5 text-end align-content-end p-0'>
                                <Link to='/reset-password' className='text-danger text-decoration-none'>
                                    Forgot Password
                                </Link>
                            </div>
                        </div>
                    </form>

                    <div className='col-12 text-center pt-4'>
                        <button className='btn btn-raised btn-hollow' type='submit' onClick={googleLogin}>
                            Signin with Google
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login;
