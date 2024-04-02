const JWT = require('jsonwebtoken');

const secretKey = "ashu@859";

function createTokenForUser(user){
    const payload ={
        _id: user._id,
        email:user.email,
        profileImageUrl : user.profileImageUrl,
        role:user.role,
    };

    const token = JWT.sign(payload , secretKey);
    return token;
}

function validateToken(token) {
    const payload = JWT.verify(token,secretKey);
    return payload;

}

module.exports = {
    createTokenForUser,
    validateToken
}