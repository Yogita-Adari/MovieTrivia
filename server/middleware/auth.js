const admin = require('../firebase');

exports.authCheck = async (req, res, next) => {
    try {
        const user = await admin
            .auth()
            .verifyIdToken(req.headers.idtoken);
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Invalid or expired token',
        });
    }
}