import React, { useState, useEffect } from "react";
import VerificationInput from "react-verification-input";
import { InfoConfirmHolder } from "./InfoConfirmHolder";

export const EmailVerficationPage = ({ code, email, onCancel, confirmInformation, setStep}) => {
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState(null);
  const [available, setAvailable] = useState(true);
  const [attempts, setAttempts] = useState(0);

  // ✅ Reset everything when new code is sent (dialog reopened)
  useEffect(() => {
    setInputCode("");
    setError(null);
    setAvailable(true);
    setAttempts(0);
  }, [code, email]);

  async function confirm() {
    if (!available) return;

    if (inputCode === code.toString()) {
      setAvailable()
      await confirmInformation()
      setStep(2)

    } else {

      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        setError("❌ Too many attempts. Please try again later.");
        setAvailable(false);

        // Auto close after 2 seconds
        setTimeout(() => {
          onCancel();
        }, 2000);
      } else {
        setError(`Incorrect code. (${3 - newAttempts} attempts left)`);
      }
    }
  }

  return (
    <div
      className="edit-dialog"
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "25px",
      }}
    >
      <h3 style={{ marginBottom: "8px", textAlign: "center", color: "#333" }}>
        Email Verification
      </h3>
      <p
        style={{
          marginBottom: "14px",
          opacity: 0.8,
          textAlign: "center",
          color: "#444",
        }}
      >
        We’ve sent a verification code to:
        <br />
        <b>{email}</b>
      </p>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <VerificationInput
          length={5}
          value={inputCode}
          onChange={(v) => {
            setInputCode(v);
            if (error) setError(null);
          }}
          placeholder=" "
          validChars="0-9"
          removeDefaultStyles
          autoFocus
          inputProps={{ inputMode: "numeric" }}
          classNames={{
            container: "vi-container",
            character: "vi-char",
            characterInactive: "vi-char--inactive",
            characterSelected: "vi-char--selected",
          }}
        />
      </div>

      <style>{`
        .vi-container {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .vi-char {
          width: 50px;
          height: 60px;
          border-radius: 12px;
          border: 2px solid #ccc;
          background: white;
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          color: #333;
          transition: all 0.2s ease;
        }
        .vi-char--selected {
          border-color: #888;
          background: #ddd;
        }
      `}</style>

      {error && (
        <p
          style={{
            color: "#d9534f",
            fontSize: "14px",
            marginTop: "12px",
            textAlign: "center",
            minHeight: "20px",
          }}
        >
          {error}
        </p>
      )}

      <InfoConfirmHolder
        style={{ marginTop: "5px", opacity: available ? 1 : 0.5 }}
        onCancel={onCancel}
        name="Confirm"
        onConfirm={confirm}
        extra={!available ? "disactive" : ""}
      />

      <div
        style={{
          marginTop: "10px",
          fontSize: "12px",
          opacity: 0.5,
          textAlign: "center",
        }}
      >
        Test code: {code}
      </div>
    </div>
  );
}
