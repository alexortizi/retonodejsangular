const express = require('express');
const app = express();

const  bodyParser = require('body-parser');
 
const db = require('./config/db.config.js');
  
// force: true will drop the table if it already exists
db.sequelize.sync({force: false}).then(() => {
  console.log('Tablas Creadas');
}); 

global.__basedir = __dirname;   

let personasRouter = require('./routes/personasRoutes.js');
let csvRouter = require('./routes/csvRoutes.js');
let userRouter = require('./routes/userRoutes.js');
app.use(express.static('resources'));
 const cors = require('cors')
const corsOptions = {
   origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
}
 app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());
app.use('/', personasRouter);
app.use('/csv', csvRouter);
app.use('/user', userRouter);

// Create a Server
const server = app.listen(3000, function () {
 
  let host = server.address().address
  let port = server.address().port
 
  console.log("App listening at ", host, port); 
})