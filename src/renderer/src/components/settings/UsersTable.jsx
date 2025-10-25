import React, { useEffect, useMemo, useState } from "react";
import { Table } from "../home/table/Table";
import { SelectElement } from "../home/table/selectElement";
import { TableElement } from "../home/table/TableElement";
import { formatApiDate } from "../../functions/dates";
import { globalCheck, handleCheck } from "../../functions/tableOperations";

export const UsersTable = ({ operations, users = [], sortFunctions, edit, currentUser }) => {
  const [currentSortFn, setCurrentSortFn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [checkedIds, setCheckedIds] = useState([]);

  const handleSort = (sortFn, order = "asc") => {
    setCurrentSortFn(() => sortFn);
    setSortOrder(order);
  };

  // ✅ Always keep the current user at the top, even without sorting
  const sortedUsers = useMemo(() => {
    let sorted = [...users];

    // Apply sorting only if user triggered one
    if (currentSortFn) {
      sorted = sorted.sort(currentSortFn(sortOrder === "desc"));
    }

    // 🟩 Move current user to top
    if (currentUser) {
      const idx = sorted.findIndex((u) => u.id === currentUser.id);
      if (idx > 0) {
        const [self] = sorted.splice(idx, 1);
        sorted.unshift(self);
      }
    }

    // Clear checkboxes if user list changes
    setCheckedIds((prev) => {
      if (prev.length !== users.length) return [];
      return prev;
    });

    return sorted;
  }, [users, currentSortFn, sortOrder, currentUser]);

  // 🧩 Table rows
  const lines = sortedUsers.map((user, i) => (
    <tr key={i}>
      <td>
        <input
          type="checkbox"
          checked={checkedIds.includes(user.id)}
          onChange={() => handleCheck(user, setCheckedIds)}
        />
      </td>
      <TableElement text={user.name} />
      <TableElement text={user.phone_number || "-"} />
      <TableElement text={user.email} />
      <TableElement text={formatApiDate(user.last_connected)} />
      <TableElement text={formatApiDate(user.added_date)} />
      <TableElement text={user.role} />
      {edit && (
        <td>
          <SelectElement operations={operations} id={user.id} />
        </td>
      )}
    </tr>
  ));

  return (
    <Table
      edit={edit}
      operations={operations}
      selectedItems={checkedIds}
      globalCheck={() => globalCheck(setCheckedIds, users)}
      lines={lines}
      headerItems={[
        {
          name: "Name",
          sorting: {
            asc: () => handleSort(sortFunctions.byNames, "asc"),
            desc: () => handleSort(sortFunctions.byNames, "desc"),
          },
        },
        { name: "Phone Number" },
        { name: "Email" },
        {
          name: "Last Connected",
          sorting: {
            asc: () => handleSort(sortFunctions.byLastConnected, "asc"),
            desc: () => handleSort(sortFunctions.byLastConnected, "desc"),
          },
        },
        {
          name: "Added",
          sorting: {
            asc: () => handleSort(sortFunctions.byAdded, "asc"),
            desc: () => handleSort(sortFunctions.byAdded, "desc"),
          },
        },
        {
          name: "Role",
          sorting: {
            asc: () => handleSort(sortFunctions.byRole, "asc"),
            desc: () => handleSort(sortFunctions.byRole, "desc"),
          },
        },
      ]}
    />
  );
};
