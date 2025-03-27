import React from "react";

// Import components
import CoriBtn from "../components/buttons/CoriBtn";

// Import Icons
import DeleteIcon from "@mui/icons-material/Delete";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";

function ReferencePage() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Custom Components Reference Page</h1>

      {/* CoriBtns */}
      <h3 className="text-xl font-bold mb-2">CoriBtn</h3>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <CoriBtn hierarchy="primary" style="default">
              Primary Default
            </CoriBtn>
            <CoriBtn hierarchy="primary" style="black">
              Primary Black
            </CoriBtn>
            <CoriBtn hierarchy="primary" style="red">
              Primary Red with Icon <DeleteIcon />
            </CoriBtn>
          </div>
          <div className="flex gap-2">
            <CoriBtn hierarchy="secondary">
              <InsertEmoticonIcon /> Secondary Default with Icon
            </CoriBtn>
            <CoriBtn hierarchy="secondary" style="black">
              Secondary Black
            </CoriBtn>
            <CoriBtn hierarchy="secondary" style="red">
              Secondary Red
            </CoriBtn>
          </div>
        </div>
      </div>

      {/* <h3 className="text-xl font-bold mb-2">CoriInput</h3> */}
    </div>
  );
}

export default ReferencePage;
