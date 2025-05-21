// const http = require('http');
// const listener = function (request, response) {
//    // Send the HTTP header 
//    // HTTP Status: 200 : OK
//    // Content Type: text/html
//    response.writeHead(200, {'Content-Type': 'text/html'});
  
//    // Send the response body as "Hello World"
//    response.end('<h2 style="text-align: center;">Hello World</h2>');
// };

// const server = http.createServer(listener);
// server.listen(8080);

// // Console will print the message

// console.log('Server running at http://127.0.0.1:8080/');

//codes with express
// const express = require('express')
// const app = express()
// const greet = require('./grettings')

// app.get('/', (req, res) => {
//     res.send('<h2> Hello world</h2>')
// })

// // app.get('/test', (req, res) => {
// //     res.send('now we are testing')
// // })

// app.get('/greet/:name', (req, res) => {
//     const message = greet(req.params.name);
//     res.send(`<h1>${message}<h1>`)
// })

// app.listen(8080, () => {
//     console.log('Express server is running on http://127.0.0.1:8080')
// })


//using ES6

import express from 'express';
import greet from './grettings.js';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js'

const app = express();

//Middleware: parse json bodies
app.use(express.json())

//routes
app.use('/', indexRouter)
app.use('/users', usersRouter)


//error handler
app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ error: err.message || 'Internal Server Error' });
});

// app.get('/', (req, res) => {
//   res.send('<h2>Hello Ardine</h2> <p>Hope you are doing fine, do not forget to take kare of yourself today.</p> <p>you are an amazing woman</p>');
// });

// app.get('/greet/:name', (req, res) => {
//   const message = greet(req.params.name);
//   res.send(`<h1>${message}</h1>`);
// });



app.listen(8080, () => {
  console.log('Express server is running on http://127.0.0.1:8080');
});

