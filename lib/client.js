/* eslint-disable func-names, consistent-return */

const uuid = require('uuid');
const Stock = require('./stock');
const Portfolio = require('./portfolio');

function Client(name) {
  this.name = name;
  this.portfolios = [];
  this.account = uuid.v1();
  this.cash = 0;
}

Client.prototype.deposit = function (amount) {
  if (amount > 0) {
    this.cash += amount;
  }
};

Client.prototype.withdraw = function (amount) {
  if (amount > 0 && this.cash >= amount) {
    this.cash -= amount;
  }
};

Client.prototype.getPortfolio = function (name) {
  for (const p of this.portfolios) {
    if (p.name === name) {
      return p;
    }
  }
  return null;
};

Client.prototype.addPortfolio = function (portfolio) {
  if (!(portfolio instanceof Portfolio)) return;
  if (this.getPortfolio(portfolio.name) === null) {
    this.portfolios.push(portfolio);
  }
};

Client.prototype.purchaseStock = function (symbol, shares, pname, cb) {
  Stock.getQuote(symbol, (err, sprice) => {
    if (!err) {
      // console.log('sprice:', sprice);
      if (this.cash < (sprice * shares)) {
        cb(new Error('Not enough Cash'), sprice);
        return;
      }
      const s1 = new Stock(symbol);
      s1.purchase(shares, (err1, totalPaid) => {
        if (!err1) {
          let portfolio = this.getPortfolio(pname);
          if (portfolio === null) {
            portfolio = new Portfolio(pname);
            this.addPortfolio(portfolio);
          }
          portfolio.addStock(s1);
          this.cash -= totalPaid;
        }
        cb(err1, totalPaid);
      });
    } else {
      cb(err, sprice);
    }
  });
};

Client.prototype.sellStock = function (symbol, shares, pname, cb) {
  Stock.getQuote(symbol, (err, sprice) => {
    if (!err) {
      // console.log('sprice:', sprice);
      // Check for named portfolio
      // Check for named stock in portfolio
      // Sell all shares possible
      // Update number of stock shares
      // - Remove stock Object if no shares left
      // Calculate amount of money made
      // Increment client cash amount (deposit() functiion)
      // return totalEarned
      const portfolio = this.getPortfolio(pname);
      if (portfolio === null) {
        cb(new Error('Portfolio Does Not Exist'), sprice);
        // return;
      } else {
        const stockArray = portfolio.getStocks(symbol);
        if (stockArray.length) {
            // Return total share count for test
          cb(null, stockArray.reduce((acc, val) => acc + val.shares, 0));
            // return;
        } else {
          cb(new Error('Stock Does Not Exist in Portfolio'), sprice);
          // return;
        }
      }

  //     const s1 = new Stock(symbol);
  //     s1.purchase(shares, (err1, totalPaid) => {
  //       if (!err1) {
  //         let portfolio = this.getPortfolio(pname);
  //         if (portfolio === null) {
  //           portfolio = new Portfolio(pname);
  //           this.addPortfolio(portfolio);
  //         }
  //         portfolio.addStock(s1);
  //         this.cash -= totalPaid;
  //       }
  //       cb(err1, totalPaid);
  //     });
    } else {
      cb(err, sprice);
    }
    return;
  });
};

module.exports = Client;
