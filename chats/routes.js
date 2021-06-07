const { Router } = require('express');
const router = Router();
const chatServices = require('./services');

const initiateChat = (req, res, next) => {
    chatServices.initiateChat({...req.body}).then(chat => {
        res.json({
            message: 'Chat initiated successfully',
            ...chat
        });
    }).catch(next);
};

const joinChat = (req, res, next) => {
    chatServices.joinChat({ ...req.body }).then(id => {
        res.json({
            id,
            message: 'Chat joined successfully'
        });
    }).catch(next);
};

const feedReview = (req, res, next) => {
    chatServices.feedReview({ ...req.body }).then(() => {
        res.json({
            message: 'Review Added Successfully',
        })
    }).catch(next);
};


router.post('/create', initiateChat);
router.post('/join', joinChat);
router.post('/review', feedReview);

module.exports = router;