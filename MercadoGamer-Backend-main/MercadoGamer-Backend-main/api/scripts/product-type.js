export const resetProductType = async () => {
  const productModal = global.modules.products.model;
  const products = await productModal.find({ type: 'coin' });
  let index = 0;
  for (let product of products) {
    index++;
    try {
      if (product) {
        product.type = 'moneda';
        await product.save();
      }
    } catch (error) {
      console.log(error);
    }
  }
};
