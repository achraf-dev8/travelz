import React from "react";
import { ConfirmButton } from "../add/ConfirmButton";

export const InfoUpdatedSuccess = ({ onCancel, text}) => {
  return (
    <div style={{ textAlign: "center" }} className="edit-dialog">
      <p style={{ fontSize: "17px", fontWeight: "500" }}>
        {text}
      </p>

      <div style={{ height: "20px" }} />
      <div style={{ display: "flex", justifyContent: "end" }}>
        <ConfirmButton
          style={{ width: "150px", justifyContent: "center" }}
          onClick={onCancel}
        />
      </div>
    </div>
  );
};
