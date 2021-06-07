const { Alert } = require("../helpers/db");
const { oid } = require("../helpers/middlewares");

const createAlert = async ({ chatTitle: title, createdAt }) => {
    if(!title) throw 'Please provide an explanation for your query';
    const alert = new Alert({ title, createdAt });
    const savedAlert = await alert.save();
    return { alert: savedAlert };
};

const getAlertById = async id => {
    const query = { $or: [
        { response: 'started' },
        { _id: oid(id) }
    ]};

    return await Alert.find(id ? query : { response: 'started' }, 
    'title createdAt');
};


module.exports = {
    createAlert,
    getAlertById
};