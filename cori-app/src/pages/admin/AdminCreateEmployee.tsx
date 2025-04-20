import React, { useState } from "react";
import AssignEmpToOneOrManyEquipsModal from "../../components/modals/AssignEmpToOneOrManyEquipsModal";
import CoriBtn from "../../components/buttons/CoriBtn";

const AdminCreateEmployee: React.FC = () => {
  const [showAssignEmpToEquipsModal, setShowAssignEmpToEquipsModal] = useState(false);

  return (
    <div className="max-w-7xl mx-auto m-4">
      <h1 className="text-3xl font-bold mb-6 text-zinc-900">Create Employee</h1>
      <CoriBtn style="black" onClick={() => setShowAssignEmpToEquipsModal(true)}>
        Assign 1 or Multiple Equipments
      </CoriBtn>
      {/* Assign Multiple Existing Equipments Modal */}
      {/* TODO: Will probably create a copy of this modal, since this modal assigns immediately on press of Assign Button. */}
      <AssignEmpToOneOrManyEquipsModal
        showModal={showAssignEmpToEquipsModal}
        setShowModal={setShowAssignEmpToEquipsModal}
        employeeId={8}
        onAssignSuccess={() => {
          console.log(
            "Callback function that will be called when the employee is assigned to the equipment"
          );
        }}
      />
    </div>
  );
};

export default AdminCreateEmployee;
