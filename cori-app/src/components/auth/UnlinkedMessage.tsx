// Unlinked / Unactivated message

import React from "react";
import CoriBtn from "../buttons/CoriBtn";

import PendingActionsIcon from "@mui/icons-material/PendingActions";

function UnlinkedMessage({ onLogOut }: { onLogOut: () => void }) {
  return (
    <div className="flex flex-col items-center w-4/12 gap-4">
      <PendingActionsIcon className="text-warmstone-600" style={{ fontSize: "128px" }} />
      <div className="flex flex-col gap-2 items-center">
        <h1 className="text-3xl text-zinc-900 font-light">
          <span className="font-bold text-corigreen-500">Almost</span> there!
        </h1>
        <p className="text-zinc-500 text-center">
          Your Coriander account was created successfully, but still needs to be linked to your
          organisation. Please ask your admin to activate your account.
        </p>
      </div>
      <div className="flex flex-col w-full">
        <CoriBtn
          primary
          type="submit"
          style="black"
          className="w-full mt-3"
          onClick={() => {
            window.location.reload();
          }}
        >
          Refresh Page
        </CoriBtn>
        <CoriBtn secondary type="submit" style="black" className="w-full mt-3" onClick={onLogOut}>
          Logout
        </CoriBtn>
      </div>
    </div>
  );
}

export default UnlinkedMessage;
