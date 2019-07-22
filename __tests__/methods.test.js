
import testResource from './Modules/Hints/Resource/resource';

describe('Methods', () => {
  it('All methods are present', () => {
    const Methods = require('../src/methods').default;
    const instance = new Methods({}, {});
    const methods = ['get', 'list', 'create', 'update', 'delete', 'remoteAction'].filter(
      (meth) => typeof instance[meth] === 'function',
    );
    expect(methods.length).toBe(6);
  });

  describe('API.get', () => {
    xit('Should make a get request and update the store', (done) => {

    });
  });
  /*

  describe('API.list', () => {

    xit('', (done) => {

    });


  });

  describe('API.create', () => {

    xit('', (done) => {

    });


  });

  describe('API.update', () => {

   xit('', (done) => {

    });


  });

  describe('API.delete', () => {

    xit('', (done) => {

    });


  });

  describe('API store request tracking', () => {

    xit('', (done) => {

    });


  });
*/
});
