const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
    name: {type: String, required: true, max: 100},
    phone: {type: String, required: true, max: 100},
    website: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 100},
},{
    timestamps: true
});


// Export the model
module.exports = mongoose.model('Contacts', ContactSchema);