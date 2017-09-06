const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

// 注册 hbs 所有子组件（复用组件）
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// express.static(__dirname + '/filename') is a build-in middleware
// @param __dirname 指的是最外层的 node-web-server 文件夹
// 这是一个内置的中间件，作用就是静态服务器
app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
  var now = new Date().toLocaleString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log)
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('unable to append to server.log.')
    }
  })
  next();
});

// app.use((req, res, next) => {
//   res.render('404.hbs',{
//     pageTitle: "404"
//   })
// })

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  // res.send('<h1>hello express</h1>');
  res.render('home.hbs', {
    pageTitle: "Home"
  })
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: "About",
    welcomeMessage: "oh my god, you are capiticalize"
  })
});

app.get('/bad', (req, res) => {
  res.send({
    status: 'xxx',
    error: 'cannot find what you want'
  })
});

app.listen(3000, () => {
  console.log('Open localhost:3000')
});