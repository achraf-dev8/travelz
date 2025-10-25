import {
  faCalendarDay,
  faHouse,
  faPhone,
  faTrash,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useRef, useState } from "react";
import { InfoRow } from "../../../components/home/info/InfoRow";
import { formatApiDate } from "../../../functions/dates";
import { UsersTable } from "../../../components/settings/UsersTable";
import {
  buildSortFunction,
  compareAdded,
  compareStates,
  makeCompare,
} from "../../../functions/tableOperations";
import { apiDelete, apiGet, apiPatch, apiPut } from "../../../functions/api";
import { ConfrimDialog } from "../../../components/home/main/ConfirmDialog";
import { EditDialog } from "../../../components/home/info/EditDialog";
import { checkInput } from "../../../functions/input";
import { ConfirmButton } from "../../../components/home/add/ConfirmButton";
import { useAppStore } from "../../../store";
import { AddButton } from "../../../components/home/add/AddButton";
import { AddUser } from "./AddUser"; // ✅ import AddUser page

export const Agency = ({ setReqState }) => {
  const { user, agency, setAgency, setUser } = useAppStore();

  const [page, setPage] = useState("default"); // ✅ state to switch between pages
  const [reqState, setLocalReqState] = useState("success");
  const [users, setUsers] = useState([]);
  const [tempAgency, setTempAgency] = useState(agency);

  const [operation, setOperation] = useState("Delete");
  const [operationOnClick, setOperationOnClick] = useState(null);
  const [length, setLength] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [confirmingAll, setConfirmingAll] = useState(false);
  const [editName, setEditName] = useState(null);
  const [editError, setEditError] = useState(null);
  const [tempVal, setTempVal] = useState(null);

  const refDialog = useRef(null);
  const refEditDialog = useRef(null);

  // 🔹 Fetch on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setReqState("loading");
    const res = await apiGet("/settings/agency");
    if (!res.error) {
      setReqState("success");
      setUsers(res.data.users);
      setAgency(res.data.agency);
      setTempAgency(res.data.agency);
    } else {
      setReqState(res.error.source);
    }
  }

  // 🔹 Comparators and sort functions
  const compareNames = makeCompare((a) => a.name, (a, b) => a.localeCompare(b));
  const compareLastConnected = makeCompare(
    (a) => a.last_connected,
    (a, b) => new Date(b) - new Date(a)
  );
  const compareRole = makeCompare(
    (a) => a.role,
    (a, b) => (a === b ? 0 : a === "Admin" ? 1 : -1)
  );
  const sortFunctions = {
    byNames: (reverse = false) =>
      buildSortFunction(compareNames, compareRole, reverse),
    byState: (reverse = false) =>
      buildSortFunction(compareStates, compareNames, reverse),
    byAdded: (reverse = false) =>
      buildSortFunction(compareAdded, compareNames, reverse),
    byLastConnected: (reverse = false) =>
      buildSortFunction(compareLastConnected, compareNames, reverse),
    byRole: (reverse = false) =>
      buildSortFunction(compareRole, compareNames, reverse),
  };

  // 🔹 Delete user
  const delet = async (id) => {
    const isArray = Array.isArray(id);
    const url = isArray ? "/settings/users" : `/settings/users/${id}`;
    const config = isArray ? { data: { ids: id } } : {};
    const res = await apiDelete(url, "/settings/users", config);
    if (!res.error) {
      setUsers((prev) =>
        isArray
          ? prev.filter((u) => !id.includes(u.id))
          : prev.filter((u) => u.id !== id)
      );
    } else {
      setReqState(res.error.source);
    }
  };

  // 🔹 Toggle Admin
  const toggleAdmin = async (id) => {
    const ids = Array.isArray(id) ? id : [id];
    const currentAdmins = users.filter((u) => u.role === "Admin");
    const willRemoveAllAdmins =
      ids.every((idToChange) =>
        currentAdmins.some((admin) => admin.id === idToChange)
      ) && currentAdmins.length === ids.length;

    if (willRemoveAllAdmins) {
      alert("You must keep at least one Admin in the agency!");
      return;
    }

    const res = await apiPatch(
      "/settings/users/toggle_admin/",
      { ids },
      "/settings/users/"
    );
    if (!res.error) {
      setUsers((prev) =>
        prev.map((u) =>
          ids.includes(u.id)
            ? { ...u, role: u.role === "Admin" ? "User" : "Admin" }
            : u
        )
      );

      if (ids.includes(user.id)) {
        setUser({
          ...user,
          role: user.role === "Admin" ? "User" : "Admin",
        });
      }
    } else {
      setReqState(res.error.source);
    }
  };

  // 🔹 Dialog logic
  const openDialog = (id, operation, onClick) => {
    setOperation(operation);
    setOperationOnClick(() => onClick);
    const ids = Array.isArray(id) ? id : [id];
    setLength(ids.length);
    refDialog.current?.showModal();
  };

  const normalizeName = (n) =>
    n === "Agency Name"
      ? "name"
      : n === "Phone Number"
      ? "phone_number"
      : n;

  const openEditDialog = (name) => {
    setConfirming(false);
    setEditError(null);
    const normalName = normalizeName(name);
    setEditName(name);
    setTempVal(tempAgency[normalName]);
    refEditDialog.current?.showModal();
  };

  const onCancelDialog = () => {
    refDialog.current?.close();
  };

  async function confirmChange() {
    const validateName = editName === "Agency Name" ? "res name" : editName;
    const error = checkInput(validateName, tempVal);
    setEditError(error);

    if (!error) {
      setTempAgency((u) => ({
        ...u,
        [normalizeName(editName)]: tempVal,
      }));
      refEditDialog.current?.close();
    }

    setConfirming(false);
  }

  const enabled = () => true;

  // 🔹 Table operations
  const operations = [
    {
      name: "Admin/User",
      onClick: (id) => openDialog(id, "Admin", () => toggleAdmin(id)),
      icon: faUserShield,
      enabledFun: enabled,
    },
    {
      name: "Delete",
      onClick: (id) => openDialog(id, "Delete", () => delet(id)),
      icon: faTrash,
      enabledFun: (selected) => {
        const ids = Array.isArray(selected) ? selected : [selected];
        return !ids.includes(user.id);
      },
    },
  ];

  // 🔹 Save Agency changes
  async function confirmAll() {
    setConfirmingAll(true);
    const res = await apiPut("/settings/update_agency", tempAgency);
    if (!res.error) {
      setAgency(tempAgency);
    } else {
      setReqState(res.error.source);
    }
    setConfirmingAll(false);
  }

  const closeDialogEvent = (e, ref) => {
    if (e.target === ref.current) ref.current.close();
  };

  // ✅ Switch between default and AddUser page
  if (page === "addUser") {
    return (
      <AddUser
        page={true}
        reqState={reqState}
        setReqState={setReqState}
        onCancel={() => setPage("default")} // ⬅ go back
      />
    );
  }

  // ✅ Default agency view
  return (
    <>
      <p style={{ fontWeight: "600", marginBottom: "8px" }}>Agency Information</p>
      <div className="info-card" style={{ paddingBlock: "5px" }}>
        <div className="info-card-holder">
          <InfoRow
            fullStyle={{ margin: "0px" }}
            icon={faHouse}
            type="Agency Name"
            info={tempAgency.name}
            edit={user.role === "Admin" ? () => openEditDialog("Agency Name") : null}
          />
          <InfoRow
            fullStyle={{ margin: "0px" }}
            icon={faPhone}
            type="Phone Number"
            info={tempAgency.phone_number}
            edit={user.role === "Admin" ? () => openEditDialog("Phone Number") : null}
          />
          <InfoRow
            fullStyle={{ margin: "0px" }}
            icon={faCalendarDay}
            type="Added"
            info={formatApiDate(tempAgency.creation_date)}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          margin: "15px 0px 10px",
        }}
      >
        <p style={{ fontWeight: "600", marginBlock: "10px 8px" }}>Users</p>
        <AddButton
          state={`Add User`}
          noChange={true}
          onClick={() => setPage("addUser")} // ⬅ switch to add user page
        />
      </div>

      <UsersTable
        currentUser={user}
        edit={user.role === "Admin"}
        operations={operations}
        users={users}
        sortFunctions={sortFunctions}
      />

      {/* Confirm Dialog */}
      <dialog onClick={(e) => closeDialogEvent(e, refDialog)} ref={refDialog}></dialog>
      <ConfrimDialog
        sub={"users"}
        refDialog={refDialog}
        operation={operation}
        onConfirm={operationOnClick}
        length={length}
        onCancel={onCancelDialog}
        onCancelDialog={onCancelDialog}
      />

      {/* Edit Dialog */}
      <dialog ref={refEditDialog} onClick={(e) => closeDialogEvent(e, refEditDialog)}>
        <EditDialog
          confiriming={confirming}
          onConfirm={confirmChange}
          name={editName}
          value={tempVal}
          onChange={(e) => setTempVal(e.target.value)}
          onCancel={(e) => closeDialogEvent(e, refEditDialog)}
          error={editError}
        />
      </dialog>
    </>
  );
};
