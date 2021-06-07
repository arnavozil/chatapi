const errorHandler = (err, req, res, next) => {

    if(typeof err === 'string'){
        //custom application error
        return res.status(400).json({
            message: err
        });
    }else if(err.name === 'ValidationError'){
        //mongoose error
        return res.status(400).json({
            message: err.message
        });
    }else if(err.name === 'UnautorizedError'){
        //trying to access authenticated route without token
        return res.status(400).json({
            message: 'Invalid Token'
        });
    }

    // default to 500 server error
    return res.status(500).json({
        message: err.message
    });
};

module.exports = errorHandler;