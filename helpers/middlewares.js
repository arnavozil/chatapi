const bcrypt = require('bcryptjs');
const { Types } = require('mongoose');
const { Executive } = require('./db');

const oid = id => Types.ObjectId(id);

const validateChanges = async (req, _, next) => {
    try {
        const { name, id, password, newPassword } = req.body;
        if(!password) throw('Please fill in your old password to make any change.');
        const user = await Executive.findById(id);
        if(!user) throw('Please login to update your settings');
        if(!bcrypt.compareSync(password, user.hash)) throw('The password you entered is incorrect.');
        if(!name && !newPassword) throw('Please update either name or password');
        if(name.length > 22) throw('Name cannot be greater than 22 words');
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    oid, validateChanges
};