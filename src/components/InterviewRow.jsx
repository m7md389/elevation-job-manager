import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import React, { useEffect, useState } from "react";
import "../styles/interview-row.css";

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DateAdapter from '@mui/lab/AdapterMoment';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import axios from "axios";

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

function ProcessRow(props) {

  let URL = "http://localhost:3001/jobs/Interviews"
  let interviewId = props.inter._id

  const [openAddInterview, setOpenAddInterview] = useState(false);
  const [interviewDate, setInterviewDate] = useState(new Date(Date.now()));
  const statusOptions = ['','Waiting', 'Rejected', 'Passed'];
  const typeOptions = ['','HR', 'Phone Interview', 'Technical', 'HomeWork' , 'Contract'];
  const [typeOption,setTypeOption] = useState(typeOptions[0])
  const [statusOption,setStatusOption] = useState(statusOptions[0])

  const [interviewInputs , setInterviewInputs] = useState({description: props.inter.description || '', date: props.inter.date, link: props.inter.link || ''})

  const handleDateChange = (newValue) => {
    setInterviewDate(newValue);
  };

  const handleEditInterviewOpen = () =>{
    setOpenAddInterview(true)
  }

  const handleEditInterviewClose = () =>{
    setOpenAddInterview(false)
  }

  const handleStatusChange = e =>{
    setStatusOption(e.value)
  }


  const handleTypeChange = e =>{
    setTypeOption(e.value)
  }

  const handleEditInterview = () => {
    if(!interviewInputs.description || !interviewInputs.link || !interviewDate || !statusOption || !typeOption){return}
    let editedInterview = {
      description: interviewInputs.description,
      date: interviewDate,
      link: interviewInputs.link,
      status: statusOption,
      type: typeOption,
      interviewId: interviewId
    }
    axios.put(`${URL}`,editedInterview)
    .then(() => {
      setOpenAddInterview(false);
      console.log(props.refresh);
      props.setRefresh(props.refresh+1)
    })
  }

  const handleInterviewInputChange = (event , key) => {
    let tempInterviewInputs = {...interviewInputs}
    tempInterviewInputs[key] = event.target.value
    setInterviewInputs(tempInterviewInputs)
  }

  const handleDeleteInterview = () => {
    console.log("hello");
    axios.delete(`${URL}`,{ data: { interviewId: interviewId } })
    .then(()=>{
      props.setRefresh(props.refresh+1)
      setOpenAddInterview(false);
    })
  }

  const interview = props.inter;
  return (
    <div className="interviews">
      <p>{interview.type}</p>
      <p>{interview.date}</p>
      <p>{interview.status}</p>
      <p>{interview.description}</p>
      <div className="link">
        <a href="">link</a>
        <div className="edit-icon">
          <div>
          {/* handleAddInterviewClickOpen */}
            <Stack direction="row" spacing={2}>
              <ModeEditOutlineOutlinedIcon style={{ color: "#2196f3" }} onClick={handleEditInterviewOpen} variant="outlined"/>
            </Stack>
            <Dialog open={openAddInterview} onClose={handleEditInterviewClose}>
                <DialogTitle>Edit Interview :</DialogTitle>
                <DialogContent> 
                    <TextField autoFocus margin="dense" onChange= {(e) => {handleInterviewInputChange(e,"description")}} value={interviewInputs.description} id="description" label="description" type="text" fullWidth variant="standard" required/><br/>
                    <Dropdown options={typeOptions} onChange={(e) => {handleTypeChange(e)}} value={typeOption} placeholder="Type" required/> <br/>
                    <Dropdown options={statusOptions} onChange={(e) => {handleStatusChange(e)}} value={statusOption} placeholder="Status" required/><br/>
                    <div className='datePicker'>
                        <LocalizationProvider dateAdapter={DateAdapter}><MobileDatePicker label="Date mobile" inputFormat="DD/MM/yyyy" value={interviewDate} onChange={handleDateChange} renderInput={(params) => <TextField {...params} />}/></LocalizationProvider>
                    </div><br/>
                    <TextField autoFocus margin="dense" onChange= {(e) => {handleInterviewInputChange(e,"link")}} value={interviewInputs.link} id="link" label="Link(Invitation - Zoom)" type="text" fullWidth variant="standard" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditInterviewClose}>Cancel</Button>
                    <Button onClick={() => handleEditInterview()}>Save</Button>
                    <Button onClick={() => handleDeleteInterview()}>Delete</Button>
                </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>
      {/* <p>{interview.link}</p> */}
    </div>
  );
}

export default ProcessRow;
