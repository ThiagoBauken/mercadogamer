'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		product_id: { type: String },
		code: { type: String },
	}, { timestamps: true });
};
