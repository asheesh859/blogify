const { Schema, model } = require('mongoose')
const { createHmac, randomBytes } = require('crypto');
const {validateToken,createTokenForUser} = require('../services/authentication')

const userSchema = new Schema({
    fullName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        require: true,
    },
    profileImageUrl: {
        type: String,
        default: '/images/images.png',
    },
    role: {
        type: String,
        enum: ['USER', "ADMIN"],
        default: "USER"
    }

}, { timestamps: true })

userSchema.pre('save', function (next) {
    // do stuff
    const user = this;
    if (!user.isModified('password')) return;

    const salt = randomBytes(16).toString();

    const hashPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest('hex');
    this.salt = salt;
    this.password = hashPassword;
    next();
});

userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error('user not found');

    const hashPassword = user.password;
    const salt = user.salt;

    const passwordProviderHash = createHmac('sha256', salt)
        .update(password)
        .digest('hex');

    if (hashPassword !== passwordProviderHash) throw new Error('password is incorrect');

    const token = createTokenForUser(user);
    return token;
})


const User = model('user', userSchema)

module.exports = User;