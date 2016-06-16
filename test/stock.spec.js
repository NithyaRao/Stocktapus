/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const Stock = require('../lib/stock');

describe('Stock', () => {
  describe('constructor', () => {
    it('should construct a new Stock object', () => {
      const s1 = new Stock('AAPL');
      expect(s1.symbol).to.equal('AAPL');
    });
  });
  describe('#purchase', () => {
    it('should purchase a stock', (done) => {
      const s1 = new Stock('aapl');
      s1.purchase(50, (err, totalPaid) => {
        expect(err).to.be.null;
        expect(totalPaid).to.be.above(0);
        expect(s1.shares).to.equal(50);
        expect(s1.name).to.have.length.above(0);
        expect(s1.purchasePricePerShare).to.be.above(0);
        done();
      });
    });
  });
  describe('#sell', () => {
    it('should allow to sell shares', (done) => {
      const s1 = new Stock('aapl');
      s1.shares = 100;
      s1.purchasePricePerShare = 75;
      s1.symbol = 'AAPL';
      s1.name = 'AAPL';
      s1.sell(50, (err, cashValue) => {
        expect(err).to.be.null;
        expect(cashValue).to.be.above(0);
        expect(s1.shares).to.be.equal(50);
        done();
      });
    });
    it('should not allow to sell shares if not enough shares are available', (done) => {
      const s1 = new Stock('aapl');
      s1.shares = 50;
      s1.purchasePricePerShare = 75;
      s1.symbol = 'AAPL';
      s1.name = 'AAPL';
      s1.sell(100, (err, cashValue) => {
        expect(err).to.be.not.null;
        expect(cashValue).to.be.undefined;
        expect(s1.shares).to.be.equal(50);
        done();
      });
    });
  });
});
