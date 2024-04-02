const mongoose = require("mongoose");

async function mongoConnect(mongoURL){
    return mongoose.connect(mongoURL)
}

module.exports = {
    mongoConnect
}


