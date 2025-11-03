'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
    sectionId: { type: String, enum: ['tendencia', 'skin', 'juego'], required: true },
    product: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
    orderId: { type: Number, required: true }
	}, { timestamps: true });
};
