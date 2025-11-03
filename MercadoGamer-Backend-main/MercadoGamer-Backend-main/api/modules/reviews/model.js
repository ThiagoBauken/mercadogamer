'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		body: { type: String },
		qualification: { type: Number },
		order: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'orders', required: true },
		qualifier: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
		qualified: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
		roleReviewed: { type: String, enum: ['user', 'seller'] }

	}, { timestamps: true });
};
