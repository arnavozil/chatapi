const { Types } = require('mongoose');

const oid = id => Types.ObjectId(id);

module.exports = {
    oid
};