const getAllEstates = (req, res) => {
	console.log('receiving all');
	res.json({ message: 'You have received all of the estates.' });
};

const getEstateById = (req, res) => {
	console.log('receiving one');
	res.json({ message: 'You have received specific info regarding an estate.' });
};

module.exports = {
	getAllEstates,
	getEstateById,
};
