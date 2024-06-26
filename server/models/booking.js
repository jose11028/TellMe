const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const bookingSchema = new Schema({
    startAt: { type: Date, required: 'Starting date is required' },
    endAt: { type: Date, required: 'Ending date is required' },
    totalPrice: Number,
    days: Number,
    guests: Number,
    createdAt: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    tmer: { type:Schema.Types.ObjectId, ref: 'Tmer'}
});


//hereb we export the model. Model name Tmer and schema
module.exports = mongoose.model('Booking', bookingSchema);
