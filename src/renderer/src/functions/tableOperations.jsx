import { getExpensesNum } from "./money";
import { compareSums } from "./price";

export const stateOrder = {
  "Waiting": 0,
  "Active": 1,
  "Ended": 2,
  "Inactive": 4,
  "Canceled": 3,
};

export const buildSortFunction = (primaryCompare, secondaryCompare, reversePrimary = false) => {
  
  return (a, b) => {
    // Both valid → compare normally (reverse only applies to valid values)
    let result = primaryCompare(a, b)[0];
    let isNull = primaryCompare(a, b)[1];
    if(isNull) return result

    if (result !== 0) {
      return reversePrimary ? -result : result;
    }

    // Tie-breaker (always ascending)
    return secondaryCompare(a, b)[0];
  };
};

export const handleCheck = (item, setCheckedIds) => {
  setCheckedIds(prev => {
    if (prev.includes(item.id)) {
      // remove item.id
      return prev.filter(id => id !== item.id);
    } else {
      // add item.id
      return [...prev, item.id];
    }
  });
};

export const globalCheck = (setCheckedIds, tours) => {
  setCheckedIds(prev => {
    if (prev.length === tours.length) {
      // All selected → Uncheck all
      return [];
    } else {
      // Not all selected → Select all by ID
      return tours.map(tour => tour.id);
    }
  });
};

const isInvalid = (val) => val == null || val === "" || val === undefined;

export const makeCompare = (extract, compareFn) => {
  return (a, b) => {
    const aVal = extract(a);
    const bVal = extract(b);
    if (isInvalid(aVal) && isInvalid(bVal)) return [0, true];
    if (isInvalid(aVal)) return [1, true];   // always push a to END
    if (isInvalid(bVal)) return [-1, true];  // always push b to END
    return [compareFn(aVal, bVal), false]
    //console.log(aVal, bVal, isInvalid(aVal), isInvalid(bVal), returne)
    return returne;
  };
};

//COmmon Functions
export const compareStates   = makeCompare(a => stateOrder[a.state], (a, b) => a - b);
export const compareExpenses = makeCompare(a => ({ value: a.expenses, currency: a.expenses_currency }), (a, b) => compareSums(a, b,140));
export const comparePrices = makeCompare(
  a => ({ value: a.revenue, currency: a.revenue_currency }),
  (a, b) => compareSums(a, b, 140)
);

export const compareAdded    = makeCompare(
  a => a.creation_date ? new Date(a.creation_date) : null,
  (a, b) => b - a // newest first
);

  export const checkViewState = (id) => {
    const isArray = Array.isArray(id);
    const ids = isArray ? id : [id];
    return ids.length == 1

  };