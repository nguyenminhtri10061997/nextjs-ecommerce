import { useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

import TextField from "@mui/material/TextField";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";

type DateRangePickerProps = {
  label?: string;
  onChange?: (range: DateRange) => void;
};

export default function DateRangePicker({
  label = "Pick Date",
  onChange,
}: DateRangePickerProps) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [step, setStep] = useState<"from" | "to">("from");
  const [month, setMonth] = useState(new Date());
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [key, setKey] = useState(Date().toString());

  const handleDayClick = (date: Date) => {
    if (step === "from") {
      setKey(Date().toString());
      const newRange = { from: new Date(date), to: undefined };
      setRange(newRange);
      setStep("to");
    } else if (step === "to") {
      if (!range?.from) return; // safety check

      let newRange;

      if (date < range.from) {
        newRange = { from: new Date(date), to: new Date(range.from) };
      } else {
        newRange = { from: new Date(range.from), to: new Date(date) };
      }

      setRange(newRange);
      setStep("from");
      setOpen(false);

      onChange?.(newRange);
    }
  };

  const formatDate = (date?: Date) => (date ? date.toLocaleDateString() : "");

  const displayValue = range?.from
    ? `${formatDate(range.from)} - ${formatDate(range.to)}`
    : "";

  return (
    <>
      <TextField
        label={label}
        value={displayValue}
        inputRef={anchorRef}
        onClick={() => {
          setOpen(true);
        }}
        size="small"
      />

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        sx={{ zIndex: 2 }}
      >
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Paper elevation={3}>
            <Box sx={{ p: 1 }}>
              <DayPicker
                key={key}
                mode="range"
                selected={range}
                onDayClick={handleDayClick}
                numberOfMonths={2}
                month={month}
                onMonthChange={setMonth}
              />
            </Box>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
}
