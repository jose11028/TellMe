const Booking = require('../models/booking');
const Tmer = require('../models/tmer');
const User = require('../models/user');
const mongoose = require('mongoose');
const moment = require('moment');

exports.createBooking = async function (req, res) {
    const { startAt, endAt, totalPrice, guests, days, tmer } = req.body;
    const user = res.locals.user;

    try {
        const booking = new Booking({ startAt, endAt, totalPrice, guests, days });

        const foundTmer = await Tmer.findById(tmer._id)
            .populate('bookings')
            .populate('user')
            .exec();
        
        
        
     
        

        if (foundTmer.user.id === user.id) {
            //return res.status(422).send({ error: [{ title: 'Invalid user!', detail: 'Cannot create booking on your tellMe' }]);
            return res.status(422).send({ error: [{ title: 'Invalid user!', detail: 'Cannot create booking on your tellMe' }]});


        }


        if (isValidBooking(booking, foundTmer)) {
            booking.user = user;
            booking.tmer = foundTmer;
            foundTmer.bookings.push(booking);
            
            /* booking.save(function (err) {
                if (err) {
                    return res.status(422).send({ errors: normalizeErrors(err.errors) });
                }
                 */
            
                await booking.save();
            
                await foundTmer.save();
            // await User.update({ _id: user.id }, { $push: { bookings: booking}}, function(){});
            await User.updateOne({ _id: user.id }, { $push: { bookings: booking }});
                
                return res.json({ startAt: booking.startAt, endAt: booking.endAt });
           
            
        } else {
            return res.status(422).send({ errors: [{ title: 'Invalid Booking!', detail: 'Choosen schedule are already taken!!' }]});
        }


        // Check here for valid booking
        //return res.json({ booking, foundTmer });

    } catch (err) {
        return res.status(422).send({ errors: err.message });
    }
}

exports.getUserBookings = async function (req, res) {
    try {
        const user = res.locals.user;
        const foundBookings = await Booking.find({ user }).populate('tmer').exec();
        return res.json(foundBookings);
    } catch (err) {
        return res.status(422).json({ error: 'Validation Error', details: err.message });
    }
}

/* exports.getUserBookings = async function (req, res) {
    try {
        const user = res.locals.user;
        const foundBookings = await Booking.where({ user }).populate('tmers').exec();
        return res.json(foundBookings);
    } catch (err) {
        return res.status(422).json({ error: 'Validation Error', details: err.message });
    }
} */

/*  exports.getUserBookings = function (req, res) {
    const user = res.locals.user;
    Booking.where({ user })
        .populate('tmers')
        .exec(function (err, foundBookings) {
            if (err) {
                return res.status(422).json({ error: 'Validation Error' });
            }
            return res.json(foundBookings);
        });
} */

function isValidBooking(proposedBooking, tmer) {

    let isValid = true;

    if (tmer.bookings && tmer.bookings.length > 0) {
        isValid = tmer.bookings.every(function (booking) {
            const proposedStart = moment(proposedBooking.startAt); 
            const proposedEnd = moment(proposedBooking.endAt);

            const actualStart = moment(booking.startAt);
            const actualEnd = moment(booking.endAt);


            return ((actualStart < proposedStart && actualEnd < proposedStart) || (proposedEnd < actualEnd && proposedEnd < actualStart)) 
            //return !(actualEnd <= proposedStart || proposedEnd <= actualStart);

        });
    }

    return isValid;
        
    }









/*  const Booking = require('../models/booking');
const Tmer = require('../models/tmer');
//const { normalizeErrors } = require('../helpers/mongoose');
const mongoose = require('mongoose');

exports.createBooking =  function (req, res) {

    const { startAt, endAt, totalPrice, guests, days, tmer } = req.body;
    const user = res.locals.user;

    const booking = new Booking({ startAt, endAt, totalPrice, guests, days });
    
    Tmer.findById(tmer._id)
        .populate('bookings')
        .populate('user')
        .exec(function (err, foundTmer) {
            if (err) {
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }
              if (foundRental.user.id === user.id) {
                  return res.status(422).send({ error: [{ title: 'Invalid user!', detail: 'Cannot create booking on your tellMe' }]});
            }

            //check here for valid booking
            return res.json({ booking, foundTmer });
            
        })
    
}   */