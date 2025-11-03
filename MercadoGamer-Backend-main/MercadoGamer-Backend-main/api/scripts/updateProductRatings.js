import { getProductPriority, getSellerPoints } from '../utils/productRating';

export async function updateProductsRatings() {
  console.log('Updating products rating');
  const users = await global.modules.users.model.find({});

  const promises = users.map(async (user) => {
    const sellerAverage = getSellerPoints(user);

    const products = await global.modules.products.model.find({
      user: user._id,
      enabled: true,
      status: 'approved',
    });

    await Promise.allSettled(
      products.map(async (product) => {
        product.priority = getProductPriority(product, sellerAverage);
        await product.save();
      })
    );
  });

  await Promise.allSettled(promises);
  console.log('Products rating updated');
}
