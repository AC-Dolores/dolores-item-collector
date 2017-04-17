const request = require('request');
const processHelper = require('../helper/processHelper');
const config = require('../config.json');

const collectPocketItems = () => new Promise((resolve, reject) => {
  request.get({
    uri: 'https://getpocket.com/v3/get',
    qs: {
      consumer_key: config.pocketKey || '',
      access_token: config.pocketToken || ''
    }
  }, (error, response) => {
    if (error) {
      reject({ type: 'POCKET_ISSUE', error });
    } else if (response.statusCode > 300) {
      reject({ type: 'POCKET_ISSUE', error: response.body });
    } else {
      const items = processHelper.filterItemsByDate(JSON.parse(response.body));
      const posts = items.map(item => processHelper.extractRequiredField(item));
      resolve(posts);
    }
  });
});

module.exports = {
  collectPocketItems
};
