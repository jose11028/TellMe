const Booking = require('../models/booking');
const Tmer = require('../models/tmer');
const User = require('../models/user');
const Payment = require('../models/payment');
const mongoose = require('mongoose');
const moment = require('moment');
const config = require('../config');
const stripe = require('stripe')(config.STRIPE_SK);

exports.createBooking = async function (req, res) {
  const { startAt, endAt, totalPrice, guests, hours, tmer, paymentToken } = req.body;
  const user = res.locals.user;

  try {
    console.log('Starting booking creation process...');

    const booking = new Booking({ startAt, endAt, totalPrice, guests, hours });

    const foundTmer = await Tmer.findById(tmer._id)
      .populate('bookings')
      .populate('user')
      .exec();

    if (!foundTmer) {
      return res.status(404).json({ error: [{ title: 'Tmer not found!', detail: 'The requested Tmer does not exist.' }] });
    }

    if (foundTmer.user.id === user.id) {
      return res.status(422).json({ error: [{ title: 'Invalid user!', detail: 'Cannot create booking on your own listing.' }] });
    }

    if (isValidBooking(booking, foundTmer)) {
      console.log('Booking slot is available, proceeding with payment...');

      booking.user = user;
      booking.tmer = foundTmer;

      const { payment, err } = await createPayment(booking, foundTmer.user, paymentToken);

      if (payment) {
        console.log('Payment successful, saving booking...');

        booking.payment = payment._id;
        foundTmer.bookings.push(booking);

        await booking.save();
        await foundTmer.save();
        await User.updateOne({ _id: user.id }, { $push: { bookings: booking } });

        return res.json({ startAt: booking.startAt, endAt: booking.endAt, paymentId: payment._id });
      } else {
        console.error('Payment failed:', err);
        return res.status(422).send({ errors: [{ title: 'Invalid Payment!', detail: err?.message || 'Payment processing failed' }] });
      }
    } else {
      return res.status(422).send({ errors: [{ title: 'Invalid Booking!', detail: 'The chosen schedule is already taken!' }] });
    }
  } catch (err) {
    console.error('Booking creation error:', err);
    return res.status(500).send({ errors: [{ title: 'Server Error', detail: err.message }] });
  }
};

exports.getUserBookings = async function (req, res) {
  try {
    const user = res.locals.user;
    console.log(`Fetching bookings for user: ${user.id}`);
    const foundBookings = await Booking.find({ user }).populate('tmer').exec();
    return res.json(foundBookings);
  } catch (err) {
    console.error('Error fetching user bookings:', err);
    return res.status(500).json({ error: 'Validation Error', details: err.message });
  }
};

function isValidBooking(proposedBooking, tmer) {
  if (!tmer.bookings || tmer.bookings.length === 0) return true;

  return tmer.bookings.every(booking => {
    const proposedStart = moment(proposedBooking.startAt);
    const proposedEnd = moment(proposedBooking.endAt);
    const actualStart = moment(booking.startAt);
    const actualEnd = moment(booking.endAt);

    return (actualStart < proposedStart && actualEnd < proposedStart) || (proposedEnd < actualEnd && proposedEnd < actualStart);
  });
}

async function createPayment(booking, toUser, token) {
  const { user } = booking;

  try {
    console.log('Creating Stripe customer...');
    const customer = await stripe.customers.create({
      source: token.id,
      email: user.email
    });

    if (!customer) {
      console.error('Stripe customer creation failed');
      return { err: 'Stripe customer creation failed!' };
    }

    console.log(`Stripe customer created: ${customer.id}`);
    await User.updateOne({ _id: user.id }, { $set: { stripeCustomerId: customer.id } });

    console.log('Creating payment record...');
    const payment = new Payment({
      fromUser: user,
      toUser,
      fromStripeCustomerId: customer.id,
      booking,
      tokenId: token.id,
      amount: booking.totalPrice * 100 * 0.9,
      status: 'pending'
    });

    const savePayment = await payment.save();
    console.log(`Payment saved successfully with ID: ${savePayment._id}`);

    return { payment: savePayment };
  } catch (err) {
    console.error('Stripe API Error:', err);
    return { err: err.message };
  }
}

