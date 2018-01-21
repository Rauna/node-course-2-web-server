const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;  //process.env is an object that stores all of our env variables as key value pairs. PORT is the property which heroku is looking for. This will not work when we run locally so we set a default port using OR operator

var app = express();
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

//app.use(express.static(__dirname + '/public'));
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  fs.appendFile('server.log', log + '\n', (err) => {
    if(err) {
      console.log('Unable to append to server.log');
    }
  });
  console.log(log);
  next();
}); /*
app.use((req, res, next) => { //This middleware will stop everything after it from executing as it does not call next to indicate that this middleware operation is complete. So the below handlers will not get called. Middleware is executed in the order we call app.use So the request handlers after this will not get executed whereas the ones above will get executed. Now if you want middleware express.static to show maintenance error too, we'll have to cut it from above and paste it down because currently the express server is responding inside of the express.static middleware so our maintenance middleware doesn't get a chance to execute
  res.render('maintenance.hbs');
}); */

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  //res.send('Hello Express');
  /*res.send({
    name: 'Andrew',
    likes: ['Biking',
  'Cycling']
})*/
res.render('home.hbs', {
  pageTitle: 'Home Page',
  welcomeMessage: 'Welcome to my website'
})
});

app.get('/about', (req, res) => {
  //res.send('About Page');
  res.render('about.hbs', {
    pageTitle: 'About Page'
  })
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects'
  })
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

app.listen(port, () => {
  //console.log('Server is up and running');
  console.log(`Server is up on port ${port}`);
});
