import axios from 'axios';

export const createOrUpdateUser = async (userDetails, idToken) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/createOrUpdateUser`,
        {
            userDetails
        },
        {
            headers: {
                idToken
            }
        }
    )
}

export const createGoogleUser = async (idToken) => {
    return await axios.get(
        `${process.env.REACT_APP_API}/createGoogleUser`,
        {
            headers: {
                idToken
            }
        }
    )
}

export const checkUser = async (email) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/checkUser`,
        {
            email
        }
    )
}

export const currentUser = async (email, idToken) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/getCurrentUser`,
        {
            email
        },
        {
            headers: {
                idToken
            }
        }
    )
}

export const getMovieTrivia = async (movie) => {
    return await axios.post(
        `${process.env.REACT_APP_PROMPT_URL}`,
        {
            model: "gpt-4.1-mini",
            input: [
                { role: "system", content: "You are a film research assistant. Return one short, surprising, verifiable fact about the given movie."},
                { role: "user", content: movie }
            ]
        },
        {
            headers: {
                'Authorization': `Bearer ${process.env.REACT_APP_PROMPT_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    )
}
