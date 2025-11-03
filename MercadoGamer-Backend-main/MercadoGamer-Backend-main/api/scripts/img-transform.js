const sharp = require('sharp');
const fs = require('fs');

function getFileName(fileName) {
  return __dirname + '/../../adm/files/' + fileName;
}

function fileExists(name) {
  return fs.existsSync(getFileName(name));
}

async function resizePicture(oldPath, newPath) {
  await sharp(getFileName(oldPath)).webp().toFile(getFileName(newPath));

  console.log(
    '\x1b[32m[SHARP]: ',
    newPath + ' created from ' + oldPath,
    '\x1b[0m'
  );
}

async function unlinkFile(path) {
  await fs.promises.unlink(getFileName(path));
}

async function resizeObjProperty(obj, property = 'picture') {
  try {
    const prevName = obj[property];

    if (!prevName) {
      return;
    }

    const arr = prevName.split('.');

    if (!['png', 'jpg', 'jpeg'].includes(arr[1])) {
      return;
    }

    const newName = arr[0] + '.webp';

    if (!fileExists(prevName)) {
      if (fileExists(newName)) {
        console.log(
          prevName +
            ' was already created as ' +
            newName +
            ' Updating object ' +
            obj._id
        );
        obj[property] = newName;
        await obj.save();
        return;
      }

      console.log(prevName + ' does not exists. Skipping file');
      return;
    }

    await resizePicture(prevName, newName);

    if (!fileExists(newName)) {
      console.error(
        '\x1b[31m',
        'New file for ' + prevName + ' could not be created. Aborting',
        '\x1b[0m'
      );
      return;
    }

    obj[property] = newName;

    await obj.save();

    console.log(
      '\x1b[32m',
      'Object ' +
        obj._id +
        ' updated. ' +
        property +
        ' changed from ' +
        prevName +
        ' to ' +
        newName,
      '\x1b[0m'
    );

    await unlinkFile(prevName);
  } catch (e) {
    console.error('\x1b[31m', e, '\x1b[0m');
  }
}

async function executor(collectionName, f, objs) {
  try {
    console.log('\x1b[36m', collectionName + ' resize started', '\x1b[0m');

    for await (const obj of objs) {
      await f(obj);
    }

    console.log('\x1b[35m', collectionName + ' images resized', '\x1b[0m');
  } catch (e) {
    console.error('\x1b[31m', e, '\x1b[0m');
  }
}

async function resizeCountries(object) {
  if (!('flag' in object)) {
    return;
  }

  await resizeObjProperty(object, 'flag');
  await resizeObjProperty(object);
}

async function resizeUsers(object) {
  await resizeObjProperty(object, 'bannerDesktop');
  await resizeObjProperty(object, 'bannerMobile');
  await resizeObjProperty(object);
}

async function resizePlatforms(object) {
  await resizeObjProperty(object);
}

async function resizeGames(object) {
  await resizeObjProperty(object);
}

async function resizeBanners(object) {
  await resizeObjProperty(object);
}

async function resizeProducts(object) {
  await resizeObjProperty(object);
}

export async function imgTransform() {
  const arr = [
    ['countries', resizeCountries, global.modules.countries.model],
    ['products', resizeProducts, global.modules.products.model],
    ['games', resizeGames, global.modules.games.model],
    ['platforms', resizePlatforms, global.modules.platforms.model],
    ['banners', resizeBanners, global.modules.banners.model],
    ['users', resizeUsers, global.modules.users.model],
  ];

  for await (const [collectionName, f, model] of arr) {
    const objs = await model.find();
    await executor(collectionName, f, objs);
  }

  console.log('End of image transformation');
}
