'use strict';
var ObjectId = require('mongoose').Types.ObjectId;
// Define module
module.exports = (helper) => {
  /**
   * Find by id
   *
   * @param {Object} params - Parameters
   * @param {Object} model - Model
   * @return {Promise}
   */
  return (params, model) => {
    return new Promise((resolve, reject) => {
      try {
        model
          .findById(params.id, params.projection || [])
          // .find({$or: [{_id:params.id}, {user: params.id}]})
          .select(params.select || {})
          .populate(params.populates || [])
          .sort(params.sort || {})
          .then(async (data) => {
            if (data) {
              let rejectedReasons;
              if (data.status == 'rejected') {
                rejectedReasons = await global.modules.notifications.model
                  .find({ 'payload.id': new ObjectId(params.id) })
                  .select('description');
                const _data = JSON.parse(JSON.stringify(data));
                resolve({ data: { ..._data, message: rejectedReasons } });
              } else {
                resolve({ data });
              }
            } else {
              reject(helper.lib.dbError(-1001, 'No se encuentra la entidad'));
            }
          })
          .catch((error) => {
            reject(
              helper.lib.dbError(
                error.code || -1000,
                error.message || 'Ocurrio un error inesperado'
              )
            );
          });
      } catch (error) {
        console.error(error);
        console.error('Helper "databaseUtils.findById" response error');
        reject(error);
      }
    });
  };
};
