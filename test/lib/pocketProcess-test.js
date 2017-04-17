const { expect } = require('chai');
const sinon = require('sinon');
const request = require('request');
const processHelper = require('../../helper/processHelper');


describe('collectPocketItems', () => {
  let requestStub;
  let filterItemsByDateStub;
  let extractRequiredFieldStub;
  beforeEach(() => {
    requestStub = sinon.stub(request, 'get');
    filterItemsByDateStub = sinon.stub(processHelper, 'filterItemsByDate');
    extractRequiredFieldStub = sinon.stub(processHelper, 'extractRequiredField');
  });
  
  afterEach(() => {
    request.get.restore();
    processHelper.filterItemsByDate.restore();
    processHelper.extractRequiredField.restore();
  });
  
  
  it('should collect yesterday items', (done) => {
    filterItemsByDateStub.returns([{}, {}]);
    extractRequiredFieldStub.returns([{}, {}]);
    const { collectPocketItems } = require('../../lib/pocketProcess');
  
    const fakeResponse = {
      statusCode: 200,
      body: JSON.stringify({
        status: 1,
        complete: 1,
        list: {
          111: {
            item_id: '111',
          },
          222: {
            item_id: '222',
          },
        },
        error: null,
        search_meta: {
          search_type: 'normal',
        },
        since: 1492311814,
      }),
    };
    
    requestStub.callsArgWith(1, null, fakeResponse);
  
    collectPocketItems().then((items) => {
      expect(items.length).to.equal(2);
      done();
    }).catch(done);
  });
  
  it('should return empty array items', (done) => {
    filterItemsByDateStub.returns([]);
    const { collectPocketItems } = require('../../lib/pocketProcess');
  
    const fakeResponse = {
      statusCode: 200,
      body: JSON.stringify({
        status: 1,
        complete: 1,
        list: {},
        error: null,
        search_meta: {
          search_type: 'normal',
        },
        since: 1492311814,
      }),
    };
    
    requestStub.callsArgWith(1, null, fakeResponse);
  
    collectPocketItems().then((items) => {
      expect(items.length).to.equal(0);
      done();
    }).catch(done);
  });
  
  it('should reject the promise if response code not 200', (done) => {
    filterItemsByDateStub.returns([{}, {}]);
    extractRequiredFieldStub.returns([{}, {}]);
    const { collectPocketItems } = require('../../lib/pocketProcess');
  
    const fakeResponse = {
      statusCode: 404,
      body: 'error body',
    };
    
    requestStub.callsArgWith(1, null, fakeResponse);
  
    collectPocketItems().then(done).catch((err) => {
      expect(err.error).to.equal('error body');
      done();
    });
  });
  
  it('should reject the promise if error happend', (done) => {
    filterItemsByDateStub.returns([{}, {}]);
    extractRequiredFieldStub.returns([{}, {}]);
    const { collectPocketItems } = require('../../lib/pocketProcess');
  
    const fakeResponse = {
      statusCode: 404,
      body: 'error body',
    };
    
    requestStub.callsArgWith(1, 'error', fakeResponse);
  
    collectPocketItems().then(done).catch((err) => {
      expect(err.error).to.equal('error');
      done();
    });
  });
});
