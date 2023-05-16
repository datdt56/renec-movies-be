const {adminAuth} = require("./firebaseAdmin");
const authMiddleware = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization
        const accessToken = typeof authorization === 'string' ? authorization.replace(/^Bearer\s+/i, '') : null;
        if (!accessToken)
            return res.status(401).send({message: "login is required"});
        const result = await adminAuth.verifyIdToken(accessToken)
        req.user = result
        return next()
    } catch (e) {
        console.log('middleware error')
        console.log(e);
        return res.status(401).send(e);
    }
}

module.exports = authMiddleware