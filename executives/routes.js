const { Router } = require('express');
const router = Router();
const executiveServices = require('./services');

const sendExecutive = (res, executive, errorMessage) => {
    if(executive){
        // send executive token as a cookie
        res.cookie('token', executive.token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'none'
        });
        delete executive.token;
        res.json(executive);
    }else{
        res.status(400).json({
            message: errorMessage
        });
    };
}

const authenticate = (req, res, next) => {
    executiveServices.authenticate(req.body).then(executive => {
        sendExecutive(res, executive, 'username or password is incorrect');
    }).catch(err => next(err));
};

const register = (req, res, next) => {
    executiveServices.create(req.body).then(executive => {
        sendExecutive(res, executive, 'Error while creating the account');
    }).catch(err => next(err));
};


// routes
router.post('/authenticate', authenticate);
router.post('/register', register);

module.exports = router;