const mongoose = require('mongoose');

const estateSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	sqm: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	area: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	url: {
		type: String,
		required: true,
	},
});

const Estate = mongoose.model('Estate', estateSchema);
module.exports = Estate;
