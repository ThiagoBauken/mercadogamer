'use strict';

// Define module
module.exports = (helper) => {
  /**
   * Find
   *
   * @param {Object} params - Parameters
   * @param {Object} model - Model
   * @return {Promise}
   */
  return (params, model) => {
    return new Promise((resolve, reject) => {
      try {
        let itemsPerPage =
          parseInt(params.perPage) ?? helper.settings.database.itemsPerPage;
        let page = 0;
        if (params.page && params.page > 0) {
          page = parseInt(params.page) - 1;
        } else {
          itemsPerPage = 0;
        }
        if (params.user.user) {
          params.query.user = params.user.user;
        }
        model
          .find(params.query || {}, params.projection || [])
          .select(params.select || {})
          .populate(params.populates || [])
          .sort(params.sort || {})
          .limit(itemsPerPage)
          .skip(itemsPerPage * page)
          .then(async (data) => {
            const count = await model.count(params.query);
            const collectionName = model.collection.collectionName;
            if (collectionName == 'products') {
              const Total = await model.find(params.query);
              const prices = Total.map((item) => item.price);
              const maxPrice = Math.max(...prices);
              const result = {
                data: data,
                count: count,
                page: page + 1,
                pages: itemsPerPage == 0 ? 1 : Math.ceil(count / itemsPerPage),
                itemsPerPage: itemsPerPage == 0 ? count : itemsPerPage,
                maxPrice: maxPrice,
              };
              resolve(result);
            }

            const result = {
              data: data,
              count: count,
              page: page + 1,
              pages: itemsPerPage == 0 ? 1 : Math.ceil(count / itemsPerPage),
              itemsPerPage: itemsPerPage == 0 ? count : itemsPerPage,
            };
            resolve(result);
          })
          .catch((error) => {
            console.log(error);
            reject(
              helper.lib.dbError(
                error.code || -1000,
                error.message || 'Ocurrio un error inesperado'
              )
            );
          });
      } catch (error) {
        console.error('Helper "databaseUtils.find" response error');
        reject(error);
      }
    });
  };
};
