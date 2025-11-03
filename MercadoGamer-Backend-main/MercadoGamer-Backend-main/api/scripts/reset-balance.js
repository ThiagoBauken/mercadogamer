export const resetUserBalance = async () => {
  const userModal = global.modules.users.model;
  const orderModal = global.modules.orders.model;
  const withdrawalModal = global.modules.withdrawals.model;

  await orderModal.updateMany(
    { status: { $ne: 'finished' }, withdrawal: { $ne: null } },
    { withdrawal: null }
  );

  try {
    const withdrawals = await withdrawalModal.find();
    let index = 0;
    for (let withdrawal of withdrawals) {
      index++;
      const orders = await orderModal.find({ withdrawal: withdrawal._id });
      let balance = 0;
      orders.forEach((order) => {
        balance += order.sellerProfit;
        if (order.firstSale) balance += 1000;
      });
      withdrawal.amount = balance;
      // console.log(
      //   `Caculate withdrawal:${withdrawal._id}(${index}/${withdrawals.length})=>amount:${withdrawal.amount}`
      // );
      await withdrawal.save();
    }
  } catch (error) {
    console.log(error);
  }

  const users = await userModal.find({ roles: 'user' });
  let index = 0;
  for (let user of users) {
    index++;
    try {
      if (user) {
        const orders = await global.modules.orders.model.find({
          seller: user._id,
          status: 'finished',
          withdrawal: null,
        });
        let balance = 0;
        orders.forEach((order) => {
          balance += order.sellerProfit;
          if (order.firstSale) balance += 1000;
        });
        user.balance = balance;
        // console.log(
        //   `Caculate user balance(${index}/${user.username})=>balance:${balance}`
        // );
        await user.save();
      }
    } catch (error) {
      console.log(error);
    }
  }
};
