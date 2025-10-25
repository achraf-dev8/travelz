import React, { useState, useEffect } from "react";
import {
  faDollarSign,
  faExchange,
  faPlaneSlash,
  faKaaba,
} from "@fortawesome/free-solid-svg-icons";
import { SettingsInfoItem } from "../../../components/settings/SettingsInfoItem";
import { setPriceCurr } from "../../../functions/filters";
import { FilterCard } from "../../../components/home/filters/FilterCard";
import { InputElement } from "../../../components/inputs/InputElement";
import { ConfirmButton } from "../../../components/home/add/ConfirmButton";
import { apiPut } from "../../../functions/api";
import { useAppStore } from "../../../store";

export const Settings = ({ setReqState }) => {
  const { agency, setAgency } = useAppStore();

  const [tempAgency, setTempAgency] = useState(agency);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    // Sync tempAgency if global agency changes
    setTempAgency(agency);
  }, [agency]);

  // 🔹 Currency
  const setCurrency = (currency) =>
    setTempAgency((prev) => ({ ...prev, primary_curr: currency }));

  // 🔹 Exchange Rates
  const setExchangeRateSelling = (e) =>
    setTempAgency((prev) => ({
      ...prev,
      exchange_rate_selling: e.target.value,
    }));

  const setExchangeRateBuying = (e) =>
    setTempAgency((prev) => ({
      ...prev,
      exchange_rate_buying: e.target.value,
    }));

  // 🔹 Canceled Toggles
  const toggleCanceledRevenue = () =>
    setTempAgency((prev) => ({
      ...prev,
      include_canceled_revenue: !prev.include_canceled_revenue,
    }));

  const toggleCanceledExpenses = () =>
    setTempAgency((prev) => ({
      ...prev,
      include_canceled_expenses: !prev.include_canceled_expenses,
    }));

  // 🔹 Umrah Location
  const setUmrahLocation = (e) =>
    setTempAgency((prev) => ({
      ...prev,
      umrah_location: e.target.value,
    }));

  // 🔹 Save All
  async function confirmAll() {
    setConfirming(true);
    const res = await apiPut("/settings/update_settings", {
      ...tempAgency,
      include_canceled_revenue: tempAgency.include_canceled_revenue ? 1 : 0,
      include_canceled_expenses: tempAgency.include_canceled_expenses ? 1 : 0,
    });
    
    if (!res.error) {
      setAgency(tempAgency); // ✅ Update Zustand store globally
    } else {
      setReqState(res.error.source);
    }
    setConfirming(false);
  }

  // 🔹 Compare agency and tempAgency
  function checkSame() {
    const keys = [
      "primary_curr",
      "exchange_rate_selling",
      "exchange_rate_buying",
      "include_canceled_revenue",
      "include_canceled_expenses",
      "umrah_location",
    ];
    return keys.every((k) => agency[k] === tempAgency[k]);
  }

  return (
    <div>
      {/* 💵 Primary Currency */}
      <SettingsInfoItem
        widget={
          <FilterCard
            dialog={true}
            price={true}
            title="empty"
            active={tempAgency.primary_curr}
            items={["DA", "€"]}
            setFilterEvent={(titles, names, ref) =>
              setPriceCurr(names[0], setCurrency, ref)
            }
          />
        }
        icon={faDollarSign}
        display={"Primary Currency"}
        flex={1}
      />

      {/* 💶 Exchange Rate (Selling) */}
      <SettingsInfoItem
        widget={
          <div style={{ display: "flex", alignItems: "center" }}>
            <p>1 € = </p>
            <InputElement
              name={"exchange_rate_selling"}
              type="number"
              onChange={setExchangeRateSelling}
              value={tempAgency.exchange_rate_selling}
              realStyle={{ maxWidth: "150px", margin: "0 5px" }}
            />
            <p>DA</p>
          </div>
        }
        icon={faExchange}
        display={"Exchange Rate (Selling)"}
        flex={1}
      />

      {/* 💱 Exchange Rate (Buying) */}
      <SettingsInfoItem
        widget={
          <div style={{ display: "flex", alignItems: "center" }}>
            <p>1 DA = </p>
            <InputElement
              name={"exchange_rate_buying"}
              type="number"
              onChange={setExchangeRateBuying}
              value={tempAgency.exchange_rate_buying}
              realStyle={{ maxWidth: "150px", margin: "0 5px" }}
            />
            <p>€</p>
          </div>
        }
        icon={faExchange}
        display={"Exchange Rate (Buying)"}
        flex={1}
      />

      {/* 🚫 Default Cancelation */}
      <SettingsInfoItem
        widget={
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <input
                type="checkbox"
                checked={tempAgency.include_canceled_revenue}
                onChange={toggleCanceledRevenue}
              />
              <span>Include Canceled Revenue</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <input
                type="checkbox"
                checked={tempAgency.include_canceled_expenses}
                onChange={toggleCanceledExpenses}
              />
              <span>Include Canceled Expenses</span>
            </label>
          </div>
        }
        icon={faPlaneSlash}
        display={"Default Cancelation"}
        flex={1}
      />

      {/* 🕋 Umrah Location */}
      <SettingsInfoItem
        widget={
          <InputElement
            name={"umrah_location"}
            type="text"
            value={tempAgency.umrah_location}
            onChange={setUmrahLocation}
            placeholder="Enter default Umrah location"
            realStyle={{ maxWidth: "800px" }}
          />
        }
        icon={faKaaba}
        display={"Umrah Location"}
        flex={1}
      />

      {/* ✅ Save Button */}
      <div
        style={{
          justifyContent: "end",
          display: "flex",
          marginTop: "10px",
        }}
      >
        {!checkSame() && (
          <ConfirmButton
            onClick={confirmAll}
            extra={confirming ? "disactive" : ""}
          />
        )}
      </div>
    </div>
  );
};
