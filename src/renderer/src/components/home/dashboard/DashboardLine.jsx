import React from 'react'
import { Line } from 'react-chartjs-2'
import { convertAndSum } from "../../../functions/price"
import "../../../functions/chartSetup"

export const DashboardLine = ({
  tours = [],
  primaryCurrency,
  exchange_rate_selling,
  exchange_rate_buying,
  from,
  to
}) => {
  // Normalize helper → remove minutes/seconds
  const normalize = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const fromDate = normalize(new Date(from));
  const toDate = normalize(new Date(to));

  // Range in days
  const diffDays = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24));

  let labels = [];
  let buckets = {};

  if (diffDays > 365 * 2) {
    // Group by year
    for (let y = fromDate.getFullYear(); y <= toDate.getFullYear(); y++) {
      labels.push(y.toString());
      buckets[y] = { revenue: 0, expenses: 0, profit: 0 };
    }
  } else if (diffDays > 60) {
    // Group by month
    let d = new Date(fromDate);
    while (d <= toDate) {
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      labels.push(key);
      buckets[key] = { revenue: 0, expenses: 0, profit: 0 };
      d.setMonth(d.getMonth() + 1);
    }
  } else if (diffDays > 2) {
    // Group by day
    let d = new Date(fromDate);
    while (d <= toDate) {
      const key = d.toISOString().split("T")[0]; // yyyy-mm-dd
      labels.push(key);
      buckets[key] = { revenue: 0, expenses: 0, profit: 0 };
      d.setDate(d.getDate() + 1);
    }
  } else {
    // Group by hour
    let d = new Date(fromDate);
    while (d <= toDate) {
      for (let h = 0; h < 24; h++) {
        const key = `${d.toISOString().split("T")[0]} ${h}:00`;
        labels.push(key);
        buckets[key] = { revenue: 0, expenses: 0, profit: 0 };
      }
      d.setDate(d.getDate() + 1);
    }
  }

  // Assign each tour to the right bucket
  tours.forEach(t => {
    const depDate = new Date(t.departure_date);
    const retDate = new Date(t.return_date);

    let chosenDate = null;

    const depValid = depDate >= fromDate && depDate <= toDate;
    const retValid = retDate >= fromDate && retDate <= toDate;

    if (depValid) {
      chosenDate = depDate;
    } else if (!depValid && retValid) {
      chosenDate = retDate;
    }

    if (!chosenDate) return;

    let key;
    if (diffDays > 365 * 2) {
      key = chosenDate.getFullYear().toString();
    } else if (diffDays > 60) {
      key = `${chosenDate.getFullYear()}-${chosenDate.getMonth() + 1}`;
    } else if (diffDays > 2) {
      key = chosenDate.toISOString().split("T")[0];
    } else {
      const base = chosenDate.toISOString().split("T")[0];
      key = `${base} ${chosenDate.getHours()}:00`;
    }

    if (buckets[key]) {
      // Handle canceled tours with include flags
      const revenue =
        (t.state !== "Canceled" || t.canceled_revenue === 1)
          ? convertAndSum(
              [{ value: t.revenue, currency: t.revenue_currency }],
              primaryCurrency,
              exchange_rate_selling,
              exchange_rate_buying
            ).value
          : 0;

      const expenses =
        (t.state !== "Canceled" || t.canceled_expenses === 1)
          ? convertAndSum(
              [{ value: t.expenses, currency: t.expenses_currency }],
              primaryCurrency,
              exchange_rate_selling,
              exchange_rate_buying
            ).value
          : 0;

      buckets[key].revenue += revenue;
      buckets[key].expenses += expenses;
      buckets[key].profit += (revenue - expenses);
    }
  });

  const revenueData = labels.map(l => buckets[l].revenue);
  const expensesData = labels.map(l => buckets[l].expenses);
  const profitData = labels.map(l => buckets[l].profit);

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        marginTop: "20px",
        backgroundColor: "white",
        height: "250px",
        width: "100%",
        padding: "10px",
      }}
    >
      <Line
        data={{
          labels,
          datasets: [
            {
              label: "Profit",
              data: profitData,
              borderColor: "#4fbe7f",
              backgroundColor: "#4fbe7f",
              fill: false,
              tension: 0.1,
            },
            {
              label: "Revenue",
              data: revenueData,
              borderColor: "#1e9eff",
              backgroundColor: "#1e9eff",
              fill: false,
              tension: 0.1,
            },
            {
              label: "Expenses",
              data: expensesData,
              borderColor: "#ea4863",
              backgroundColor: "#ea4863",
              fill: false,
              tension: 0.1,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { font: { family: "Alexandria, sans-serif" } },
            },
          },
          scales: {
            x: { ticks: { font: { family: "Alexandria, sans-serif" } } },
            y: { ticks: { font: { family: "Alexandria, sans-serif" } } },
          },
        }}
      />
    </div>
  );
};
