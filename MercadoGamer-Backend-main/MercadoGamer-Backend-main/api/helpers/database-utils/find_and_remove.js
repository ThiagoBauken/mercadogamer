"use strict";

// Define module
module.exports = (helper) => {
  /**
   * Select
   *
   * @param {Object} query - Query
   * @param {Object} model - Model
   * @return {Promise}
   */
  return (query, model) => {
    return new Promise((resolve, reject) => {
      try {
        model.find(query).then((data) => {
          if (data)
            data.forEach((el) => {
              el.remove();
            });
          resolve(data);
        });
      } catch (error) {
        console.error('Helper "databaseUtils.find_and_remove" response error');
        reject(error);
      }
    });
  };
};
