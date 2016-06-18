/* eslint-disable func-names, consistent-return */

const request = require('request');

function Stock(symbol) {
  this.symbol = symbol.toUpperCase();
}
Stock.prototype.purchase = function (quantity, cb) {
  const uri = `http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=${this.symbol}`;
  request({ uri, json: true }, (err, rsp, body) => {
    this.purchasePricePerShare = body.LastPrice;
    this.name = body.Name;
    this.shares = quantity;
    this.purchaseDate = new Date();
    const totalPaid = this.shares * this.purchasePricePerShare;
    cb(err, totalPaid);
  });
};

Stock.prototype.sell = function (quantity, cb) {
  if (quantity > this.shares) {
    return cb(new Error('Not enough shares to Sell'));
  }
  const uri = `http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=${this.symbol}`;
  request({ uri, json: true }, (err, rsp, body) => {
    const cashValue = body.LastPrice * quantity;
    this.shares -= quantity;
    return cb(err, cashValue);
  });
};

Stock.getQuote = function (symbol, cb) {
  const uri = `http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=${symbol.toUpperCase()}`;
  request({ uri, json: true }, (err, rsp, body) => {
    cb(err, body.LastPrice);
  });
};

module.exports = Stock;
