const moment = require('moment');

const yesterdayStartTime = moment().subtract(1, 'days').startOf('day').unix();

const filterItemsByDate = (pocketResp, dateString = yesterdayStartTime) => {
  const list = pocketResp.list;
  return Object.values(list).filter(item => item.time_added >= dateString);
};

const extractRequiredField = (pocketItem) => {
  const requireMap = {
    link: 'resolved_url',
    title: 'resolved_title',
    des: 'excerpt',
    time: 'time_added',
  };

  const result = {
    type: 'article',
    user: 'aaronisme',
    updatedTime: moment().unix(),
  };

  Object.keys(requireMap).forEach((key) => {
    const field = {};
    field[key] = pocketItem[requireMap[key]] || '';
    Object.assign(result, field);
  });

  return result;
};

module.exports = {
  filterItemsByDate,
  extractRequiredField,
};
