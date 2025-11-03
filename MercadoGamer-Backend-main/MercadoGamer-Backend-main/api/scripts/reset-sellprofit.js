const publicationType = {
  normal: { iva: 21, commission: 7 },
  pro: { iva: 21, commission: 10 },
  free: { iva: 0, commission: 0 },
};

export const resetSellerProfitProduct = async () => {
  try {
    const productsModel = global.modules.products.model;
    const products = await productsModel.find();
    const productCounts = products.length;
    let index = 0;
    for (let product of products) {
      const price = product.price || 0;
      index++;
      const commission =
        (price * publicationType[product.publicationType].commission) / 100;
      const iva = parseFloat(
        (publicationType[product.publicationType].iva * commission) / 100
      );
      const sellerProfit = price - (commission + iva);
      product.sellerProfit = sellerProfit;
      product.commission = commission;
      product.iva = iva;
      await product.save();
      // console.log(
      //   `Caculate product(${index}/${productCounts})=>price:${price}, commission:${commission}, iva:${iva}, sellerProfit:${sellerProfit}`
      // );
    }
  } catch (error) {
    console.log(error);
  }
};

export const resetSellerProfitOrder = async () => {
  try {
    const orderModel = global.modules.orders.model;
    const orders = await orderModel.find().populate('product');
    const orderCounts = orders.length;
    let index = 0;
    for (let order of orders) {
      const product = order.product;
      if (product) {
        order.productPrice = order.productPrice || product.price / order.toUSD;
        order.sellerProfit = product.sellerProfit / order.toUSD;
        index++;
        await order.save();
        // console.log(
        //   `Caculate order(${index}/${orderCounts})=>sellerProfit:${order.sellerProfit}`
        // );
      } else {
        // console.log(
        //   `Don't have product=>order:${order._id}, product:${order.product}`
        // );
        // await order.remove();
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const resetSellerProfit = async () => {
  await resetSellerProfitProduct();
  await resetSellerProfitOrder();
};
