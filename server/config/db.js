const mongoose = require("mongoose");
const DATABASE_URL = process.env.DATABASE_URL;

const connectDb = async () => {
	try {
		await mongoose.connect(DATABASE_URL);

		console.log("Connection of Database: Success");
	} catch (err) {
		console.error(err);
	}
};

module.exports = connectDb;
