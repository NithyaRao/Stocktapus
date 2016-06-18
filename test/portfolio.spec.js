const expect = require('chai').expect;
const Portfolio = require('../lib/portfolio');
const Stock = require('../lib/stock');
const nock = require('nock');

describe('Portfolio', () => {
  beforeEach(() => {
    nock('http://dev.markitondemand.com')
    .get('/MODApis/Api/v2/Quote/json?symbol=AAPL')
    .reply(200, {
      Name: 'Apple',
      LastPrice: 100,
    });
  });
  describe('constructor', () => {
    it('should construct a new Portfolio object', () => {
      const p1 = new Portfolio('Tech');
      expect(p1.name).to.equal('Tech');
    });
  });

  describe('#addStock', () => {
    it('should add a stock', () => {
      const p1 = new Portfolio('Tech');
      expect(p1.name).to.equal('Tech');
      const s1 = new Stock('AAPL');
      s1.shares = 50;
      s1.purchasePricePerShare = 100;
      expect(s1.purchasePricePerShare).to.equal(100);
      expect(s1.shares).to.equal(50);
      p1.addStock(s1);
      expect(p1.stocks.length).to.equal(1);

      const s2 = new Stock('GOOG');
      s2.shares = 10;
      s2.purchasePricePerShare = 200;
      expect(s2.purchasePricePerShare).to.equal(200);
      expect(s2.shares).to.equal(10);
      p1.addStock(s2);
      expect(p1.stocks.length).to.equal(2);
    });
  });

  describe('#position', () => {
    it('should return the portfolio position', () => {
      const p1 = new Portfolio('Tech');
      const s1 = new Stock('AAPL');
      s1.shares = 50;
      s1.purchasePricePerShare = 100;
      p1.addStock(s1);

      const s2 = new Stock('GOOG');
      s2.shares = 10;
      s2.purchasePricePerShare = 200;
      p1.addStock(s2);
      expect(p1.stocks.length).to.equal(2);
      expect(p1.position()).to.equal(7000);

      // s1.shares = 40;
      // s1.sell(10, (err, cashValue) => {
      //   expect(err).to.be.null;
      //   expect(cashValue).to.be.equal(4000);
      //   expect(s1.shares).to.be.equal(40);
      //   done();
      // });
      // expect(p1.position()).to.equal(6000);
    });
  });

  describe('#getStocks', () => {
    it('should return matching stocks from the portfolio', () => {
      const p1 = new Portfolio('Tech');
      const s1 = new Stock('AAPL');
      s1.shares = 50;
      s1.purchasePricePerShare = 100;
      p1.addStock(s1);

      const s2 = new Stock('AAPL');
      s2.shares = 10;
      s2.purchasePricePerShare = 200;
      p1.addStock(s2);
      expect(p1.stocks.length).to.equal(2);
      const sArray = p1.getStocks('AAPL');
      expect(sArray.length).to.equal(2);
    });
  });
});
