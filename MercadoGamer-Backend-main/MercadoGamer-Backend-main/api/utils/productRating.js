export function getProductPriority(product, sellerUser) {
  const sellerAverage = getSellerPoints(sellerUser);
  const publicationTypePoints = getPublicationTypePoints(product);
  const ventasPoints = getVentasPoints(product);

  return 500 * publicationTypePoints + 250 * ventasPoints + 250 * sellerAverage;
}

export function getSellerPoints(user) {
  return Math.ceil(user.sellerQualification / 5);
}

function getPublicationTypePoints(product) {
  switch (product.publicationType) {
    case 'pro':
      return 1;

    case 'normal':
      return 0.5;

    case 'free':
      return 0.1;

    default:
      throw new Error(
        'Incorrect publicationType for product id ' + product._id
      );
  }
}

function getVentasPoints(product) {
  if (product.sold >= 1000) {
    return 1;
  }

  if (product.sold >= 500) {
    return 0.8;
  }

  if (product.sold >= 300) {
    return 0.5;
  }

  if (product.sold >= 100) {
    return 0.4;
  }

  if (product.sold >= 50) {
    return 0.2;
  }

  if (product.sold >= 10) {
    return 0.1;
  }

  if (product.sold >= 1) {
    return 0.01;
  }

  return 0;
}
