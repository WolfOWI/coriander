import React, { useState } from "react";
import AssignEmpToEquipsModal from "../../components/modals/AssignEmpToEquipsModal";
import CoriBtn from "../../components/buttons/CoriBtn";

const AdminCreateEmployee: React.FC = () => {
  const [showAssignEmpToEquipsModal, setShowAssignEmpToEquipsModal] = useState(false);

  return (
    <div className="max-w-7xl mx-auto m-4">
      <h1 className="text-3xl font-bold mb-6 text-zinc-900">Create Employee</h1>
      <CoriBtn style="black" onClick={() => setShowAssignEmpToEquipsModal(true)}>
        Assign Employee to Equipment
      </CoriBtn>
      <AssignEmpToEquipsModal
        showModal={showAssignEmpToEquipsModal}
        setShowModal={setShowAssignEmpToEquipsModal}
      />
    </div>
  );
};

export default AdminCreateEmployee;
