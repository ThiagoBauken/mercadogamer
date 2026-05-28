'use strict';

/**
 * Schema reviews — agora com média ponderada (P1.8).
 *
 * Por que peso:
 *   - Review de user KYC nível 0 (não verificou CPF) tem peso 0.3 (= anti-fraude:
 *     conta nova/anônima vale menos)
 *   - Review de KYC nível 1 (CPF + SMS + email) vale 1.0 (default)
 *   - Review de KYC nível 2 (com biometria, futuro) vale 1.5
 *   - Bonus: +0.5 se o reviewer tem 5+ compras concluídas
 *   - Máximo: 2.0 (cap)
 *
 * Os campos *AtTime guardam snapshot do reviewer no momento do review — permite
 * recalcular peso historicamente se a fórmula mudar.
 */
module.exports = (module) => {
	const mongoose = global.database.mongodb.mongoose;

	module.schema = new mongoose.Schema({
		id: { type: String },
		body: { type: String },
		qualification: { type: Number, min: 1, max: 5 },
		order: { type: mongoose.Schema.Types.ObjectId, ref: 'orders', required: true },
		qualifier: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
		qualified: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
		roleReviewed: { type: String, enum: ['user', 'seller'] },
		// Peso ponderado da review (P1.8)
		weight: { type: Number, default: 1.0, min: 0, max: 2.0 },
		// Snapshot do qualifier no momento — para auditoria e recálculo
		kycLevelAtTime: { type: Number, default: 0 },
		purchaseCountAtTime: { type: Number, default: 0 },
	}, { timestamps: true });

	// Calcular peso ao criar review baseado no qualifier
	module.schema.pre('save', async function () {
		if (!this.isNew) return;
		try {
			const qualifier = await global.modules.users.model
				.findById(this.qualifier)
				.select('+kycLevel');
			if (!qualifier) return;

			const kyc = qualifier.kycLevel || 0;
			// Conta compras concluídas do qualifier (status=released ou finished)
			const purchaseCount = await global.modules.orders.model.countDocuments({
				buyer: qualifier._id,
				status: { $in: ['released', 'finished', 'paid', 'held'] },
			});

			let weight = 0.3; // default unverified
			if (kyc >= 1) weight = 1.0;
			if (kyc >= 2) weight = 1.5;
			// Bonus por experiência
			if (purchaseCount >= 5) weight += 0.5;
			weight = Math.min(weight, 2.0); // cap

			this.weight = weight;
			this.kycLevelAtTime = kyc;
			this.purchaseCountAtTime = purchaseCount;
		} catch (e) {
			console.warn('[reviews.pre-save] falha ao calcular weight:', e.message);
		}
	});

	// Após salvar, recalcular rating agregado do qualified user
	module.schema.post('save', async function () {
		try {
			const role = this.roleReviewed === 'seller' ? 'seller' : 'user';
			const reviews = await module.model.find({
				qualified: this.qualified,
				roleReviewed: role,
			});

			if (reviews.length === 0) return;

			// Média ponderada: sum(qualification * weight) / sum(weight)
			let totalWeight = 0;
			let weightedSum = 0;
			for (const r of reviews) {
				const w = r.weight || 1;
				totalWeight += w;
				weightedSum += (r.qualification || 0) * w;
			}
			const weightedAvg = totalWeight > 0 ? weightedSum / totalWeight : 0;

			const update = role === 'seller'
				? {
					sellerQualification: weightedAvg,
					sellerTotalQualifications: reviews.length,
				}
				: {
					userQualification: weightedAvg,
					userTotalQualifications: reviews.length,
				};

			await global.modules.users.model.updateOne({ _id: this.qualified }, update);
		} catch (e) {
			console.warn('[reviews.post-save] falha ao recalcular rating:', e.message);
		}
	});
};
