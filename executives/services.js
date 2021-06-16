const { secret } = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Executive } = require('../helpers/db');

const authenticate = async ({
    username,
    password
}) => {

    const user = await Executive.findOne({ username });
    if(user && bcrypt.compareSync(password, user.hash)){
        const token = jwt.sign({ sub: user.id }, secret, { expiresIn: '7d' });
        return {
            ...user.toJSON(),
            token
        };
    };
};

const create = async params => {

    // validating user
    const existingExecutive = await Executive.findOne({ username: params.username });
    if(existingExecutive){
        throw `username ${params.username} is already taken`;
    };
    
    const user = new Executive(params);

    // hashing password
    if(params.password){
        user.hash = bcrypt.hashSync(params.password, 10);
    };

    // saving user
    await user.save();

    // logging in user right away
    return await authenticate({
        username: params.username, 
        password: params.password
    });
};

const findFreeExecutives = async () => await Executive.find({ status: 'online' })

const updateExecutive = async ({ name, newPassword, id }) => {
    const update = {};
    if(name) update.name = name;
    if(newPassword) update.hash = bcrypt.hashSync(newPassword, 10);

    return await Executive.findByIdAndUpdate(id, {
        $set: update
    });
}

module.exports = {
    authenticate,
    create, updateExecutive,
    findFreeExecutives
};