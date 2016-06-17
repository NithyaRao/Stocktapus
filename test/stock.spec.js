/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const Stock = require('../lib/stock');
const nock = require('nock');
const sinon = require('sinon');
let clock;

describe('Stock', () => {
  beforeEach(() => {
    clock = sinon.useFakeTimers();
    nock('http://dev.markitondemand.com')
    .get('/MODApis/Api/v2/Quote/json?symbol=AAPL')
    .reply(200, {
      Name: 'Apple',
      LastPrice: 100,
    });
  });

  after(() => {
    clock.restore();
    nock.restore();
  });

  describe('constructor', () => {
    it('should construct a new Stock object', () => {
      const s1 = new Stock('AAPL');
      expect(s1.symbol).to.equal('AAPL');
    });
  });
  describe('#purchase', () => {
    it('should purchase a stock', (done) => {
      const s1 = new Stock('aapl');
      clock.tick(150);
      s1.purchase(50, (err, totalPaid) => {
        expect(err).to.be.null;
        expect(totalPaid).to.equal(5000);
        expect(s1.shares).to.equal(50);
        expect(s1.purchaseDate.getTime()).to.equal(150);
        expect(s1.name).to.have.equal('Apple');
        expect(s1.purchasePricePerShare).to.equal(100);
        done();
      });
    });
  });
  describe('#sell', () => {
    it('should allow to sell shares', (done) => {
      const s1 = new Stock('aapl');
      s1.shares = 100;
      // s1.purchasePricePerShare = 75;
      s1.symbol = 'AAPL';
      // s1.name = 'AAPL';
      s1.sell(50, (err, cashValue) => {
        expect(err).to.be.null;
        expect(cashValue).to.be.equal(5000);
        expect(s1.shares).to.be.equal(50);
        done();
      });
    });
    it('should not allow to sell shares if not enough shares are available', (done) => {
      const s1 = new Stock('aapl');
      s1.shares = 50;
      // s1.purchasePricePerShare = 75;
      s1.symbol = 'AAPL';
      // s1.name = 'AAPL';
      s1.sell(100, (err) => {
        expect(err.message).to.be.equal('Not enough shares to Sell');
        expect(s1.shares).to.be.equal(50);
        done();
      });
    });
  });
});
