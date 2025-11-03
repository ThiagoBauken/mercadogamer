'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		action: { type: String, enum: ['login', 'visit'] },
		user: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'users', required: true },

	}, { timestamps: true });
};
