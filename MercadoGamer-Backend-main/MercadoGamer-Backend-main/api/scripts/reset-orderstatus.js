export const resetOrderStatus = async () => {
  const orderModal = global.modules.orders.model;

  const orders = await orderModal.find();

  let index = 0;
  for (let order of orders) {
    index++;
    try {
      if (order) {
        order.status = 'finished';
        await order.save();
      }
    } catch (error) {
      console.log(error);
    }
  }
};
