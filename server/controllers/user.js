const User = require('../models/user');
const jwt = require('jsonwebtoken');
/* const config = require('../config/dev'); */
const config = require('../config');
const { async } = require('rxjs');
const { normalizeErrors } = require('../helpers/mongoose'); // Now properly imported
const mongoose = require('mongoose');


exports.getUser = async (req, res) => {
  try {
    const requestedUserId = req.params.id;
    console.log("🔍 Requested User ID:", requestedUserId);
    
    const authUser = res.locals.user;
    console.log("🔍 Authenticated User:", authUser);

    if (!mongoose.Types.ObjectId.isValid(requestedUserId)) {
      return res.status(400).json({ error: 'Invalid User ID format' });
    }

    const objectIdUserId = new mongoose.Types.ObjectId(requestedUserId);

    let foundUser;
    if (requestedUserId === authUser._id.toString()) {
      // If the user is requesting their own data, return full details except sensitive ones
      foundUser = await User.findById(objectIdUserId)
        .select('-password -stripeCustomerId ')
        .exec();
    } else {
      // If the user is requesting someone else's data, return only public details
      foundUser = await User.findById(objectIdUserId)
        .select('-password -stripeCustomerId ')
        .exec();
    }

    if (!foundUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log("✅ Found User:", foundUser);

    res.json(foundUser);
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



/* exports.getUser = async function (req, res) {
  const requestedUserId = req.params.id;
  const user = res.locals.user;

  console.log('🔍 Requested User ID:', requestedUserId);
  console.log('🔍 Authenticated User:', user);

  try {
    let foundUser;
    
    // ✅ Correct way to create ObjectId
    const objectIdUserId = mongoose.Types.ObjectId.isValid(requestedUserId)
      ? new mongoose.Types.ObjectId(requestedUserId)
      : null;

    if (!objectIdUserId) {
      return res.status(400).json({ error: 'Invalid User ID', detail: 'User ID is not a valid ObjectId' });
    }

    // ✅ Check if the authenticated user is the same as the requested user
    if (requestedUserId === user._id.toString()) {
      foundUser = await User.findById(objectIdUserId);
    } else {
      foundUser = await User.findById(objectIdUserId).select('-revenue -stripeCustomerId -password' ).exec();
    }

    if (!foundUser) {
      return res.status(404).json({ error: 'User Not Found', detail: 'Could not find user' });
    }

    return res.json(foundUser);
  } catch (err) {
    console.error('❌ Error fetching user:', err);
    return res.status(500).json({ error: 'Server Error', detail: err.message });
  }
}; */



exports.auth = async function (req, res) {
     const { email, password } = req.body; 
     
     if (!password || !email) {
        return res.status(422).json({ error: 'Data missing', detail: 'Provide email and password' });
      }
    
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(422).json({ error: 'Invalid user', detail: 'User does not exist!' });
    }

    if (user.hasSamePassword(password)) {
     
      const token = jwt.sign({
        userId: user.id,
        username: user.username
      }, config.SECRET, { expiresIn: 60 * 60 });

      return res.json(token);
    } else {
      return res.status(401).json({ error: 'Invalid password', detail: 'Password does not match!' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};



exports.register = async function(req, res) {
  const { username, email, password, passwordConfirmation } = req.body;

  /* const username = req.body.username; */

  if (!password || !email) {
    return res.status(422).json({ error: 'Data missing', detail: 'Provide email and password' });
  }

  if (password !== passwordConfirmation) {
    return res.status(422).json({ error: 'Invalid password!', detail: 'Password is not the same as confirmation!' });
  }

  try {
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(422).json({ error: 'Invalid email!', detail: 'User with this email already exists!' });
    }

    const user = new User({
      username,
      email,
      password
    });

    await user.save();
    return res.json({ registered: true });
  } catch (error) {
    return res.status(422).json({ mongoose: 'handle mongoose errors in next' });
  }
};

    exports.authMiddleware = async function(req, res, next) {
        const token = req.headers.authorization;

    
    if (token) {
        try {
          const user = parseToken(token);
          
          const foundUser = await User.findById(user.userId);
    
          if (foundUser) {
            res.locals.user = foundUser;
            next();
          } else {
            return notAuthorized(res);
          }
        } catch (error) {
          return res.status(401).json({ error: 'Not authorized!' });
        }
      } else {
        return notAuthorized(res);
      }
    };
    

    function notAuthorized(res) {
      return res.status(401).json({ error: 'Not authorized!', detail: 'You need to login!' });
    }


    function parseToken(token) {

        //token.split(' ')[1] means that we extract the Bearer from the whole token format. we only need the last info whihc is the token itself
        return jwt.verify(token.split(' ')[1], config.SECRET);
    }
