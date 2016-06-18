/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const Portfolio = require('../lib/portfolio');
const Stock = require('../lib/stock');
const Brokerage = require('../lib/brokerage');
const nock = require('nock');

describe('Brokerage', () => {
  beforeEach(() => {
    nock('http://dev.markitondemand.com')
    .get('/MODApis/Api/v2/Quote/json?symbol=AAPL')
    .reply(200, {
      Name: 'Apple',
      LastPrice: 100,
    });
  });

  describe('constructor', () => {
    it('should construct a new Brokerage object', () => {
      const b1 = new Brokerage('ETrade');
      expect(b1.name).to.equal('ETrade');
      expect(b1.clients.length).to.equal(0);
    });
  });

  describe('#addClient', () => {
    it('should add a client to brokerage', () => {
      const b1 = new Brokerage('ETrade');
      expect(b1.name).to.equal('ETrade');

      // const c1 = new Client('Bob');
      const c1 = { name: 'Bob', account: 12345, portfolios: [], cash: 1000 };
      b1.addClient(c1);
      expect(b1.clients.length).to.equal(1);

      const c2 = { name: 'Joe', account: 12346, portfolios: [], cash: 500 };
      b1.addClient(c2);
      expect(b1.clients.length).to.equal(2);
    });
  });

  // describe('#position', () => {
  //   it('should return Brokerage Cash Value', () => {
  //     const b1 = new Brokerage('ETrade');
  //       // const c1 = new Client('Bob');
  //
  //     const p1 = new Portfolio('Tech');
  //     const s1 = new Stock('AAPL');
  //     const s2 = new Stock('GOOG');
  //     p1.addStock(s1);
  //     p1.addStock(s2);
  //     const c1 = { name: 'Bob', account: 12345, portfolios: [], cash: 1000 };
  //     c1.portfolios.push(p1);
  //
  //     b1.addClient(c1);
  //
  //     const c2 = { name: 'Joe', account: 12346, portfolios: [], cash: 500 };
  //     c2.portfolios.push(p1);
  //     b1.addClient(c2);
  //     expect(b1.clients.length).to.equal(2);
  //
  //   });
  // });
});
