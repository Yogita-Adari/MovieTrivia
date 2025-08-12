import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { auth } from '../../service/firebase';
import { signInWithEmailLink, updatePassword } from 'firebase/auth';
import { createOrUpdateUser, currentUser } from '../../functions';
import states from '../../assets/json/states.json';

const Registration = ({ profileUpdate = false }) => {
    const { user } = useSelector(state => ({ ...state }));
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [dob, setDob] = useState(user?.dob || '');
    const [gender, setGender] = useState(user?.gender || '');
    const [contact, setContact] = useState(user?.contact || '');
    const [address, setAddress] = useState(user?.address || '');
    const [state, setState] = useState(user?.state || '');
    const [city, setCity] = useState(user?.city || '');
    const [zipCode, setZipCode] = useState(user?.zipCode || '');
    const [title, setTitle] = useState(user ? 'Manage Profile' : 'Registration Form');
    const [btnTitle, setBtnTitle] = useState(user ? 'Update' : 'Register');
    const [loading, setLoading] = useState(false);
    const [passwordUpdate, setPasswordUpdate] = useState(false);

    useEffect(() => {
        if (profileUpdate && user) {
            setEmail(user?.email);
            setFirstName(user?.firstName);
            setLastName(user?.lastName);
            setDob(user?.dob);
            setGender(user?.gender);
            setContact(user?.contact);
            setAddress(user?.address);
            setState(user?.state);
            setCity(user?.city);
            setZipCode(user?.zipCode);
            setTitle('Manage Profile');
            setBtnTitle('Update');
        } else {
            setEmail(window.localStorage.getItem('email'));
        }
    }, [profileUpdate, user])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!profileUpdate) {
                const result = await signInWithEmailLink(auth, email, window.location.href);
                const user = auth.currentUser;
                const idTokenResult = await user.getIdTokenResult();

                if (result.user.emailVerified) {
                    updatePassword(user, password);
                    handleCommon(idTokenResult.token);
                    let options = [];

                    await currentUser(email, idTokenResult.token)
                        .then((res) => {
                            if (res.status === 200) {
                                const { firstName, lastName, dob, gender, email, contact, address, state, city, zipCode, role, _id } = res.data.user;
                                const { idToken } = res.config.headers;
                                options = ['Dashboard', 'Manage Profile'];
                                dispatch({
                                    type: 'LOGGED_IN_USER',
                                    payload: { firstName, lastName, dob, gender, email, contact, address, state, city, zipCode, role, _id, options, token: idToken }
                                });
                                navigate('/');
                            }
                        })
                }
                window.localStorage.removeItem('email');
            } else {
                handleCommon(user?.token);
            }
        } catch (error) {
            toast.error(error);
            navigate('/');
        }
    }

    const handleCommon = async (token) => {
        const userDetails = { firstName, lastName, dob, gender, contact, address, state, city, zipCode };
        await createOrUpdateUser(userDetails, token)
            .then((res) => {
                if (res.status === 200) {
                    toast.success(res.data.message);
                    setPassword('');
                    setConfirmPassword('');
                }
                setLoading(false);
                navigate('/');
            })
            .catch((error) => {
                setLoading(false);
                toast.error(error);
            });
    }

    const handleCheck = () => {
        setPasswordUpdate(!passwordUpdate);
        setPassword('');
        setConfirmPassword('');
    }

    return (
        <div className='container-fluid my-5 px-md-5'>
            <div className='row mt-5 pt-5 mx-md-2'>
                <div className='col-lg-8 col-10 offset-lg-2 offset-1 p-md-4 p-3 text-center shadow'>
                    {loading ? <h3>Loading...</h3> :
                        <form onSubmit={handleSubmit} className='container-fluid'>
                            <h3 className='mb-3 text-center'>{title}</h3>
                            <div className='form-group my-3 row p-0'>
                                <label htmlFor='email' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Email</label>
                                <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                    <input
                                        id='email'
                                        type='email'
                                        className='form-control w-100'
                                        value={email}
                                        required
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder='abc@example.com'
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className='form-group my-3 row p-0'>
                                <label htmlFor='first-name' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>First Name</label>
                                <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                    <input
                                        id='first-name'
                                        type='text'
                                        className='form-control w-100'
                                        value={firstName}
                                        required
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder='First Name'
                                    />
                                </div>
                            </div>
                            <div className='form-group my-3 row p-0'>
                                <label htmlFor='last-name' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Last Name</label>
                                <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                    <input
                                        id='last-name'
                                        type='text'
                                        className='form-control w-100'
                                        value={lastName}
                                        required
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder='Last Name'
                                    />
                                </div>
                            </div>
                            <div className='form-group my-3 row p-0'>
                                <label htmlFor='date-of-birth' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Date of Birth</label>
                                <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                    <input
                                        id='date-of-birth'
                                        type='date'
                                        className='form-control w-100'
                                        value={dob}
                                        required
                                        onChange={(e) => setDob(e.target.value)}
                                        placeholder='Date of Birth'
                                    />
                                </div>
                            </div>
                            <div className='form-group my-3 row p-0'>
                                <label htmlFor='gender' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Gender</label>
                                <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                    <select
                                        id='gender'
                                        className='form-select w-100'
                                        value={gender}
                                        required
                                        onChange={(e) => setGender(e.target.value)}
                                    >
                                        <option defaultValue>Select Gender</option>
                                        <option value='Male'>Male</option>
                                        <option value='Female'>Female</option>
                                        <option value='Preferred Not To Say'>Preferred Not to Say</option>
                                    </select>
                                </div>
                            </div>
                            <div className='form-group my-3 row p-0'>
                                <label htmlFor='contact-number' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Contact Number</label>
                                <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                    <input
                                        id='contact-number'
                                        type='text'
                                        className='form-control'
                                        value={contact}
                                        required
                                        onChange={(e) => setContact(e.target.value)}
                                        placeholder='+1 XXX-XXX-XXXX'
                                    />
                                </div>
                            </div>
                            <div className='form-group my-3 row p-0'>
                                <label htmlFor='address' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Address</label>
                                <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                    <input
                                        id='address'
                                        type='text'
                                        className='form-control w-100'
                                        value={address}
                                        required
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder='Apt No, Flat No, St Name'
                                    />
                                </div>
                            </div>
                            <div className='form-group my-3 row p-0'>
                                <label htmlFor='city' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>City</label>
                                <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                    <input
                                        id='city'
                                        type='text'
                                        className='form-control w-100'
                                        value={city}
                                        required
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder='City'
                                    />
                                </div>
                            </div>
                            <div className='form-group my-3 row p-0'>
                                <label htmlFor='state' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>State</label>
                                <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                    <select
                                        id='state'
                                        className='form-select w-100'
                                        value={state}
                                        required
                                        onChange={(e) => setState(e.target.value)}
                                    >
                                        <option defaultValue>Select State</option>
                                        {states.map(state => <option key={state} value={state}>{state}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className='form-group my-3 row p-0'>
                                <label htmlFor='zip-code' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Zip Code</label>
                                <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                    <input
                                        id='zip-code'
                                        type='text'
                                        className='form-control w-100'
                                        value={zipCode}
                                        required
                                        onChange={(e) => setZipCode(e.target.value)}
                                        placeholder='Zip Code'
                                    />
                                </div>
                            </div>
                            {/* {profileUpdate && <div class='form-switch my-3 row p-0'>
                                <label htmlFor='update-password' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Update Password</label>
                                <div className='col-md-8 col-12 mb-3 mb-md-1 p-0 d-flex align-items-center text-start'>
                                    <input class='form-check-input margin-left-zero' type='checkbox' role='switch' id='update-password' onChange={() => handleCheck()} />
                                </div>
                            </div>}
                            {(!profileUpdate || passwordUpdate) && <>
                                <div className='form-group my-3 row p-0'>
                                    <label htmlFor='password' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Password</label>
                                    <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                        <input
                                            id='password'
                                            type='password'
                                            className='form-control w-100'
                                            value={password}
                                            required
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder='Password'
                                        />
                                    </div>
                                </div>
                                <div className='form-group my-3 row p-0'>
                                    <label htmlFor='confirm-password' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Confirm Password</label>
                                    <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                        <input
                                            id='confirm-password'
                                            type='password'
                                            className='form-control w-100'
                                            value={confirmPassword}
                                            required
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder='Confirm Password'
                                        />
                                    </div>
                                </div>
                            </>} */}
                            <div className='form-group row p-0'>
                                <div className='col-md-4 col-6 offset-md-3 text-start p-0'>
                                    <button
                                        className='btn btn-raised btn-filled'
                                        type='submit'
                                        disabled={!email || !firstName || !lastName || !dob || !contact || !address || !city || !state || !zipCode}
                                    >
                                        {btnTitle}
                                    </button>
                                </div>
                            </div>
                        </form>
                    }
                </div>
            </div>
        </div>
    )
}

export default Registration;

