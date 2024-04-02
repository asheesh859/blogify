const { validateToken } = require("../services/authentication");

function chekAuthForUserCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookeiValue = req.cookies[cookieName];
        if (!tokenCookeiValue) {
           return next();
        }
        try {
            const payload = validateToken(tokenCookeiValue);
             req.user= payload;
        } catch (error) {

        }
       return next();
    }
}

module.exports = {
    chekAuthForUserCookie
}