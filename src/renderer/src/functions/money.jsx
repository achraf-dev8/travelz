export function getExpenses(tour) {

  const formatted = getExpensesNum(tour);
  if (formatted === null) return null
  return `${formatted} ${tour.currency || ''}`.trim();
}

export function getExpensesNum(tour) {
  const hotelExpenses = Number(tour.hotel_expenses) || 0;
  const depExpenses = Number(tour.departure_expenses) || 0;
  const retExpenses = Number(tour.departure_expenses) || 0;
  const otherExpenses = Number(tour.other_expenses) || 0;

  const total = hotelExpenses + depExpenses + retExpenses + otherExpenses;
  if (total === 0) return null;
  

  const formatted = Number(total.toFixed(2)).toString();
  return formatted
}

export function getProfit(tour) {
  const price = Number(tour.price);
  if (!price || isNaN(price)) return null;

  const formatted = Number(price.toFixed(2)).toString();
  return `${formatted} ${tour.currency || ''}`.trim();
}

export function formatNumber(num) {
    const formatted = Number(num.toFixed(2)).toString();
    return formatted
}
