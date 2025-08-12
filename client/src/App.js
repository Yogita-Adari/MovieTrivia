import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import { auth } from './service/firebase';
import { currentUser } from './functions';
import Navbar from './component/navbar';
import Login from './pages/login';
import Register from './pages/register';
import Registration from './pages/register/registration';
import Dashboard from './pages/dashboard';

const App = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user && dispatch) {
        const idTokenResult = await user.getIdTokenResult();
        let options = [];

        currentUser(user.email, idTokenResult.token)
          .then((res) => {
            if (res.status === 200) {
              const { firstName, lastName, picture, dob, gender, email, contact, address, state, city, zipCode, _id } = res.data.user;
              const { idToken } = res.config.headers;
              options = ['Dashboard', 'Manage Profile'];
              let payload = { firstName, email, _id, options, token: idToken, picture };
              if (lastName && dob && gender && contact && address && state && city && zipCode) {
                payload = { ...payload, lastName, dob, gender, contact, address, state, city, zipCode };
              }
              dispatch({
                type: 'LOGGED_IN_USER',
                payload
              });
            }
          })
          .catch((error) => toast.error(error))
      }
      else {
        dispatch({
          type: 'LOGOUT',
          payload: null
        })
      }
    })
  }, [dispatch]);

  return (
    <div className='App'>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route exact path='/' element={<Dashboard />}></Route>
        <Route exact path='/login' element={<Login />}></Route>
        <Route exact path='/create-account' element={<Register />}></Route>
        <Route exact path='/registration-redirect' element={<Registration />}></Route>
        <Route exact path='/manage-profile' element={<Registration profileUpdate={true} />}></Route>
      </Routes>
    </div>
  )
}

export default App;
