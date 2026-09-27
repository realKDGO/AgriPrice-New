import Decimal from "decimal.js";
export const money = (v) =>
  new Decimal(v).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
export function transportCost(base, quantity) {
  return new Decimal(quantity).gt(0)
    ? new Decimal(base)
        .mul(new Decimal(".65").plus(new Decimal(".35").mul(quantity).div(100)))
        .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
    : new Decimal(0);
}
export function calculateProfit(quantity, price, transport = 0, expenses = 0) {
  const revenue = money(new Decimal(quantity).mul(price));
  const totalExpenses = money(new Decimal(transport).plus(expenses));
  const net = money(revenue.minus(totalExpenses));
  return {
    revenue: revenue.toFixed(2),
    transport: money(transport).toFixed(2),
    expenses: money(expenses).toFixed(2),
    totalExpenses: totalExpenses.toFixed(2),
    net: net.toFixed(2),
    margin: revenue.gt(0)
      ? net.div(revenue).mul(100).toDecimalPlaces(2).toString()
      : null,
  };
}
export const priceChange = (current, previous) =>
  new Decimal(previous || 0).gt(0)
    ? new Decimal(current)
        .minus(previous)
        .div(previous)
        .mul(100)
        .toDecimalPlaces(2)
        .toString()
    : null;
export function rankMarkets(prices, quantity, expenses = 0) {
  return prices
    .map((p) => ({
      ...p,
      ...calculateProfit(
        quantity,
        p.price,
        transportCost(p.market.transportBaseCost, quantity),
        expenses,
      ),
    }))
    .sort(
      (a, b) =>
        new Decimal(b.net).cmp(a.net) ||
        a.market.name.localeCompare(b.market.name),
    );
}
