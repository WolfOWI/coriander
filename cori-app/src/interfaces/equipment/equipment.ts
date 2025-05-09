import { EquipmentCondition } from "../../types/common";

// In Backend: EquipmentDTO

export interface Equipment {
  equipmentId: number;
  employeeId: number | null;
  equipmentCatId: number;
  equipmentCategoryName: string;
  equipmentName: string;
  assignedDate: string | null;
  condition: EquipmentCondition;
}
