export const changeRandomAvatars = async () => {
  const userModal = global.modules.users.model;
  const users = await userModal.find({ roles: 'user' });

  let index = 0;
  for (let user of users) {
    index++;
    try {
      if (!user.picture) {
        const avatars = [
          'avatars/api_1qb2a8f5-cad6-40dc-b482-633b847890b1.webp',
          'avatars/api_2wb2a8f5-cad6-40dc-b482-633b847890ba.webp',
          'avatars/api_4eb2a8f5-cad6-40dc-b482-633b8478903c.webp',
          'avatars/api_53b2a8f5-cad6-40dc-b482-633b8478900o.webp',
          'avatars/api_4fb2a8f5-cad6-40dc-b482-633b847890p9.webp',
          'avatars/api_9rb2a8f5-cad6-40dc-b482-633b84789025.webp',
          'avatars/api_54b2a8f5-cad6-40dc-b482-633b847890dc.webp',
          'avatars/api_t6b2a8f5-cad6-40dc-b482-633b847890t4.webp',
          'avatars/api_q1b2a8f5-cad6-40dc-b482-633b847890a1.webp',
          'avatars/api_c3b2a8f5-cad6-40dc-b482-633b847890c3.webp',
          'avatars/api_g2b2a8f5-cad6-40dc-b482-633b847890g2.webp',
        ];
        var randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
        user.picture = randomAvatar;
        await user.save();
      }
    } catch (error) {
      console.log(error);
    }
  }
};
