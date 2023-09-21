const mongoose = require('mongoose');

const estateSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	location: {
		type: String,
		required: true,
	},
	price: {
		type: String,
		required: true,
	},
	sqm: {
		type: String,
		required: true,
	},
	images: [{ type: String, required: true }],
	phone: {
		type: String,
		required: true,
	},
	area: {
		type: String,
		required: true,
	},
	floor: {
		type: String,
		required: true,
	},
	construction: {
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
	realtor: {
		type: String,
		required: true,
	},
	realtorLogo: {
		type: String,
		required: true,
	},
	realtorAddress: {
		type: String,
		required: true,
	},
});

const Estate = mongoose.model('Estate', estateSchema);
module.exports = Estate;
