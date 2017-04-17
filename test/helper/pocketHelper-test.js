const { expect } = require('chai');
const { filterItemsByDate, extractRequiredField } = require('../../helper/processHelper');
const moment = require('moment');

describe('pocketHelper', () => {
  describe('filterItemsByDate', () => {
    it('should extract required filed by dateSting in the result ', () => {
      const pocketItems = {
        status: 1,
        complete: 1,
        list: {
          7890345: {
            itemId: '7890345',
            time_added: '1492300800',
          },
          567878: {
            itemId: '567878',
            time_added: '1492272000',
          },
          678903: {
            itemId: '678903',
            time_added: '1492214400',
          },
        },
        error: null,
        search_meta: {
          search_type: 'normal',
        },
        since: 1492311814,
      };
      
      const expectedItems = [
        {
          itemId: '567878',
          time_added: '1492272000',
        },
        {
          itemId: '7890345',
          time_added: '1492300800',
        },
      ];
      
      const dateUtcString = '1492272000';
      expect(filterItemsByDate(pocketItems, dateUtcString)).to.deep.equal(expectedItems);
    });
    
    it('should return empty result if the result not included', () => {
      const pocketItems = {
        status: 1,
        complete: 1,
        list: {
          7890345: {
            itemId: '7890345',
            time_added: '1492300800',
          },
          567878: {
            itemId: '567878',
            time_added: '1492272000',
          },
          678903: {
            itemId: '678903',
            time_added: '1492214400',
          },
        },
        error: null,
        search_meta: {
          search_type: 'normal',
        },
        since: 1492311814,
      };
      
      const expectedItems = [];
      const dateUtcString = '1492572999';
      expect(filterItemsByDate(pocketItems, dateUtcString)).to.deep.equal(expectedItems);
    });
    it('should return empty result if the list is empty', () => {
      const pocketItems = {
        status: 1,
        complete: 1,
        list: {},
        error: null,
        search_meta: {
          search_type: 'normal',
        },
        since: 1492311814,
      };
      
      const expectedItems = [];
      const dateUtcString = '1492572999';
      expect(filterItemsByDate(pocketItems, dateUtcString)).to.deep.equal(expectedItems);
    });
    
    it('should return yesterday result from the result list', () => {
      const yesterday = moment()
        .subtract(1, 'days').startOf('day').add(2, 'hours')
        .unix();
      
      const theDayBeforYesterDay = moment().subtract(2, 'days')
                                           .startOf('day').add(2, 'hours')
                                           .unix();
      
      const pocketItems = {
        status: 1,
        complete: 1,
        list: {
          7890345: {
            itemId: '7890345',
            time_added: yesterday,
          },
          567878: {
            itemId: '567878',
            time_added: yesterday,
          },
          678903: {
            itemId: '678903',
            time_added: theDayBeforYesterDay,
          },
        },
        error: null,
        search_meta: {
          search_type: 'normal',
        },
        since: 1492311814,
      };
      
      const expectedItems = [
        {
          itemId: '567878',
          time_added: yesterday,
        },
        {
          itemId: '7890345',
          time_added: yesterday,
        },
      ];
      
      expect(filterItemsByDate(pocketItems)).to.deep.equal(expectedItems);
    });
  });
  
  describe('extractRequiredField', () => {
    const pocketItem = {
      item_id: '9672',
      resolved_id: '9672',
      given_url: 'http://www.webappers.com/',
      given_title: '',
      favorite: '0',
      status: '0',
      time_added: '1444659087',
      time_updated: '1444659095',
      time_read: '0',
      time_favorited: '0',
      sort_id: 137,
      resolved_title: '/ best free open source web resources /',
      resolved_url: 'http://www.webappers.com',
      excerpt: 'Really Good Emails said “Some people have explained to them that is like a modern-day museum, full of the emails that they probably deleted. Then our parents ask why we would keep stuff that people actively delete… which is followed with a different analogy they don’t really understand.',
      is_article: '0',
      is_index: '1',
      has_video: '1',
      has_image: '1',
      word_count: '2279',
    };
    
    it('should extract require field', () => {
      const expectedItem = {
        type: 'article',
        link: 'http://www.webappers.com',
        title: '/ best free open source web resources /',
        user: 'aaronisme',
        time: '1444659087',
        des: 'Really Good Emails said “Some people have explained to them that is like a modern-day museum, full of the emails that they probably deleted. Then our parents ask why we would keep stuff that people actively delete… which is followed with a different analogy they don’t really understand.',
      };
      expect(extractRequiredField(pocketItem).link).to.equal(expectedItem.link);
      expect(extractRequiredField(pocketItem).des).to.equal(expectedItem.des);
      expect(extractRequiredField(pocketItem).title).to.equal(expectedItem.title);
      expect(extractRequiredField(pocketItem).user).to.equal(expectedItem.user);
      expect(extractRequiredField(pocketItem).time).to.equal(expectedItem.time);
    });
    
    it('should use default field if one is missing', () => {
      const pocketMissingField = {};
      
      const expectedItem = {
        type: 'article',
        link: '',
        title: '',
        time: '',
        user: 'aaronisme',
        des: '',
      };
      expect(extractRequiredField(pocketMissingField).link).to.equal(expectedItem.link);
      expect(extractRequiredField(pocketMissingField).des).to.equal(expectedItem.des);
      expect(extractRequiredField(pocketMissingField).title).to.equal(expectedItem.title);
      expect(extractRequiredField(pocketMissingField).user).to.equal(expectedItem.user);
      expect(extractRequiredField(pocketMissingField).time).to.equal(expectedItem.time);
    });
  });
});
