//*Import middlewares and models 
const generateAuthToken =  require('./middlewares/generateAuthToken');
const requireAuth = require('./middlewares/requireAuth');
const User =  require('./models/User');

//* Dependencies
const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

const dbUrl = "mongodb+srv://falestio:CmPK7yuFbCSjvqrf@cluster0.4k8vi.mongodb.net/pojokoding?retryWrites=true&w=majority"

const options = {
  keepAlive: true,
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(dbUrl, options)
    .then(() => {
        console.log('Connected to database!');
    })
    .catch((e) => {
        console.log('Connection failed!', e);
    });


app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan('dev'));

app.use((req, res, next) => {
    // Get auth token from the cookies
    const authToken = req.cookies['AuthToken'];

    // Inject the user to the request
    req.user = authTokens[authToken];

    next();
});

app.get("/users", (req, res) => {
    res.send(User);
})

app.post('/api/v1/register', (req, res) => {
    const { email, firstName, lastName, password, confirmPassword } = req.body;

    // Check if the password and confirm password fields match
    if (password === confirmPassword) {

        // Check if user with the same email is also registered
        if (users.find(user => user.email === email)) {

            res.send({
                message: 'User already registered.',
                messageClass: 'alert-danger'
            });

            return;
        }

        const hashedPassword = getHashedPassword(password);

        // Store user into the database if you are using one
        users.push({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        // If registration is successful, send a success message and set registered state to true
        res.send({
            registered: true,
            message: 'Registration Complete. Please login to continue.',
            messageClass: 'alert-success'
        });
    } else {
        res.send({
            registered: false,
            message: 'Password does not match.',
            messageClass: 'alert-danger'
        });
    }
});

const authTokens = {};

app.post('/api/v1/login', (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = getHashedPassword(password);

    // Check if user is registered and if the password matches in the database
    const user = users.find(u => {
        return u.email === email && hashedPassword === u.password
    });

    if (user) {
        const authToken = generateAuthToken();

        // Store authentication tokens as the key and the corresponding user as the value
        authTokens[authToken] = user;

        // Setting the auth token in cookies
        res.cookie('AuthToken', authToken);

    } else {
        res.send({
            message: 'Invalid username or password',
            messageClass: 'alert-danger'
        });
    }
});

app.get('/protected', requireAuth ,(req, res) => {
    res.send({
        message: 'You are logged in'
    });
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

