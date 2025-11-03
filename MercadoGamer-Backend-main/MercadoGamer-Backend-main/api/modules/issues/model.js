'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		motive: { type: String, enum: ['mistake', 'undelivered', 'notWorking'], required: true },
		status: { type: String, enum: ['pending', 'solved'], default: 'pending' },
		description: { type: String },
		order: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'orders', required: true },
		user: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'users', required: true }

	}, { timestamps: true });
};
