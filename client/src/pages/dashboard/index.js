import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getMovieTrivia } from "../../functions";

const Dashboard = () => {
    const { user } = useSelector(state => ({ ...state }));
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");
    const [trivia, setTrivia] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setInput(localStorage.getItem('movie'));
        } else {
            setInput('');
            setTrivia('');
            localStorage.removeItem('movie');
        }
    }, [user])

    const handleSubmit = (e) => {
        localStorage.setItem('movie', input);
        e.preventDefault();
        if (user) {
            setLoading(true);
            getMovieTrivia(input)
                .then((res) => {
                    setTrivia(res?.data?.output?.[0]?.content?.[0]?.text);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                })
        } else {
            toast.error('Login to view trivia');
            navigate('/login');
        }
    }

    return <div className='container mt-5 login-container'>
        <div className='row mt-5 pt-5'>
            <div className='col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-10 offset-1 shadow p-lg-5 p-md-4 p-3'>
                <form onSubmit={handleSubmit} className='container-fluid'>
                    <div className='form-group mb-4 text-center'>
                        {loading && <h3>Loading...</h3>}
                    </div>
                    <div className='form-group my-3 row p-0'>
                        <div className='col-9 mb-3 mb-md-1 p-0'>
                            <input
                                id='text'
                                type='text'
                                className='form-control w-100'
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder='Movie'
                            />
                        </div>
                        <div className='col-3 mb-3 mb-md-1 p-0'>
                            <button className='btn btn-raised btn-filled' type='submit' disabled={!input || loading}>
                                View Trivia
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {trivia && <div className='col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-10 offset-1 shadow p-lg-5 p-md-4 p-3'>
                <form onSubmit={handleSubmit} className='container-fluid'>
                    <div className='form-group my-3 row p-0'>
                        <p className='text-justify'>{trivia}</p>
                    </div>
                </form>

            </div>}
        </div>
    </div>
}

export default Dashboard;
