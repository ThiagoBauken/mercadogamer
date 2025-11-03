/**
 * funcion para hacer llamados del middleware remove en cascada
 * y borrar todos los subdocumentos
 *
 * @param {MongooseSchema} model - modelo a borrar
 * @param {Object} condition - condicion de mongoose find(condition)
 */
export const findManyAndPreRemove = (model, condition = {}) => {
  model
    .find(condition)
    .then((data) => {
      if (data) {
        data.forEach((el) => {
          el.remove();
        });
      }
    })
    .catch((err) => {
      debug('err on findManyAndPreRemove', err);
    });
};
