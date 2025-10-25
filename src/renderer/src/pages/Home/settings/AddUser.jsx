import React, { useEffect, useRef, useState } from "react";
import { InputElement } from "../../../components/inputs/InputElement";
import { useFormik } from "formik";
import { HandleRequest } from "../HandleRequest";
import { apiPost } from "../../../functions/api";
import { ConfirmButton } from "../../../components/home/add/ConfirmButton";
import { userSchema } from "../../../functions/schema";
import { EmailVerifyDialog } from "../../../components/home/info/EmailVerifyDialog";
import { useAppStore } from "../../../store";

export const AddUser = ({ page = false }) => {
    const { user, agency } = useAppStore();
  const [reqState, setReqState] = useState("success");
  const [confirmName, setConfirmName] = useState("Confirm");
  const [originalUser, setOriginalUser] = useState({});
  const [validConfirm, setValidConfirm] = useState("disactive");

  const [emailCode, setEmailCode] = useState(null);
  const [emailStep, setEmailStep] = useState(1);

  const refEmailDialog = useRef(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
      phone_number: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: userSchema,
    onSubmit: async () => confirm(),
    validateOnBlur: false,
    validateOnChange: false,
  });

  const { values, errors, touched, handleChange, handleBlur, validateForm } = formik;

  // ✅ Control confirm button activation
  useEffect(() => {
    const { name, username, email, password, confirmPassword } = values;
    if (
      name?.trim() &&
      username?.trim() &&
      email?.trim() &&
      password?.trim() &&
      confirmPassword?.trim()
    )
      setValidConfirm("");
    else setValidConfirm("disactive");
  }, [values]);

  // ✅ Handle confirm click
  async function confirm() {
    if (validConfirm === "disactive") return;

    const errs = await validateForm();
    if (Object.keys(errs).length > 0) return;

    const check = await apiPost("/settings/check_valid", {
      username: values.username,
      email: values.email,
    });

    if (check.error) {
      setReqState(check.error.source || "server");
      return;
    }

    // Handle duplicates
    if (!check.data.username && !check.data.email) {
      formik.setErrors({
        username: "Username already used",
        email: "Email already used",
      });
      return;
    } else if (!check.data.username) {
      formik.setErrors({ username: "Username is already used!" });
      return;
    } else if (!check.data.email) {
      formik.setErrors({ email: "Email is already used!" });
      return;
    }

    // ✅ If valid → lock values as original and move to "Verify Email"
    setOriginalUser({ ...values });
    setConfirmName("Verify Email");
  }

  // ✅ Verify email before completing user creation
  async function verifyEmail() {
    console.log('sj^dsojdspoj',  { email: values.email, username: user.username })
    const res = await apiPost(
      "/settings/verify_email_code",
      { email: values.email, username: user.username },
      { timeout: 25000 }
    );

    if (!res.error) {
      if (res.data.error) {
        alert("You've reached the verification code limit. Please try again later!");
      } else {
        setEmailCode(res.data.code);
        setEmailStep(1);
        refEmailDialog.current?.showModal();
      }
    } else {
      setReqState(res.error.source);
    }
  }

  // ✅ Called after successful code verification
    async function confirmInformation() {
    const res = await apiPost("/settings/add_user", {
      ...values, agency_id : agency.id
    });

    if (!res.error) {
      setReqState("success");
      formik.resetForm();
      setConfirmName("Confirm");
      setOriginalUser({});
    } else {
      setReqState(res.error.source);
    }
  }

  // ✅ Detect changes: revert to "Confirm" if form differs from originalUser
  useEffect(() => {
    if (Object.keys(originalUser).length === 0) return;

    const hasChanged = Object.keys(values).some(
      (key) => values[key] !== originalUser[key]
    );

    if (hasChanged && confirmName !== "Confirm") {
      setConfirmName("Confirm");
    } else if (!hasChanged && confirmName !== "Verify Email") {
      setConfirmName("Verify Email");
    }
  }, [values, originalUser, confirmName]);

  function refreshPage() {
    setReqState("success");
  }

  // ✅ Close dialog when clicked outside
  function closeDialogEvent(e, ref) {
    const dialog = ref.current;
    if (e.target === dialog) {
      dialog.close();
    }
  }

  return (
    <HandleRequest
      reqState={reqState}
      retry={refreshPage}
      layout={
        <>
          <div className="inputs-holder">
            <InputElement
              name="name"
              display="Full Name*"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              touched={touched.name}
            />

            <InputElement
              name="username"
              display="Username*"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.username}
              touched={touched.username}
            />
          </div>

          <div className="inputs-holder">
            <InputElement
              name="email"
              display="Email*"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
            />

            <InputElement
              name="phone_number"
              display="Phone Number"
              value={values.phone_number}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.phone_number}
              touched={touched.phone_number}
            />
          </div>

          <div className="inputs-holder">
            <InputElement
              name="password"
              type="password"
              display="Password*"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              touched={touched.password}
            />

            <InputElement
              name="confirmPassword"
              type="password"
              display="Confirm Password*"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
            />
          </div>

          <div
            style={{
              justifyContent: "end",
              display: "flex",
              marginTop: "20px",
            }}
          >
            <ConfirmButton
              name={confirmName}
              onClick={confirmName == 'Confirm' ? confirm : verifyEmail}
              type="submit"
              extra={validConfirm}
            />
          </div>

          {/* 📧 Email Verification Dialog */}
          <dialog
            ref={refEmailDialog}
            onClick={(e) => closeDialogEvent(e, refEmailDialog)}
          >
            <EmailVerifyDialog
            succText = {"User was added successfully!"}
              confirmInformation={confirmInformation}
              step={emailStep}
              setStep={setEmailStep}
              email={values.email}
              code={emailCode}
              onCancel={() => refEmailDialog.current?.close()}
            />
          </dialog>
        </>
      }
    />
  );
};
