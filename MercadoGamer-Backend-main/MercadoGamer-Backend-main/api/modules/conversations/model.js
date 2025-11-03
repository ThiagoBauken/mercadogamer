'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		enabled: { type: Boolean, default: true },
		referenceType: { type: String, enum: ['users', 'buyer', 'seller'] },
		reference: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId },
		lastMessage: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'messages' },
		users: [{ type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'users' }],

	}, { timestamps: true });
};
