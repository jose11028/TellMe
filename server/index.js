const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/dev');
const Tmer = require('./models/tmer');
const FakeDb = require('./fake-db');

//routes
const tmerRoutes = require('./routes/tmers'),
  userRoutes = require('./routes/users'),
  bookingRoutes = require('./routes/bookings');

mongoose.connect(config.DB_URI).then(async () => {


 /*  Within this code block, a new instance of the
  FakeDb class is created using const fakeDb = new FakeDb();.
  This instance is created to utilize the methods of the FakeDb class.*/
  const fakeDb = new FakeDb();

  // the function seedDb calls teh function pushTmersToDb()
  //await fakeDb.seedDb();
});


//old route
/* app.get('/tmers', function(req, res) {
  res.json({'success': true})
}); */

const app = express();
//using midelware body-parser
app.use(bodyParser.json());



// Add this line to serve static files from the 'assets' directory
app.use('/assets', express.static('D:/angular/Rental/app2023-10-17New/tm2-app/src/assets'));


//Register the routes
app.use('/api/v1/tmers', tmerRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/bookings', bookingRoutes);

//process.env is an object in Node.js that contains the user environment.
// In this case, process.env.PORT is attempting to retrieve the value of the PORT
const PORT = process.env.PORT || 3001;

app.listen(PORT, function() {
  console.log('App is running');
});
