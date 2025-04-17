import React, { useState } from "react";

// Import Icons
import { Icons } from "../../constants/icons";

// Import Components
import CoriBtn from "../../components/buttons/CoriBtn";

// Import Modals
import CreateUnlinkedEquipModal from "../../components/modals/CreateUnlinkedEquipModal";
import EditEquipDetailsModal from "../../components/modals/EditEquipDetailsModal";

const AdminEquipmentManagement: React.FC = () => {
  // Modal States
  const [showCreateUnlinkedEquipModal, setShowCreateUnlinkedEquipModal] = useState(false);
  const [showEditEquipDetailsModal, setShowEditEquipDetailsModal] = useState(false);
  return (
    <>
      <div className="max-w-7xl mx-auto m-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Icons.Construction fontSize="large" className="text-zinc-900" />
            <h1 className="text-3xl font-bold text-zinc-900">Equipment</h1>
          </div>
          {/* TODO Delete this later */}
          <CoriBtn secondary style="black" onClick={() => setShowEditEquipDetailsModal(true)}>
            Edit Modal (Delete Later)
          </CoriBtn>
          <CoriBtn style="black" onClick={() => setShowCreateUnlinkedEquipModal(true)}>
            Create
            <Icons.Add />
          </CoriBtn>
        </div>
      </div>
      <CreateUnlinkedEquipModal
        showModal={showCreateUnlinkedEquipModal}
        setShowModal={setShowCreateUnlinkedEquipModal}
      />
      <EditEquipDetailsModal
        showModal={showEditEquipDetailsModal}
        setShowModal={setShowEditEquipDetailsModal}
      />
    </>
  );
};

export default AdminEquipmentManagement;
