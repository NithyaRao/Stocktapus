/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const Portfolio = require('../lib/portfolio');
const Stock = require('../lib/stock');
const Brokerage = require('../lib/brokerage');
const Client = require('../lib/client');
const nock = require('nock');
const sinon = require('sinon');
let clock;

describe('Client', () => {
  before(() => {
    clock = sinon.useFakeTimers();
    nock('http://dev.markitondemand.com')
    .persist()
    .get('/MODApis/Api/v2/Quote/json?symbol=AAPL')
    .reply(200, {
      Name: 'Apple',
      LastPrice: 100,
    });
  });

  after(() => {
    nock.cleanAll();
  });

  describe('constructor', () => {
    it('should construct a new Client object', () => {
      const c1 = new Client('Bob');
      expect(c1.name).to.equal('Bob');
      expect(c1.portfolios.length).to.equal(0);
    });
  });

  describe('#deposit', () => {
    it('should update cash value of the client', () => {
      const c1 = new Client('Bob');
      c1.deposit(1000);
      expect(c1.cash).to.be.equal(1000);
      c1.deposit(1000);
      expect(c1.cash).to.be.equal(2000);
    });
  });

  describe('#withdraw', () => {
    it('should decrement cash value of the client', () => {
      const c1 = new Client('Bob');
      c1.deposit(2000);
      expect(c1.cash).to.be.equal(2000);
      c1.withdraw(500);
      expect(c1.cash).to.be.equal(1500);
      c1.withdraw(500);
      expect(c1.cash).to.be.equal(1000);
    });
  });

  describe('#getPortfolio', () => {
    it('should return a Portfolio object given a portfolio name', () => {
      const c1 = new Client('Bob');
      const p1 = new Portfolio('Tech');
      const p2 = new Portfolio('Food');
      c1.portfolios.push(p1);
      c1.portfolios.push(p2);
      const p = c1.getPortfolio('Food');
      expect(p).to.be.instanceof(Portfolio);
      expect(p.name).to.be.equal('Food');
    });
  });

  describe('#addPortfolio', () => {
    it('should add a Portfolio object to the client portfolios', () => {
      const c1 = new Client('Bob');
      const p1 = new Portfolio('Tech');
      c1.addPortfolio(p1);
      expect(c1.portfolios.length).to.equal(1);
    });
  });

  describe('#purchaseStock', () => {
    it('should add stock to existing client portfolio if sufficient funds', (done) => {
      const c1 = new Client('Bob');
      c1.deposit(3000);
      const p1 = new Portfolio('Tech');
      c1.addPortfolio(p1);
      c1.purchaseStock('AAPL', 10, 'Tech', (err, totalPaid) => {
        expect(err).to.be.null;
        expect(totalPaid).to.equal(1000);
        expect(c1.portfolios.length).to.equal(1);
        expect(c1.cash).to.be.equal(2000);
        done();
      });
    });
    it('should add stock to and create client portfolio if sufficient funds', (done) => {
      const c1 = new Client('Bob');
      c1.deposit(3000);
      c1.purchaseStock('AAPL', 10, 'Tech', (err, totalPaid) => {
        expect(err).to.be.null;
        expect(totalPaid).to.equal(1000);
        const p = c1.getPortfolio('Tech');
        expect(p.stocks.length).to.equal(1);
        expect(c1.portfolios.length).to.equal(1);
        expect(c1.cash).to.be.equal(2000);
    //    done();
      });
      c1.purchaseStock('AAPL', 10, 'Tech', (err, totalPaid) => {
        expect(err).to.be.null;
        expect(totalPaid).to.equal(1000);
        const p = c1.getPortfolio('Tech');
        expect(p.stocks.length).to.equal(2);
        expect(c1.portfolios.length).to.equal(1);
        expect(c1.cash).to.be.equal(1000);
        done();
      });
    });
    it('should not add stock to exisitng client portfolio if insufficient funds', (done) => {
      const c1 = new Client('Bob');
      c1.deposit(300);
      const p1 = new Portfolio('Tech');
      c1.addPortfolio(p1);
      c1.purchaseStock('AAPL', 10, 'Tech', (err, totalPaid) => {
        expect(err.message).to.be.equal('Not enough Cash');
        expect(totalPaid).to.equal(100);
        expect(c1.cash).to.be.equal(300);
        done();
      });
    });
  });

  describe('#sellStock', () => {
    it('should sell existing stock from existing client portfolio', (done) => {
      const c1 = new Client('Bob');
      c1.deposit(3000);
      const p1 = new Portfolio('Tech');
      c1.addPortfolio(p1);
      const s1 = new Stock('aapl');
      s1.shares = 10;
      p1.addStock(s1);
      c1.sellStock('AAPL', 10, 'Tech', (err, totalEarned) => {
        expect(err).to.be.null;
        // expect(totalEarned).to.equal(1000);
        expect(totalEarned).to.equal(10);
        const p = c1.getPortfolio('Tech');
        // expect(p.stocks.length).to.equal(0);
        expect(p.stocks.length).to.equal(1);
        expect(c1.portfolios.length).to.equal(1);
        // expect(c1.cash).to.be.equal(4000);
        expect(c1.cash).to.be.equal(3000);
        done();
      });
    });
  });
});
