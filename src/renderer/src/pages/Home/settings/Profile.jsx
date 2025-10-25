import React, { useRef, useState, useEffect } from "react";
import {
  faEnvelope,
  faLock,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { ProfileInfoItem } from "../../../components/settings/ProfileInfoItem";
import { ConfirmButton } from "../../../components/home/add/ConfirmButton";
import { EditDialog } from "../../../components/home/info/EditDialog";
import { ChangePasswordDialog } from "../../../components/home/info/ChangePasswordDialog";
import { EmailVerifyDialog } from "../../../components/home/info/EmailVerifyDialog";
import { checkInput } from "../../../functions/input";
import { apiPost, apiPut } from "../../../functions/api";
import { useAppStore } from "../../../store";

export const Profile = ({ setReqState }) => {
  // 🧩 Global user from Zustand
  const { user, setUser } = useAppStore();

  // 🧠 Local temporary copy
  const [tempUser, setTempUser] = useState(user);
  const [error, setError] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmingAll, setConfirmingAll] = useState(false);
  const [emailCode, setEmailCode] = useState(null);
  const [passwordStep, setPasswordStep] = useState(1);
  const [emailStep, setEmailStep] = useState(1);

  const refDialog = useRef(null);
  const refEmailDialog = useRef(null);
  const passRefDialog = useRef(null);

  // Keep tempUser synced if global user changes (after update)
  useEffect(() => {
    setTempUser(user);
  }, [user]);

  // 🔹 Normalize field names
  const normalizeName = (n) => {
    switch (n) {
      case "Name":
        return "name";
      case "Username":
        return "username";
      case "Email":
        return "email";
      case "Phone Number":
        return "phone_number";
      default:
        return n;
    }
  };

  const [fieldName, setFieldName] = useState("");
  const [tempVal, setTempVal] = useState("");

  // 🔹 Open dialogs
  function openEditDialog(name) {
    setError(null);
    setConfirming(false);
    setFieldName(name);
    setTempVal(tempUser[normalizeName(name)]);
    refDialog.current?.showModal();
  }

  function openPasswordDialog() {
    setPasswordStep(1);
    setError(null);
    setConfirming(false);
    setTempVal("");
    passRefDialog.current?.showModal();
  }

  // 🔹 Confirm single field change
  async function confirmChange() {
    const validateName = normalizeName(fieldName);
    const validationError = checkInput(fieldName, tempVal);
    setError(validationError);
    if (validationError) return;

    const valid = await validateInfo();
    if (!valid) return;

    setTempUser((u) => ({ ...u, [validateName]: tempVal }));
    refDialog.current?.close();
  }

  // 🔹 Confirm all (save or verify email)
  async function confirmAll() {
    setConfirmingAll(true);

    if (tempUser.email === user.email) {
      await confirmInformation();
    } else {
      await verifyEmail();
    }

    setConfirmingAll(false);
  }

  // 🔹 Confirm info (PUT request)
  async function confirmInformation() {
    const res = await apiPut("/settings/edit_information", {
      user: tempUser,
      username: user.username,
    });

    if (!res.error) {
      setUser(tempUser); // ✅ Update Zustand store
      setReqState("success");
    } else {
      setReqState(res.error.source);
    }
  }

  // 🔹 Verify email before saving
  async function verifyEmail() {
    const res = await apiPost(
      "/settings/verify_email_code",
      { email: tempUser.email, username: user.username },
      { timeout: 25000 }
    );

    if (!res.error) {
      if (res.data.error)
        alert("You've reached verification code limit, please try again later!");
      else {
        setEmailCode(res.data.code);
        setEmailStep(1);
        refEmailDialog.current?.showModal();
      }
    } else {
      setReqState(res.error.source);
    }
  }

  // 🔹 Cancel edits
  function cancelAll() {
    setTempUser(user);
  }

  // 🔹 Validate unique email/username
  async function validateInfo() {
    setError(null);
    if (!(fieldName === "Username" || fieldName === "Email")) return true;
    setConfirming(true);

    let response;
    if (fieldName === "Username") {
      if (tempVal === user.username) return true;
      response = await apiPost("/settings/verify_username", {
        username: tempVal,
      });
    } else {
      if (tempVal === user.email) return true;
      response = await apiPost("/settings/verify_email", { email: tempVal });
    }

    setConfirming(false);

    if (!response.error) {
      const { success } = response.data;
      if (success) return true;
      setError(`This ${fieldName} is already used`);
    } else {
      setError("Something went wrong, please try again!");
    }

    return false;
  }

  // 🔹 Check if anything changed
  function checkSame() {
    const keys = Object.keys(user);
    return keys.every((k) => user[k] === tempUser[k]);
  }

  // 🔹 Close dialogs
  function closeDialogEvent(e, ref) {
    const dialog = ref.current;
    if (e.target === dialog) {
      dialog.close();
    }
  }

  return (
    <>
      <div className="inputs-holder">
        <ProfileInfoItem
          onClick={() => openEditDialog("Name")}
          icon={faUser}
          display={"Name"}
          value={tempUser.name}
          flex={1}
        />
        <ProfileInfoItem
          onClick={() => openEditDialog("Username")}
          icon={faUser}
          display={"Username"}
          value={tempUser.username}
          flex={1}
        />
      </div>

      <div className="inputs-holder">
        <ProfileInfoItem
          onClick={() => openEditDialog("Email")}
          icon={faEnvelope}
          display={"Email"}
          value={tempUser.email}
          flex={1}
        />
        <ProfileInfoItem
          onClick={() => openEditDialog("Phone Number")}
          icon={faPhone}
          display={"Phone Number"}
          value={tempUser.phone_number}
          flex={1}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "end",
          gap: "8px",
          marginTop: "10px",
        }}
      >
        <ConfirmButton
          onClick={openPasswordDialog}
          icon={faLock}
          name="Change Password"
          style={{
            justifyContent: "center",
            border: "1px var(--primary-color) solid",
            backgroundColor: "white",
            color: "var(--primary-color)",
            gap: "3px",
          }}
        />

        {!checkSame() && (
          <ConfirmButton
            extra={confirmingAll ? "disactive" : ""}
            name={
              tempUser.email === user.email ? "Confirm" : "Verify Email"
            }
            style={{ justifyContent: "center" }}
            onClick={confirmAll}
          />
        )}
      </div>

      {/* 🧩 Edit Dialog */}
      <dialog ref={refDialog} onClick={(e) => closeDialogEvent(e, refDialog)}>
        <EditDialog
          confirming={confirming}
          onConfirm={confirmChange}
          name={fieldName}
          value={tempVal}
          onChange={(e) => setTempVal(e.target.value)}
          onCancel={() => refDialog.current?.close()}
          error={error}
        />
      </dialog>

      {/* 🔐 Change Password Dialog */}
      <dialog
        ref={passRefDialog}
        onClick={(e) => closeDialogEvent(e, passRefDialog)}
      >
        <ChangePasswordDialog
          step={passwordStep}
          setStep={setPasswordStep}
          username={user.username}
          confirming={confirming}
          setConfirming={setConfirming}
          error={error}
          setError={setError}
          value={tempVal}
          onChange={(e) => setTempVal(e.target.value)}
          onCancel={() => passRefDialog.current?.close()}
        />
      </dialog>

      {/* 📧 Email Verification Dialog */}
      <dialog
        ref={refEmailDialog}
        onClick={(e) => closeDialogEvent(e, refEmailDialog)}
      >
        <EmailVerifyDialog
        succText = {"Information was updated successfully!"}
          confirmInformation={confirmInformation}
          step={emailStep}
          setStep={setEmailStep}
          email={tempUser.email}
          code={emailCode}
          onCancel={() => refEmailDialog.current?.close()}
        />
      </dialog>
    </>
  );
};
