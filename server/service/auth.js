const user = require('../model/user');

exports.createOrUpdateUser = async (req, res) => {
    try {
        const { email } = req.user;
        const { firstName, lastName, dob, gender, contact, address, state, city, zipCode, role } = req.body.userDetails;
        let existingUser = await user.findOneAndUpdate({ email }, { firstName, lastName, dob, gender, contact, address, state, city, zipCode, role }, { new: true });
        if (existingUser) {
            res.status(200).json({ user: existingUser, message: 'Existing User Updated Successfully!' });
        } else {
            let newUser = await new user({ firstName, lastName, dob, gender, email, contact, address, state, city, zipCode, role }).save();
            if (newUser) {
                res.status(200).json({ user: newUser, message: 'New User Registered Successfully!' });
            }
            else {
                res.status(202).json({ message: 'Failed To Register/Update User!' });
            }
        }
    } catch (error) {
        res.status(400).json(error);
    }
};

exports.createGoogleUser = async (req, res) => {
    const { name, email, picture } = req.user;

    const existingUser = await user.findOne({ email });
    if (existingUser) {
        res.status(200).json({ user: existingUser, message: 'Existing User Updated Successfully!', new: false });
    } else {
        const newUser = await new user({
            email,
            firstName: name,
            picture
        }).save();
        if (newUser) {
            res.status(200).json({ user: newUser, message: 'New User Registered Successfully!', new: true });
        }
        else {
            res.status(202).json({ message: 'Failed To Register/Update User!' });
        }
    }
}

exports.checkUser = async (req, res) => {
    try {
        const { email } = req.body;
        let existingUser = await user.findOne({ email });
        if (existingUser) {
            res.status(200).json({ message: 'Valid User', pathname: '/login' });
        }
        else {
            res.status(202).json({ message: `User doesn't exist`, pathname: '/create-account' });
        }
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.getCurrentUser = async (req, res) => {
    try {
        const { email } = req.user;
        let existingUser = await user.findOne({ email });
        if (existingUser) {
            res.status(200).json({ user: existingUser, messgae: 'Current User Details' });
        }
        else {
            res.status(202).json({ message: 'No User Found' });
        }
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.health = async (req, res) => {
    try {
        res.status(200).json({ message: "healthy" });
    } catch (error) {
        res.status(400).json(error);
    }
}