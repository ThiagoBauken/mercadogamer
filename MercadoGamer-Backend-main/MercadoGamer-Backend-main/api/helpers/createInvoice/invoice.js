const axios = require('axios');
const moment = require('moment/moment');

// user:key in base64
const token = 'YWRtaW5AbWVyY2Fkb2dhbWVyLmNvbToyZWU0NGM1ZTQ0YzA5ZTI1OTMzMA==';

class InvoiceService {
  axios = axios.create({
    headers: {
      Authorization: `Basic ${token}`,
    },
  });

  async getClient(identification) {
    try {
      console.log(
        `https://api.alegra.com/api/v1/contacts&identification=${identification}`
      );

      const res = await this.axios.get(
        `https://api.alegra.com/api/v1/contacts?identification=${identification}`
      );

      console.log(res.data);
      console.log(res.status);

      if (res.status === 200 || res.status === 201) {
        const obj = new AlegraClient();
        obj.initFromAlegra(res.data[0]);
        return obj;
      }

      throw Error('Fatal error when creating client');
    } catch (e) {
      const { response } = e;
      console.log('ERR');

      if (response.status !== 404) {
        console.error(
          `[InvoiceService] - Unexpected error when retrieving client (${response.status})`
        );
        console.error(e);
      }

      return undefined;
    }
  }

  async createClient(userData) {
    const client = new AlegraClient();
    client.initFromSitedata(userData);

    const res = await this.axios.post(
      'https://api.alegra.com/api/v1/contacts',
      client.getData()
    );

    client.initFromAlegra(res.data);

    return client;
  }

  async updateClient(alegraClient) {
    const res = await this.axios.put(
      `https://api.alegra.com/api/v1/contacts/${alegraClient.alegraId}`,
      alegraClient.getData()
    );

    const ret = new AlegraClient();
    ret.initFromAlegra(res.data);
    return ret;
  }

  async syncClient(orderBuilder) {
    const { identification } = orderBuilder;

    let orderClient = new AlegraClient();
    orderClient.initFromSitedata(orderBuilder);

    const existingClient = await this.getClient(identification);

    if (!existingClient) {
      orderClient = await this.createClient({
        ...orderBuilder,
        identificationObject: {
          type: 'DNI',
          number: identification,
        },
      });
    } else if (existingClient && existingClient.isDifferent(orderClient)) {
      orderClient.alegraId = existingClient.alegraId;
      orderClient = await this.updateClient(orderClient);
    }
  }

  async createInvoice(orderBuilder, product, order) {
    const { identification } = orderBuilder;

    console.log(identification);
    const orderClient = await this.getClient(identification);

    const date = moment().format('YYYY-MM-DD');
    const price = Number(orderBuilder.pricePaid.toFixed(2));

    const body = {
      observations: order._id,
      saleCondition: 'TRANSFER',
      saleConcept: 'SERVICES',
      startDateService: date,
      endDateService: date,
      dueDate: date,
      date: date,
      payments: [
        {
          account: {
            id: 2,
          },
          date: date,
          amount: price,
          paymentMethod: 'transfer',
        },
      ],
      client: {
        id: orderClient.alegraId,
      },
      items: [
        {
          id: product.alegraId,
          name: product.name,
          price: price,
          quantity: 1,
        },
      ],
    };

    const { data } = await this.axios.post(
      'https://api.alegra.com/api/v1/invoices',
      body
    );

    await global.modules.orders.model.updateOne(
      {
        _id: order._id || order.id,
      },
      {
        invoiceId: data.id,
      }
    );

    /*
      Disabled for now

      await this.axios.post(
        `https://api.alegra.com/api/v1/invoices/${data.id}/email`,
        {
          emails: [orderClient.email],
          sendCopyToUser: false,
          invoiceType: 'copy',
          emailMessage: {
            subject: 'Tu factura de MercadoGamer',
          },
        }
      );
    */

    console.log('\n\n\nINVOICE CREATED\n\n\n');
  }

  async createProduct(product) {
    let created = false;
    let retries = 0;

    while (!created) {
      try {
        const body = {
          name: product.name,
          price: product.price,
          type: 'service',
          unit: 'service',
          description: product._id || product.id,
        };

        const res = await this.axios.post(
          'https://api.alegra.com/api/v1/items',
          body
        );

        await global.modules.products.model.updateOne(
          {
            _id: product._id || product.id,
          },
          {
            alegraId: res.data.id,
          }
        );

        created = true;
      } catch (e) {
        if (e.response) {
          if (Number(e.response.headers['X-Rate-Limit-Remaining']) < 1) {
            await setTimeout(
              Number(e.response.headers['X-Rate-Limit-Reset']) + 5000
            );
          } else {
            if (retries > 10) {
              console.error('Alegra product creation aborted');
              return;
            }

            console.error(e);
            await setTimeout(5000);
            retries++;
          }
        } else {
          console.error(e);
        }
      }
    }
  }

  async createWithdrawInvoice(user, amount, taxId, withdrawal) {
    try {
      let client = new AlegraClient();

      client.initFromSitedata({
        ...user,
        identificationObject: {
          type: 'CUIT',
          number: taxId,
        },
      });

      const existingClient = await this.getClient(taxId);

      if (!existingClient) {
        client = await this.createClient({
          ...user,
          identificationObject: {
            type: 'CUIT',
            number: taxId,
          },
        });
      } else if (existingClient && existingClient.isDifferent(client)) {
        client.alegraId = existingClient.alegraId;
        await this.updateClient(client);
      } else {
        client = existingClient;
      }

      const date = moment().format('YYYY-MM-DD');

      const body = {
        saleCondition: 'TRANSFER',
        saleConcept: 'SERVICES',
        startDateService: date,
        endDateService: date,
        dueDate: date,
        date: date,
        payments: [
          {
            account: {
              id: 2,
            },
            date: date,
            amount: amount,
            paymentMethod: 'transfer',
          },
        ],
        client: {
          id: client.alegraId,
        },
        items: [
          {
            id: 1210,
            name: 'Retiro de balance',
            price: amount,
            quantity: 1,
          },
        ],
      };

      const { data } = await this.axios.post(
        'https://api.alegra.com/api/v1/invoices',
        body
      );

      await global.modules.withdrawals.model.updateOne(
        {
          _id: withdrawal._id || withdrawal.id,
        },
        {
          invoiceId: data.id,
        }
      );

      /*
        Disabled for now

        await this.axios.post(
        `https://api.alegra.com/api/v1/invoices/${data.id}/email`,
        {
          emails: [client.email],
          sendCopyToUser: false,
          invoiceType: 'copy',
          emailMessage: {
            subject: 'Tu factura de MercadoGamer',
          },
        }
      );
      */
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

class AlegraClient {
  alegraId;
  name;
  identificationObject;
  ivaCondition = 'FINAL_CONSUMER';
  phonePrimary;
  email;
  address;

  initFromAlegra(userData) {
    this.alegraId = userData.id;
    this.name = userData.name;
    this.email = userData.email;
    this.phonePrimary = userData.phonePrimary;
    this.address = userData.address;
    this.identificationObject = userData.identificationObject;
  }

  initFromSitedata(userData) {
    this.name = userData.firstName + ' ' + userData.lastName;
    this.email = userData.emailAddress;
    this.phonePrimary = userData.phoneNumber;
    this.address = {
      city: userData.city,
      province: userData.province,
      address: userData.address,
      postalCode: userData.postalCode,
    };
    this.identificationObject = userData.identificationObject;
  }

  getData() {
    return {
      name: this.name,
      identificationObject: this.identificationObject,
      ivaCondition: this.ivaCondition,
      phonePrimary: this.phonePrimary,
      email: this.email,
      address: this.address,
    };
  }

  isDifferent(otherClient) {
    return (
      this.name !== otherClient.name ||
      this.phonePrimary !== otherClient.phonePrimary ||
      this.email !== otherClient.email ||
      this.address.city !== otherClient.address.city ||
      this.address.province !== otherClient.address.province ||
      this.address.address !== otherClient.address.address ||
      this.address.postalCode !== otherClient.address.postalCode ||
      this.identificationObject.type !==
        otherClient.identificationObject.type ||
      this.identificationObject.number !==
        otherClient.identificationObject.number
    );
  }
}

module.exports = {
  InvoiceService,
  AlegraClient,
};
