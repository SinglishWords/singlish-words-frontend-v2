import { FormControl, InputLabel, Select, SelectProps } from "@mui/material";

type DropdownProps = SelectProps & {
  inputLabel: string;
  value: string;
  name: string;
  listData: string[];
};

export const Dropdown = ({
  inputLabel,
  value,
  name,
  listData,
  ...rest
}: DropdownProps) => {
  return (
    <FormControl required={true} id="dropdown">
      <InputLabel
        variant="standard"
        sx={{ transform: "none", mt: "16px", ml: "14px" }}
      >
        {inputLabel}
      </InputLabel>
      <Select native value={value} name={name} {...rest}>
        <option aria-label="None" value="" />
        {listData.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};
