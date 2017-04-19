const { collectPocketItems } = require('./lib/pocketProcess');
const { saveDocToMongo } = require('./lib/dbStore');
const { sendMail } = require('./helper/mailSender');

Promise.resolve()
  .then(collectPocketItems)
  .then(items => items.length ? saveDocToMongo(items) : 'no items added yesterday')
  .catch((error) => {
    console.log(error);
    sendMail({ subject: 'Alert! collector failed!', body: JSON.stringify(error) });
  })
  .then(console.log, console.log);
