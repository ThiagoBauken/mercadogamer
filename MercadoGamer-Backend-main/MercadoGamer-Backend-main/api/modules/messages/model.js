'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		body: { type: String },
		authorName: { type: String },
		read: { type: Boolean, default: false },
		author: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'users' },
		conversation: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'conversations', required: true },

	}, { timestamps: true });
};
