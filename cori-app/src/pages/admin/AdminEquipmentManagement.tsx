import React, { useState } from "react";

// Import Icons
import { Icons } from "../../constants/icons";

// Import Components
import CoriBtn from "../../components/buttons/CoriBtn";

// Import Modals
import CreateUnlinkedEquipModal from "../../components/modals/CreateUnlinkedEquipModal";
import EditEquipDetailsModal from "../../components/modals/EditEquipDetailsModal";
import AssignSingleEquipToEmpModal from "../../components/modals/AssignSingleEquipToEmpModal";
import DeleteEquipmentModal from "../../components/modals/DeleteEquipmentModal";

// TODO: Temporary data here
const equipment = [
  {
    equipmentId: 1,
    equipmentName: "MacBook Pro 13 inch 2021",
    equipmentCategoryId: 1,
    equipmentCategoryName: "Laptop",
    assignedDate: "2021-01-01",
    condition: 2,
  },
];

const AdminEquipmentManagement: React.FC = () => {
  // Modal States
  const [showCreateUnlinkedEquipModal, setShowCreateUnlinkedEquipModal] = useState(false);
  const [showEditEquipDetailsModal, setShowEditEquipDetailsModal] = useState(false);
  const [showAssignSingleEquipToEmpModal, setShowAssignSingleEquipToEmpModal] = useState(false);
  const [showDeleteEquipmentModal, setShowDeleteEquipmentModal] = useState(false);
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
            Edit Modal
          </CoriBtn>
          <CoriBtn secondary style="black" onClick={() => setShowAssignSingleEquipToEmpModal(true)}>
            Assign2Emp Modal
          </CoriBtn>
          <CoriBtn secondary style="black" onClick={() => setShowDeleteEquipmentModal(true)}>
            Delete Equip Modal
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
      <AssignSingleEquipToEmpModal
        showModal={showAssignSingleEquipToEmpModal}
        setShowModal={setShowAssignSingleEquipToEmpModal}
      />
      <DeleteEquipmentModal
        showModal={showDeleteEquipmentModal}
        setShowModal={setShowDeleteEquipmentModal}
        equipment={equipment[0]}
        onDelete={() => {
          console.log("Delete");
        }}
      />
    </>
  );
};

export default AdminEquipmentManagement;
