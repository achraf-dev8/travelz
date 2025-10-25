export function convertAndSum(amounts, primaryCurrency, exchange_rate_selling, exchange_rate_buying) {
  if (!amounts || amounts.length === 0) {
    return { value: 0, currency: primaryCurrency };
  }

  // Check if all amounts are in the same currency
  const allSameCurrency = amounts.every(a => a.currency === amounts[0].currency);

  if (allSameCurrency) {
    const sum = amounts.reduce((acc, { value }) => acc + Number(value), 0);
    console.log('sum', sum)
    return {
      value: Number(sum.toFixed(2)),
      currency: amounts[0].currency, // keep their original currency
    };
  }

  // Otherwise, convert all to primaryCurrency
  const total = amounts.reduce((sum, { value, currency }) => {
  const numericValue = Number(value);
  if (currency === primaryCurrency) return sum + numericValue;
  if (currency === "€" && primaryCurrency === "DA") return sum + numericValue * exchange_rate_selling;
  if (currency === "DA" && primaryCurrency === "€") return sum + numericValue * exchange_rate_buying;
  return sum;
}, 0);

  return {
    value: Number(total.toFixed(2)),
    currency: primaryCurrency,
  };
}

export function calculateProfit(expenses, price, primaryCurrency, exchange_rate_selling, exchange_rate_buying) {
  // If both are the same currency, no need to convert
  const allSameCurrency = expenses.currency === price.currency;

  if (allSameCurrency) {
    const profit = price.value - expenses.value;
    return {
      value: Number(profit.toFixed(2)),
      currency: expenses.currency,
    };
  }

  // Convert both to primaryCurrency
  const convert = ({ value, currency }) => {
    if (currency === primaryCurrency) return value;
    if (currency === "€" && primaryCurrency === "DA") return value * exchange_rate_selling; // € → DA
    if (currency === "DA" && primaryCurrency === "€") return value * exchange_rate_buying; // DA → €
    return value; // fallback (same currency)
  };

  const convertedExpenses = convert(expenses);
  const convertedPrice = convert(price);

  const profit = convertedPrice - convertedExpenses;

  return {
    value: Number(profit.toFixed(2)),
    currency: primaryCurrency,
  };
}

export function compareSums(a, b, exchange_rate_buying) {
  // normalize everything to euros internally
  const toEuro = (price) => {
    if (price.currency === "€") return price.value;
    if (price.currency === "DA") return price.value * exchange_rate_buying; // DA → €
    throw new Error(`Unsupported currency: ${price.currency}`);
  };

  const valueA = toEuro(a);
  const valueB = toEuro(b);

  if (valueA < valueB) return -1;
  if (valueA > valueB) return 1;
  return 0;
}
