const mongoose = require('mongoose');

//! initial schema, more fields to be added
const estateSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	image: {
		type: String,
	},
});

const Estate = mongoose.model('Estate', estateSchema);
module.exports = Estate;
