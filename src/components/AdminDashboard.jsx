<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TextField from "@mui/material/TextField";
import DateRangePicker from "@mui/lab/DateRangePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import axios from "axios";
import moment from "moment";
import "../styles/admin-dashboard.css";

const AdminDashboard = () => {
  const URL = "http://localhost:3001";

  const columns = [
    { field: "name", headerName: "Name", width: 100 },
    { field: "type", headerName: "Interviews Type", width: 150 },
    { field: "course", headerName: "Course Name", width: 150 },
    { field: "email", headerName: "Email", width: 100 },
    { field: "phone", headerName: "Phone", width: 100 },
    { field: "date", headerName: "Date", type: "date", width: 100 }
  ];

  var date = new Date(Date.now());
  const [rows, setRows] = useState([]);
  const [value, setValue] = React.useState([
    Date.now(),
    date.setDate(date.getDate() + 7)
  ]);

  useEffect(async () => {
    if (value[0] && value[1]) {
      let res = (
        await axios.get(
          `${URL}/courses/${moment(value[0]).toString()}/${moment(
            value[1]
          ).toString()}`
        )
      ).data;
      setRows(res);
    }
  }, []);

  useEffect(async () => {
    if (value[0] && value[1]) {
      let res = (
        await axios.get(
          `${URL}/courses/${moment(value[0]).toString()}/${moment(
            value[1]
          ).toString()}`
        )
      ).data;
      setRows(res);
    }
  }, [value]);

  const handleRowClick = (event) => {
    console.log(event);
  };

  return (
    <div className="admin-dashboard-container">
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

      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="statuses">Statuses</InputLabel>
          <Select
            labelId="select-statuses"
            id="select-statuses"
            // value={statuses}
            label="statuses"
            // onChange={handleChange}
          >
            {/* {statuses.map((s, idx) => {
=======
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import TextField from '@mui/material/TextField';
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

import axios from 'axios';
import moment from 'moment'
import '../styles/admin-dashboard.css'
import MenuItem from '@mui/material/MenuItem';

function AdminDashboard() {
    let URL = "http://localhost:3001"

    const columns = [
        {field: 'id', headerName: 'id', width: 100, hide: true},
        { field: 'name', headerName: 'Name', width: 100 },
        { field: 'type', headerName: 'Interviews Type', width: 150 },
        { field: 'course', headerName: 'Course Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 100 },
        { field: 'phone', headerName: 'Phone', width: 100 },
        { field: 'date', headerName: 'Date', type: 'date', width: 100 }
    ];

    var date = new Date(Date.now());
    const [rows, setRows] = useState([])
    const [value, setValue] = React.useState([moment(Date.now()), moment(date.setDate(date.getDate() + 7))]);
    const ranges = ['Week', 'Today', 'Three days', 'Month']
    const [range , setRange] = useState(ranges[0])

    useEffect(async () => {
        if (value[0] && value[1]) {
            let res = (await axios.get(`${URL}/courses/${moment(value[0]).toString()}/${moment(value[1]).toString()}`)).data
            res.filter((v,i,a)=>a.findIndex(t=>(t.id===v.id))===i)
            setRows(res)
        }
    }, [])
    
    useEffect(async () => {
        if (value[0] && value[1]) {
            let res = (await axios.get(`${URL}/courses/${moment(value[0]).toString()}/${moment(value[1]).toString()}`)).data
            setRows(res)
        }
        
    }, [value])
    
    const handleRangeChange = (e) => {
        setRange(e.target.value)
    }

    useEffect(async () => {
        switch (range) {
            case 'Week':
                setValue([moment(Date.now()), moment(value[0]).add(7,'days')]);
                break; 
            case 'Today':
                setValue([Date.now(),Date.now()])
                break;
            case 'Three days':
                setValue([moment(value[0]), moment(value[0]).add(3,'days')])
                break;
            case 'Month':
                setValue([moment(value[0]), moment(value[0]).add(1,'M')])
                break;
            default:
                setValue(value)
        }
    },[range])

    const handleRowClick = (e) => {
        console.log(e);
    }

    return (
        <div className='admin-dashboard-container'>
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



            <Box sx={{ minWidth: 120 }} >
                <FormControl fullWidth>
                    <InputLabel id="statuses">Select range :</InputLabel>
                    <Select
                        labelId="select-Range"
                        id="select-Range"
                        value={range}
                        label="range"
                        onChange={handleRangeChange}
                    >
                        {ranges.map((range, idx) => {
>>>>>>> master
                            return (
                                <MenuItem key={idx} value={range}>{range}</MenuItem>
                            )
<<<<<<< HEAD
                        })} */}
          </Select>
        </FormControl>
      </Box>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          className="grid"
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          onRowClick={handleRowClick}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
=======
                        })}
                    </Select>
                </FormControl>
            </Box>


            <div style={{ height: 400, width: '100%' }}>
                <DataGrid className='grid'
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                    onRowClick={handleRowClick}
                />
            </div>
        </div>

    )
}

export default AdminDashboard;
>>>>>>> master
