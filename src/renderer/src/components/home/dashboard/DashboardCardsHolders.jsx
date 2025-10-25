import React from 'react'
import { DashboardCard } from './DashboardCard'
import { calculateProfit } from '../../../functions/price'

export const DashboardCardsHolders = ({revenue, expenses}) => {
  return (
    <div gap={"20px"} style={{display : 'flex', gap : '10px'}}>
    <DashboardCard display={"Total Revenue"} value={revenue.value} curr = {revenue.currency}/>
    <DashboardCard display={"Total Expenses"} value={expenses.value} curr = {expenses.currency}/>
    <DashboardCard display={"Total Profit"} value={calculateProfit(expenses, revenue, 'DA', 145.5).value} 
    curr = {calculateProfit(expenses, revenue, 'DA', 145.5).currency}/>
    </div>
  )
}
