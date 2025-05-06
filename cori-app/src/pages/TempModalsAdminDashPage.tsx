import React, { useState } from "react";

// Import Modals
import CreatePRModal from "../components/modals/CreatePRModal";

// Import Components
import CoriBtn from "../components/buttons/CoriBtn";

function TempModalsAdminDashPage() {
  // State for the modals
  const [showCreatePRModal, setShowCreatePRModal] = useState(false);

  return (
    <div className="max-w-7xl mx-auto m-4">
      <h1 className="text-3xl font-bold mb-6 text-zinc-900">Modals on the Admin Dash</h1>
      <div className="flex gap-4">
        <CoriBtn onClick={() => setShowCreatePRModal(true)}>Open Create PR Modal</CoriBtn>
        <CoriBtn>Open Edit PR Modal</CoriBtn>
      </div>
      <CreatePRModal
        showModal={showCreatePRModal}
        setShowModal={setShowCreatePRModal}
        onCreateSuccess={() => {
          ("Functionality not implemented yet");
        }}
      />
    </div>
  );
}

export default TempModalsAdminDashPage;
