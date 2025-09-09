import { MenuItem, Button } from "@mui/material";

import * as XLSX from "xlsx";

interface ImportButtonProps<T> {
  onChange: (data: T[]) => void;
  fileText: string;
  variant: "outlined" | "contained";
  component?: typeof Button | typeof MenuItem;
}

const ImportButton = <T extends {}>({ onChange, fileText, variant, component }: ImportButtonProps<T>) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      const reader = new FileReader();

      reader.onload = async (event) => {
        const target = event.target;

        if (target && target.result) {
          const binaryStr = event.target.result;
          const wb = XLSX.read(binaryStr, { type: "binary" });
          const sheetName = wb.SheetNames[0];
          const worksheets = wb.Sheets[sheetName];

          const json: T[] = XLSX.utils.sheet_to_json(worksheets, {
            raw: false,
            defval: ""
          });

          onChange(json);
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div>
      <input
        type='file'
        accept='.xlsx'
        style={{ display: "none" }}
        onChange={handleFileChange}
        id='file-upload-input'
      />
      <label htmlFor='file-upload-input'>
        {component == MenuItem ? (
          <MenuItem>{fileText}</MenuItem>
        ) : (
          <Button variant={variant} component='span'>
            {fileText}
          </Button>
        )}
      </label>
    </div>
  );
};

export default ImportButton;
