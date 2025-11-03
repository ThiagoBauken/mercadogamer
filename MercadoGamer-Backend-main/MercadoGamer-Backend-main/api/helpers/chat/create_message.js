'use strict';

// Define module
module.exports = (helper) => {
  /**
   * Create conversation
   *
   * @param {Object} params - Parameters
   * @return {Promise}
   */
  return (params, model) => {
    return new Promise((resolve, reject) => {
      try {
        global.modules.messages.model
          .create(params)
          .then((data) => {
            // resolve(data);
            global.modules.conversations.model
              .findOneAndUpdate(
                { _id: data.conversation },
                { lastMessage: data._id }
              )
              .then((result) => {
                resolve(data);
              })
              .catch((error) => {
                reject(
                  helper.lib.httpError(
                    400,
                    error.message || 'Ocurrio un error inesperado'
                  )
                );
              });
          })
          .catch((error) => {
            reject(
              helper.lib.dbError(
                404,
                error.message || 'Ocurrio un error inesperado'
              )
            );
          });
      } catch (error) {
        console.error('Helper "chat.createConversation" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
