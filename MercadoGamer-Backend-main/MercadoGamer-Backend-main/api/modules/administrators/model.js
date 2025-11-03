'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		password: { type: String, required: true },
		roles: [{ type: String,	allowNull: false, enum: ['administrator'] }],
		username: { type: String, required: true, unique: true }

	}, { timestamps: true });

	module.schema.post('validate', function (doc) {
		const role = 'administrator';
		if (!doc.roles.includes(role)) {
			doc.roles.push(role);
		}
	});
};
