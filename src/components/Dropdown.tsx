import { FormControl, InputLabel, Select, SelectProps } from "@mui/material";

type DropdownProps = SelectProps & {
  required: boolean;
  inputLabel: string;
  value: string;
  name: string;
  listData: string[] | number[];
};

export const Dropdown = ({
  required,
  inputLabel,
  value,
  name,
  listData,
  ...rest
}: DropdownProps) => {
  return (
    <FormControl required={required}>
      <InputLabel
        variant="standard"
        sx={{ transform: "none", mt: "16px", ml: "14px" }}
      >
        {inputLabel}
      </InputLabel>
      <Select native value={value} name={name} required={false}>
        <option value="" />
        {listData.map((item) => (
          <option key={item} value={item}>
            {/* If user is of age less than 18 or greater than 81, classify them under Less Than 18/More Than 80*/}
            {name === "age" && item < 18
              ? "Less Than 18"
              : name === "age" && item > 81
              ? "More Than 80"
              : item}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};
