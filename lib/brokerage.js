/* eslint-disable func-names, consistent-return */

const Stock = require('./stock');
const Portfolio = require('./portfolio');

function Brokerage(name) {
  this.name = name;
  this.clients = [];
}

Brokerage.prototype.addClient = function (client) {
//  if (!( client instanceof Client)) return;

  this.clients.push(client);
};

module.exports = Brokerage;
