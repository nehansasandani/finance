const express = require('express');
const dotenv = require('dotenv');
const dbConnect = require('./config/dbConfig'); 
const { registerUser } = require('./controllers/users/usersCtrl.js');
const userRoute = require('./routes/Users/userRoutes.js');
const { errprHandler, notFound } = require('./middlewares/errorMiddleware.js');
const incomeRoute = require('./routes/income/incomeRoutes.js');
const expenceRoute = require('./routes/income/expenseRoutes.js');
const PettyRoute = require('./routes/income/pettyRoutes.js');
const cors = require('cors');

const app = express();
//env
dotenv.config();


// Connect to MongoDB
dbConnect(); 

//middlewares
app.use(cors()); // Use CORS middleware
app.use(express.json());

app.get('/', (req, res) => {
    res.json({msg: 'Welcome to the Expenses Tracker API'});
})

//users routes
app.use("/api/users",userRoute);

//income routes
app.use("/api/income",incomeRoute);

//expenses routes
app.use("/api/expenses",expenceRoute);

//petty cash routes
app.use("/api/petty",PettyRoute);

//Error
app.use(notFound);
app.use(errprHandler);


//income
//expenses
module.exports = app;

