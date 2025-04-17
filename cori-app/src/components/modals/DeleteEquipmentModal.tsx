import React from "react";
import { Modal, Button } from "antd";
import { Icons } from "../../constants/icons";

interface DeleteEquipmentModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  equipment: {
    equipmentId: number;
    equipmentName: string;
    equipmentCategoryName: string;
    condition: number;
  } | null;
  onDelete: () => void;
}

function DeleteEquipmentModal({
  showModal,
  setShowModal,
  equipment,
  onDelete,
}: DeleteEquipmentModalProps) {
  if (!equipment) return null;

  return (
    <Modal
      title={<h2 className="text-zinc-900 font-bold text-3xl">Delete Equipment Item</h2>}
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
          <Button key="cancel" onClick={() => setShowModal(false)} className="w-full">
            Cancel
          </Button>
          <Button key="delete" type="primary" danger onClick={onDelete} className="w-full">
            Delete Item
          </Button>
        </div>,
      ]}
    >
      <div className="flex flex-col gap-2">
        <p className="text-zinc-500 text-sm">This cannot be undone.</p>
        <div className="flex items-center gap-3 px-4 py-3 bg-warmstone-300 rounded-xl my-2">
          <div className="bg-warmstone-50 rounded-full p-2">
            <Icons.Phone className="text-zinc-900" fontSize="large" />
          </div>
          <div className="flex flex-col">
            <p className="text-zinc-900">{equipment.equipmentName}</p>
            <div className="flex items-center gap-2">
              <p className="text-zinc-500 text-sm">{equipment.equipmentCategoryName}</p>
              <p className="text-zinc-500 text-sm">•</p>
              <p className="text-zinc-500 text-sm">
                {equipment.condition === 0
                  ? "New"
                  : equipment.condition === 1
                  ? "Good"
                  : equipment.condition === 2
                  ? "Decent"
                  : "Used"}{" "}
                Quality
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteEquipmentModal;
