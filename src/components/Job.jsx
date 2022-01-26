import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DateAdapter from '@mui/lab/AdapterMoment';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import axios from 'axios';

import React, { useState } from 'react';
import '../styles/job.css'
import InterviewRow from './InterviewRow'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';



function Job(props) {
    
    let URL = "http://localhost:3001/jobs"
    const jobId = props.job._id
    const [isActive, setActive] = useState(false);
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(new Date(Date.now()));
    const statusOptions = [
        '','Waiting', 'Rejected', 'Passed'
      ];
    const typeOptions = [
        '','HR', 'Phone Interview', 'Technical', 'HomeWork' , 'Contract'
    ];
    const [typeOption,setTypeOption] = useState(typeOptions[0])
    const [statusOption,setStatusOption] = useState(statusOptions[0])
    const [interviewInputs , setInterviewInputs] = useState({description: "", Type: "", Status: "", date: "", link:""})
    
    const handleToggle = () => {
        setActive(!isActive);
    };
    
    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };
    
    const handleInputChange = (event , key) => {
        let tempInterviewInputs = {...interviewInputs}
        tempInterviewInputs[key] = event.target.value
        setInterviewInputs(tempInterviewInputs)
    }

    const handleAddInterview = (typeOption , statusOption) => {
        if(!typeOption || !statusOption || !date ){return}
        let newInterview = {
            description: interviewInputs.description,
            type: typeOption.toLowerCase(),
            status: statusOption.toLowerCase(),
            date: date,
            link: interviewInputs.link,
            jobId: jobId
        }
    
    axios.post(`${URL}/Interviews`,newInterview).then(()=>{
        props.setRefresh(props.refresh + 1)
    })
    setOpen(false);
};

const handleDateChange = (newValue) => {
    setDate(newValue);
};


const handleStatusChange = e =>{
    setStatusOption(e.value)
}


const handleTypeChange = e =>{
    setTypeOption(e.value)
}

const job = props.job

    return (
        <div >

            <div className='job' onClick={handleToggle} >
                <p>{job.title}</p>
                <p>{job.company}</p>
                <p>{job.date}</p>
                <p>{job.interviews.length > 0 ? job.interviews[job.interviews.length - 1].type : 'none'}</p>
                <p>{job.status}</p>
                <div className='job-edit-btns'>
                <div>
                <Stack direction="row" spacing={2}>
                    <AddCircleOutlinedIcon onClick={handleClickOpen} variant="outlined"/>
                </Stack>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Add Interview :</DialogTitle>
                    <DialogContent> 
                        <TextField autoFocus margin="dense" onChange= {(e) => {handleInputChange(e,"description")}} value={interviewInputs.description} id="description" label="description" type="text" fullWidth variant="standard" required/><br/>
                        <Dropdown options={typeOptions} onChange={(e) => {handleTypeChange(e)}} value={typeOption} placeholder="Type" required/> <br/>
                        <Dropdown options={statusOptions} onChange={(e) => {handleStatusChange(e)}} value={statusOption} placeholder="Status" required/><br/>
                        <div className='datePicker'>
                            <LocalizationProvider dateAdapter={DateAdapter}><MobileDatePicker label="Date mobile" inputFormat="MM/dd/yyyy" value={date} onChange={handleDateChange} renderInput={(params) => <TextField {...params} />}/></LocalizationProvider>
                        </div><br/>
                        <TextField autoFocus margin="dense" onChange= {(e) => {handleInputChange(e,"link")}} value={interviewInputs.link} id="link" label="Link(Invitation - Zoom)" type="text" fullWidth variant="standard" />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={() => handleAddInterview(typeOption , statusOption)}>Add</Button>
                    </DialogActions>
                </Dialog>
            </div>
                    <ModeEditOutlineOutlinedIcon />
                </div>
            </div>

            <div className={isActive ? 'interviews-container display' : 'interviews-container hide'}>

                <div className='interviews-header'>
                    <p>type</p>
                    <p>date</p>
                    <p>status</p>
                    <p>description</p>
                    <p>link</p>
                </div>

                <div>
                    {job.interviews.map((i,idx) => {
                        return (
                            <div key={idx}>
                                <InterviewRow key={idx} inter={i} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default Job;
