import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';

import { auth } from '../../service/firebase';
import './index.css';

const Navbar = () => {
    const { user } = useSelector(state => ({ ...state }));
    const title = "Scowtt";
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [header, setHeader] = useState('Welcome!');
    const [options, setOptions] = useState('');

    useEffect(() => {
        setHeader(user ? `Welcome ${user?.firstName}!` : 'Welcome!');
        setOptions(user?.options);
    }, [user])

    const handleRoute = (option) => {
        let routes = option.split(' ');
        if (option === 'Dashboard') {
            return '/';
        }
        return `/${routes.length > 1 ? routes.map(route => route.toLowerCase()).join('-') : routes[0].toLowerCase()}`;
    }

    const handleSignout = () => {
        setLoading(true);
        signOut(auth)
            .then(() => {
                dispatch({
                    type: 'LOGOUT',
                    payload: null
                })
                toast.success('Sign Out Success!');
                navigate('/');
                setLoading(false);
            })
            .catch(() => {
                toast.error('Something went wrong...please try again!');
                setLoading(false);
            })
    }

    return (
        <nav className='navbar navbar-top navbar-light fixed-top shadow-lg'>
            <div className='container-fluid justify-content mx-md-3'>
                <div>
                    <Link className='navbar-brand fw-bold fs-5' to="/">{title}</Link>
                </div>
                <div className='dropdown justify-content-end mx-3 d-flex'>
                    <button className='navbar-toggler mx-md-3 mx-2' type='button' data-bs-toggle='offcanvas' data-bs-target='#offcanvaslightNavbarOuter' aria-controls='offcanvaslightNavbarOuter'>
                        {user?.picture? <span><img src={user.picture} height="100%" width="50%"/></span> : <span><i className='bi bi-person'></i></span>}
                    </button>

                    <div className='offcanvas offcanvas-end text-bg-light' tabIndex='-1' id='offcanvaslightNavbarOuter' aria-labelledby='offcanvaslightNavbarOuterLabel'>
                        <div className='offcanvas-header'>
                            <h5 className='offcanvas-title' id='offcanvaslightNavbarOuterLabel'>
                                {loading ? 'Loading...' : header}
                            </h5>
                            <button type='button' className='btn-close btn-close-black' data-bs-dismiss='offcanvas' aria-label='Close'></button>
                        </div>
                        <div className='offcanvas-body py-0'>
                            {user ? <ul className='navbar-nav text-start flex-grow-1 p-0 m-0'>
                                {options && options.map(option => <li className={`nav-item px-1 py-1 rounded ${location.pathname === handleRoute(option) ? 'active-option' : 'btn-option'}`} key={option}>
                                    <button className='btn border-0 text-start' data-bs-dismiss='offcanvas'>
                                        <Link className='text-decoration-none custom-text-color d-flex w-100' to={handleRoute(option)}>{option}</Link>
                                    </button>
                                </li>)}
                                <li className='nav-item'>
                                    <button type='button' className='btn btn-auth-filled' data-bs-dismiss='offcanvas' onClick={handleSignout}>Sign Out</button>
                                </li>
                            </ul> : <ul className='navbar-nav text-center flex-grow-1'>
                                <li className='nav-item'>
                                    <button className='btn btn-auth-filled' data-bs-dismiss='offcanvas'>
                                        <Link className='text-decoration-none custom-text-color d-block' to={handleRoute('Login')}>{'Login'}</Link>
                                    </button>
                                </li>
                                <li className='nav-item'>
                                    <button className='btn btn-auth-hollow' data-bs-dismiss='offcanvas'>
                                        <Link className='text-decoration-none custom-text-color d-block' to={handleRoute('Create Account')}>{'Create Account'}</Link>
                                    </button>
                                </li>
                            </ul>}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
