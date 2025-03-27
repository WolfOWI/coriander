// Import components
import CoriBtn from "../components/buttons/CoriBtn";

// Import Icons
import DeleteIcon from "@mui/icons-material/Delete";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function ReferencePage() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-zinc-900">Custom Components Reference</h1>

      {/* CoriBtns */}
      <h3 className="text-xl font-bold mb-2">CoriBtn</h3>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <CoriBtn primary style="default">
              Primary Default
            </CoriBtn>
            <CoriBtn primary style="black">
              Primary Black
            </CoriBtn>
            <CoriBtn primary style="red">
              Primary Red with Icon <DeleteIcon />
            </CoriBtn>
            <CoriBtn primary iconOnly>
              <ArrowBackIcon />
            </CoriBtn>
          </div>
          <div className="flex gap-2">
            <CoriBtn secondary>
              <InsertEmoticonIcon /> Secondary Default with Icon
            </CoriBtn>
            <CoriBtn secondary style="black">
              Secondary Black
            </CoriBtn>
            <CoriBtn secondary style="red">
              Secondary Red
            </CoriBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReferencePage;
