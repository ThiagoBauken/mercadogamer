'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		code: { type: String },
		total: { type: Number },
		available: { type: Number },
		spent: { type: Number, default: 0 },
		value: { type: Number },
		enabled: { type: Boolean, default: true },
		infinite: { type: Boolean },
		country: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'countries', required: true },
		type: { type: String, enum: ['percentage', 'cash'], required: true },

	}, { timestamps: true });
};
