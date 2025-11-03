export const resetUserhasVisitPage = async () => {
  const userModal = global.modules.users.model;
  const users = await userModal.find({ roles: 'user' });

  let index = 0;
  for (let user of users) {
    index++;
    try {
      if (user) {
        user.hasFirstVisitVendor = false;
        await user.save();
      }
    } catch (error) {
      console.log(error);
    }
  }
};
