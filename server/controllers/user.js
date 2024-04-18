const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/dev');
const { async } = require('rxjs');

exports.auth = async function(req, res) {
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
      return res.status(422).json({ error: 'Invalid password', detail: 'Password does not match!' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};



exports.register = async function(req, res) {
  const { username, email, password, passwordConfirmation } = req.body;

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



