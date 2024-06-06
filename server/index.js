const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
/* const config = require('./config/dev'); */
const config = require('./config');
const Tmer = require('./models/tmer');
const FakeDb = require('./fake-db');
const path = require('path');

//routes
const tmerRoutes = require('./routes/tmers'),
  userRoutes = require('./routes/users'),
  bookingRoutes = require('./routes/bookings');

mongoose.connect(config.DB_URI).then(async () => {


  if (process.env.NODE_ENV !== 'production') {
     /*  Within this code block, a new instance of the
      FakeDb class is created using const fakeDb = new FakeDb();.
      This instance is created to utilize the methods of the FakeDb class.*/
      const fakeDb = new FakeDb();

      // the function seedDb calls teh function pushTmersToDb()
      //await fakeDb.seedDb();
  }

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

if (process.env.NODE_ENV === 'production') {
  //__dirname means server folder, '..' means go a level up and find folder dist
  const appPath = path.join(__dirname, '..', 'dist', 'tm2-app');

  app.use(express.static(appPath));


  app.get('*', function (req, res) {
    res.sendFile(path.resolve(appPath, 'index.html'));
  });
}




//process.env is an object in Node.js that contains the user environment.
// In this case, process.env.PORT is attempting to retrieve the value of the PORT
const PORT = process.env.PORT || 3001;

app.listen(PORT, function() {
  console.log('App is running');
});
