import React from "react";
import { Modal, Button } from "antd";

interface TerminateEmployeeModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  employeeFullName: string;
  onTerminate: () => void;
}

function TerminateEmployeeModal({
  showModal,
  setShowModal,
  employeeFullName,
  onTerminate,
}: TerminateEmployeeModalProps) {
  return (
    <Modal
      title={<h2 className="text-zinc-900 font-bold text-3xl text-center">Warning!</h2>}
      open={showModal}
      onCancel={() => setShowModal(false)}
      width={600}
      styles={{
        header: {
          paddingLeft: 40,
          paddingRight: 40,
          paddingTop: 40,
          background: "#F5F5F4", // warmstone-100 equivalent
          borderBottom: "none",
        },
        body: {
          paddingLeft: 40,
          paddingRight: 40,
          paddingTop: 24,
          paddingBottom: 24,
        },
        footer: {
          paddingLeft: 40,
          paddingRight: 40,
          paddingBottom: 40,
          borderTop: "none",
        },
      }}
      footer={[
        <div className="flex gap-2 w-full" key="footer">
          <Button className="w-full" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button className="w-full" type="primary" danger onClick={onTerminate}>
            Terminate
          </Button>
        </div>,
      ]}
    >
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-red-600 font-bold text-2xl">
          You're about to delete {employeeFullName}.
        </h2>
        <p className="text-zinc-500 text-sm">
          All associated records (equipment, performance reviews, leave requests, and balances) will
          also be deleted. The user's account will remain, but access to this management system will
          be revoked.
        </p>
      </div>
    </Modal>
  );
}

export default TerminateEmployeeModal;
