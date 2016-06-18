/* eslint-disable func-names, consistent-return */
const Stock = require('./stock');

function Portfolio(name) {
  this.name = name;
  this.stocks = [];
}

Portfolio.prototype.addStock = function (stock) {
  if (!(stock instanceof Stock)) return;

  this.stocks.push(stock);
};

Portfolio.prototype.position = function () {
  return this.stocks.reduce((acc, val) => acc + (val.shares * val.purchasePricePerShare), 0);
};

Portfolio.prototype.getStocks = function (symbol) {
  return this.stocks.filter(s => s.symbol === symbol);
  // console.log('Stock Array:', stockArray);
  // return stockArray;
};

module.exports = Portfolio;
