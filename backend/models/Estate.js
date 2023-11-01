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
		type: Number,
		required: true,
	},
	sqm: {
		type: Number,
		required: true,
	},
	images: [{ type: String, required: true }],
	phone: {
		type: String,
		required: true,
	},
	area: {
		type: Number,
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
	date: {
		type: Date,
		required: true,
	},
	views: {
		type: Number,
		required: true,
	},
});

const Estate = mongoose.model('Estate', estateSchema);
module.exports = Estate;
