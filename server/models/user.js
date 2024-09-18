const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const userSchema = new Schema({
    username: {
        type: String,
        min: [4, 'Too short, min is 4 characters'],
        max:[32, 'Too long, max is 32 characters']
        },
     email: {
        type: String,
        min: [4, 'Too short, min is 4 characters'],
        max:[32, 'Too long, max is 32 characters'],
        unique:true,
        lowercase: true,
        required: 'Email is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
     },
     password: {
        type: String,
        min: [4, 'Too short, min is 4 characters'],
        max:[32, 'Too long, max is 32 characters'],
        required: 'Email is required'
     },
    tmers: [{ type: Schema.Types.ObjectId, ref: 'Tmer' }],
    bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }]
});


userSchema.methods.hasSamePassword = function(requestedPassword) {
    return bcrypt.compareSync(requestedPassword, this.password);
}


// the salt:
/* rounds=8 : ~40 hashes/sec
rounds=9 : ~20 hashes/sec
rounds=10: ~10 hashes/sec
rounds=11: ~5  hashes/sec
rounds=12: 2-3 hashes/sec
rounds=13: ~1 sec/hash
rounds=14: ~1.5 sec/hash
rounds=15: ~3 sec/hash
rounds=25: ~1 hour/hash
rounds=31: 2-3 days/hash */

//here we hash teh passwoord using a salt to add more dificulty to the hashing
userSchema.pre('save', function(next) {
    const user = this;
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            next();
        });
    });
});


//here, we export the model. Model name Tmer and schema
module.exports = mongoose.model('User', userSchema);
