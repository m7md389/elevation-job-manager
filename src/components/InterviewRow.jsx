import React, { useEffect, useState } from "react";
import Dropdown from "react-dropdown";

import http from "../services/httpService";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DialogTitle from "@mui/material/DialogTitle";
import DateAdapter from "@mui/lab/AdapterMoment";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import "react-dropdown/style.css";
import "../styles/interview-row.css";

function ProcessRow(props) {
  let URL = "/jobs/Interviews";
  let interviewId = props.inter._id;

  const [openAddInterview, setOpenAddInterview] = useState(false);
  const [interviewDate, setInterviewDate] = useState(new Date(Date.now()));
  const statusOptions = ["Waiting", "Rejected", "Passed"];
  const typeOptions = [
    "HR",
    "Phone Interview",
    "Technical",
    "HomeWork",
    "Contract"
  ];
  const [typeOption, setTypeOption] = useState(typeOptions[0]);
  const [statusOption, setStatusOption] = useState(statusOptions[0]);

  const [interviewInputs, setInterviewInputs] = useState({
    description: props.inter.description || "",
    date: props.inter.date,
    link: props.inter.link || ""
  });

  const handleDateChange = (newValue) => {
    setInterviewDate(newValue);
  };

  const handleEditInterviewOpen = () => {
    setOpenAddInterview(true);
  };

  const handleEditInterviewClose = () => {
    setOpenAddInterview(false);
  };

  const handleStatusChange = (e) => {
    setStatusOption(e.value);
  };

  const handleTypeChange = (e) => {
    setTypeOption(e.value);
  };

  const handleEditInterview = () => {
    if (
      !interviewInputs.description ||
      !interviewInputs.link ||
      !interviewDate ||
      !statusOption ||
      !typeOption
    ) {
      return;
    }
    let editedInterview = {
      description: interviewInputs.description,
      date: interviewDate,
      link: interviewInputs.link,
      status: statusOption,
      type: typeOption,
      interviewId: interviewId
    };
    http.put(`${URL}`, editedInterview).then(() => {
      setOpenAddInterview(false);
      props.setRefresh(props.refresh + 1);
    });
  };

  const handleInterviewInputChange = (event, key) => {
    let tempInterviewInputs = { ...interviewInputs };
    tempInterviewInputs[key] = event.target.value;
    setInterviewInputs(tempInterviewInputs);
  };

  const handleDeleteInterview = () => {
    http.delete(`${URL}`, { data: { interviewId: interviewId } }).then(() => {
      props.setRefresh(props.refresh + 1);
      setOpenAddInterview(false);
    });
  };

  const interview = props.inter;
  return (
    <div className="interviews">
      <p>{interview.type}</p>
      <p>{interview.date}</p>
      <p>{interview.status}</p>
      <p className="hidden-long-description">{interview.description}</p>
      <div className="link">

        
        {interview.link ? <a target='_blank' href={interview.link}><OpenInNewIcon /></a> : <a></a>}
        
        <div className="edit-icon">
          <div>
            {/* handleAddInterviewClickOpen */}
            <Stack direction="row" spacing={2}>
              <ModeEditOutlineOutlinedIcon
                className="edit-inter-hover"
                onClick={handleEditInterviewOpen}
                variant="outlined"
              />
            </Stack>
            <Dialog open={openAddInterview} onClose={handleEditInterviewClose}>
              <DialogTitle>Edit Interview :</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  onChange={(e) => {
                    handleInterviewInputChange(e, "description");
                  }}
                  value={interviewInputs.description}
                  id="description"
                  label="description"
                  type="text"
                  fullWidth
                  variant="standard"
                  required
                  className="spacer"
                />
                <Dropdown
                  options={typeOptions}
                  onChange={(e) => {
                    handleTypeChange(e);
                  }}
                  value={typeOption}
                  placeholder="Type"
                  required
                  className="spacer"
                />{" "}
                <Dropdown
                  options={statusOptions}
                  onChange={(e) => {
                    handleStatusChange(e);
                  }}
                  value={statusOption}
                  placeholder="Status"
                  required
                  className="spacer"
                />
                <div className="datePicker spacer">
                  <LocalizationProvider dateAdapter={DateAdapter}>
                    <MobileDatePicker
                      label="Date mobile"
                      inputFormat="DD/MM/yyyy"
                      value={interviewDate}
                      onChange={handleDateChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>
                <TextField
                  autoFocus
                  margin="dense"
                  onChange={(e) => {
                    handleInterviewInputChange(e, "link");
                  }}
                  value={interviewInputs.link}
                  id="link"
                  label="Link(Invitation - Zoom)"
                  type="text"
                  fullWidth
                  variant="standard"
                  className="spacer"
                />
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
