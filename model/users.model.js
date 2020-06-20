const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {type: String, required: true, max: 100, unique: true},
    password: {type: String, required: true, max: 100},
    name: {type: String, required: true, max: 100},
    contacts: [{ type: Schema.Types.ObjectId, ref: 'Contacts' }],
},{
    timestamps: true
});


// Export the model
const Users = mongoose.model('Users', UserSchema);
module.exports = Users;