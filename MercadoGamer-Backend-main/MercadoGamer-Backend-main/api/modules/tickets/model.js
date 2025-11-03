'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		title: { type: String },
		body: { type: String },
		answer: { type: String },
		files: [{ type: String }],
		status: { type: String, enum: ['pending', 'finished'], default: 'pending' },
		user: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'users', required: true },

	}, { timestamps: true });
};
