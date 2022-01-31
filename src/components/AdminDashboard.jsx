import React, { useEffect, useState } from "react";
import http from "../services/httpService";

import moment from "moment";
import "../styles/admin-dashboard.css";

import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TextField from "@mui/material/TextField";
import DateRangePicker from "@mui/lab/DateRangePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import MenuItem from "@mui/material/MenuItem";
import auth from "../services/authService";
import Student from "./Student";

function AdminDashboard() {
  const columns = [
    { field: "id", headerName: "id", width: 100 },
    { field: "name", headerName: "Name", width: 100 },
    { field: "type", headerName: "Interviews Type", width: 150 },
    { field: "course", headerName: "Course Name", width: 150 },
    { field: "email", headerName: "Email", width: 100 },
    { field: "phone", headerName: "Phone", width: 100 },
    { field: "date", headerName: "Date", type: "date", width: 100 },
    { field: "user_id", headerName: "user_id", hide: true, width: 100 }
  ];

  var date = new Date(Date.now());
  const [rows, setRows] = useState([]);
  const [value, setValue] = React.useState([
    moment(Date.now()),
    moment(date.setDate(date.getDate() + 7))
  ]);
  const ranges = ["Week", "Today", "Three days", "Month"];
  const [range, setRange] = useState(ranges[0]);

  useEffect(async () => {
    if (value[0] && value[1]) {
      let res = (
        await http.get(
          `/courses/${moment(value[0]).toString()}/${moment(
            value[1]
          ).toString()}`
        )
      ).data;
      setRows(res);
    }
  }, [value]);

  const handleRangeChange = (e) => {
    setRange(e.target.value);
  };

  useEffect(async () => {
    switch (range) {
      case "Week":
        setValue([moment(Date.now()), moment(value[0]).add(7, "days")]);
        break;
      case "Today":
        setValue([moment(Date.now()), moment(Date.now())]);
        break;
      case "Three days":
        setValue([moment(value[0]), moment(value[0]).add(3, "days")]);
        break;
      case "Month":
        setValue([moment(value[0]), moment(value[0]).add(1, "M")]);
        break;
      default:
        setValue(range);
        break;
    }
  }, [range]);



  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 40 * 4.5 + 5,
        width: 250
      }
    }
  };

  if (auth.getCurrentUser().role === "student") return <Student />;

  return (
    <div className="admin-dashboard-container">

      <div className="range-picker">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateRangePicker
            startText="From"
            endText="Until"
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            renderInput={(startProps, endProps) => (
              <React.Fragment>
                <TextField {...startProps} />
                <Box sx={{ mx: 2 }}> to </Box>
                <TextField {...endProps} />
              </React.Fragment>
            )}
          />
        </LocalizationProvider>
      </div>

      <div className="range-by-week">
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="statuses">Select range :</InputLabel>
            <Select
              MenuProps={MenuProps}
              labelId="select-Range"
              id="select-Range"
              value={range}
              label="range"
              onChange={handleRangeChange}
            >
              {ranges.map((range, idx) => {
                return (
                  <MenuItem key={idx} value={range}>
                    {range}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
      </div>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          className="grid"
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
        />
      </div>
    </div>
  );
}

export default AdminDashboard;
