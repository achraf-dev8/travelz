import React from "react";
import { Formik, Form } from "formik";
import { InputElement } from "../../inputs/InputElement";
import { InfoConfirmHolder } from "./InfoConfirmHolder";
import { apiPost } from "../../../functions/api";
import { passwordSchema } from "../../../functions/schema";

export const ChangePassword = ({ username, onCancel, setStep }) => {
  // 🔹 Manual confirm handler — validates and submits
  async function handleConfirm({ validateForm, setErrors, handleSubmit }) {
    const validationErrors = await validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // show errors only on confirm
      return;
    }

    handleSubmit(); // submit only if no validation errors
  }

  // 🔹 Main submit handler
  async function handleSubmitForm(values, { setSubmitting, setStatus, resetForm }) {
    setStatus(null);
      const res = await apiPost("/settings/change_password", {
        username,
        newPassword: values.newPassword,
      });

      if (!res.error) {
        console.log('succcccccccccccseeeeeeeeeeeeeesssssssssss')
        setStep(3)
      } else {
        setStatus('Something went wrong, please try again!');
      }
    

    setSubmitting(false);
  }

  return (
    <div>
      <p className="title">Change Password</p>

      <Formik
        initialValues={{ newPassword: "", confirmPassword: "" }}
        validationSchema={passwordSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmitForm}
      >
        {(formik) => {
          const {
            values,
            errors,
            handleChange,
            isSubmitting,
            status,
            validateForm,
            setErrors,
            handleSubmit,
          } = formik;

          // ✅ Bind the confirm function properly here
          const confirmHandler = () =>
            handleConfirm({ validateForm, setErrors, handleSubmit });

          return (
            <Form onSubmit={(e) => e.preventDefault()}>
              <InputElement
                type="password"
                display="New Password"
                name="newPassword"
                value={values.newPassword}
                onChange={handleChange}
                error={errors.newPassword}
              />

              <div style={{ height: "15px" }} />

              <InputElement
                type="password"
                display="Confirm New Password"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />

              {status && (
                <div className="input-container">
                <p className="error" style={{ marginTop: "10px" }}>
                  {status}
                </p>
                </div>
              )}

              <div style={{ height: "20px" }} />

              <InfoConfirmHolder
                style={{ marginTop: "0px" }}
                onCancel={onCancel}
                name="Confirm"
                extra={
                  isSubmitting ||
                  !values.newPassword ||
                  !values.confirmPassword
                    ? "disactive"
                    : ""
                }
                onConfirm={confirmHandler}
              />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
