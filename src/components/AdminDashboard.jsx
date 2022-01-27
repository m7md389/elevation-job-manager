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




function AdminDashboard() {

    const columns = [
        { field: 'name', headerName: 'Name', width: 100 },
        { field: 'type', headerName: 'Interviews Type', width: 150 },
        { field: 'course', headerName: 'Course Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 100 },
        { field: 'phone', headerName: 'Phone', width: 100 },
        { field: 'date', headerName: 'Date', type: 'date', width: 100 }
    ];

    // let rows = [];

    let URL = "http://localhost:3001"

    var date = new Date(Date.now());

    const [rows, setRows] = useState([])
    const [value, setValue] = React.useState([Date.now(), date.setDate(date.getDate() + 7)]);

    useEffect(async () => {
        console.log(value[0]);
        console.log(value[1]);
        if (value[0] && value[1]) {
            let res = (await axios.get(`${URL}/courses/${moment(value[0]).toString()}/${moment(value[1]).toString()}`)).data
            // console.log(res);
            setRows(res)
        }

    }, [])


    useEffect(async () => {
        if (value[0] && value[1]) {
            let res = (await axios.get(`${URL}/courses/${moment(value[0]).toString()}/${moment(value[1]).toString()}`)).data
            // console.log(res);
            setRows(res)
        }

    }, [value])

    // useEffect(async () => {
    //     if (value[0] && value[1]) {
    //         let res = (await axios.get(`${URL}/courses/${value[0].toString()}/${value[1].toString()}`)).data
    //         // console.log(res);
    //         setRows(res)
    //     }

    // }, [value])



    const handleDateChange = (e) => {
        // console.log(moment(e[0])).format('L');
        // moment(e).format('L')
        // console.log(moment(e[0]).format('YYYY-MM-DD'));
        // console.log(moment(e[1]).format('YYYY-MM-DD'));
    }

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
                        handleDateChange(newValue)
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
                    <InputLabel id="statuses">Statuses</InputLabel>
                    <Select
                        labelId="select-statuses"
                        id="select-statuses"
                        // value={statuses}
                        label="statuses"
                    // onChange={handleChange}
                    >
                        {/* {statuses.map((s, idx) => {
                            return (
                                <MenuItem key={idx} value={s}>{s}</MenuItem>
                            )
                        })} */}
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
