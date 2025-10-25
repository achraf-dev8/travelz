import React, { useState, useEffect } from "react";
import { DashboardCardsHolders } from "../../components/home/dashboard/DashboardCardsHolders";
import { DashboardDatesHolder } from "../../components/home/dashboard/DashboardDatesHolder";
import { DashboardLine } from "../../components/home/dashboard/DashboardLine";
import { ToorsSection } from "../../components/home/toors/ToorsSection";
import { HandleRequest } from "./HandleRequest";
import { apiGet } from "../../functions/api";
import { convertAndSum } from "../../functions/price";
import { useAppStore } from "../../store";

export const Dashboard = () => {
  const {agency, setPages} = useAppStore()
  const curr = new Date();

  function normalize(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  const firstDayOfMonth = normalize(new Date(curr.getFullYear(), curr.getMonth(), 1));
  const lastDayOfMonth = normalize(new Date(curr.getFullYear(), curr.getMonth() + 1, 0));

  const [activeFilters, setActiveFilters] = useState({
    " From": firstDayOfMonth,
    " To": lastDayOfMonth,
  });

  const [reqState, setReqState] = useState("loading");
  const [tours, setTours] = useState([]);

  async function fetchDashboard() {
    setReqState("loading");

    const from = formatDate(activeFilters[" From"]);
    const to = formatDate(activeFilters[" To"]);

    const res = await apiGet("/tours/dashboard", { params: { from, to, ...agency} });

    if (res.error) {
      setReqState(res.error.source);
    } else {
      setTours(res.data || []);
      setReqState("success");
    }
  }

  function formatDate(date) {
    return date.toISOString().split("T")[0];
  }

  useEffect(() => {
    fetchDashboard();
  }, [activeFilters]);

  useEffect(() => {
    setPages(['Dashboard']);
  }, []);


  // 👇 Convert & sum revenue + expenses
  const revenueAmounts = tours.map(t => ({
    value: (t.state != 'Canceled' || t.canceled_revenue == 1) ? t.revenue : 0,
    currency: t.revenue_currency,
  }));

  const expensesAmounts = tours.map(t => ({
    value: (t.state != 'Canceled' || t.canceled_expenses == 1) ? t.expenses : 0,
    currency: t.expenses_currency,
  }));

  const revenueResult = convertAndSum(revenueAmounts, agency.primary_curr, agency.exchange_rate_selling, agency.exchange_rate_buying);
  const expensesResult = convertAndSum(expensesAmounts, agency.primary_curr, agency.exchange_rate_selling, agency.exchange_rate_buying);

  return (
    <HandleRequest
      reqState={reqState}
      retry={fetchDashboard}
      layout={
        <>
          <DashboardDatesHolder
            apply={setActiveFilters}
            origActiveFilters={activeFilters}
          />

          <div style={{ height: "10px" }}></div>

          <DashboardCardsHolders
            revenue={revenueResult}
            expenses={expensesResult}
          />

          <DashboardLine 
            tours={tours} 
            primaryCurrency={agency.primary_curr} 
            exchange_rate_selling = {agency.exchange_rate_selling} exchange_rate_buying = {agency.exchange_rate_buying}
            from={activeFilters[" From"]} 
            to={activeFilters[" To"]}
          />

          <ToorsSection tours={tours} main={false} helpers={false} />
        </>
      }
    />
  );
};
