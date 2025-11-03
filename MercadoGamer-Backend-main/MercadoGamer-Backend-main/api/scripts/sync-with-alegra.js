import { InvoiceService } from '../helpers/createInvoice/invoice';
import { setTimeout } from 'timers/promises';

export const syncWithAlegra = async () => {
  try {
    console.log('\n\nSTARTED SYNC WITH ALEGRA\n\n');

    const invoiceService = new InvoiceService();

    const products = await global.modules.products.model.find({
      $and: [
        {
          $or: [
            {
              alegraId: { $exists: false },
            },
            {
              alegraId: null,
            },
          ],
        },
        {
          price: { $gte: 0 },
        },
      ],
    });

    for await (let product of products) {
      let created = false;

      while (!created) {
        try {
          const body = {
            name: product.name,
            price: product.price,
            type: 'service',
            unit: 'unit',
            description: product.id || product._id,
          };

          const res = await invoiceService.axios.post(
            'https://api.alegra.com/api/v1/items',
            body
          );

          await global.modules.products.model.updateOne(
            {
              _id: product.id || product._id,
            },
            {
              alegraId: res.data.id,
            }
          );

          if (Number(res.headers['X-Rate-Limit-Remaining']) < 1) {
            await setTimeout(Number(res.headers['X-Rate-Limit-Reset']) + 5000);
          }

          created = true;
        } catch (e) {
          console.error('Sync error');
          console.error(e);
          await setTimeout(5000);
        }
      }
    }

    console.log('\n\nFINISHED SYNC WITH ALEGRA\n\n');
  } catch (e) {
    console.error(e);
  }
};

async function sync2() {
  const invoiceService = new InvoiceService();

  let data = (
    await invoiceService.axios.get('https://api.alegra.com/api/v1/items')
  ).data;

  while (data.length <= 30) {
    console.log('Delete iteration');
    const str = data
      .filter((p) => p.id !== 855)
      .map((p) => String(p.id))
      .reduce((a, b) => a + ',' + b);

    await invoiceService.axios.delete(
      'https://api.alegra.com/api/v1/items?id=' + str
    );

    await setTimeout(100);

    data = undefined;

    while (!data) {
      try {
        const res = await invoiceService.axios.get(
          'https://api.alegra.com/api/v1/items'
        );
        data = res.data;
      } catch (e) {
        console.error(e);
        await setTimeout(1000);
      }
    }

    console.log(data.length);
  }
}
