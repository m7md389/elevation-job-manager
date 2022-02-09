import { toast } from "react-toastify";
import Dropdown from "react-dropdown";
import React, { useState } from "react";

import http from "../services/httpService";
import InterviewRow from "./InterviewRow";

import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";
import DialogContentText from "@mui/material/DialogContentText";
import Stack from "@mui/material/Stack";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DateAdapter from "@mui/lab/AdapterMoment";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import "react-dropdown/style.css";
import "../styles/job.css";

function Job(props) {
  let URL = "/jobs";
  const jobId = props.job._id;
  const userId = props.userId
  const [isActive, setActive] = useState(false);
  const [openAddInterview, setOpenAddInterview] = useState(false);
  const [openEditJob, setOpenEditJob] = useState(false);
  const [interviewDate, setInterviewDate] = useState(new Date(Date.now()));
  const [jobDate, setJobDate] = useState(props.job.date);
  const [updateInterviewStatus, setUpdateInterviewStatus] = useState(false);

  const statusOptions = ["waiting", "rejected", "passed"];
  const typeOptions = [
    "hr",
    "phone interview",
    "technical",
    "homework",
    "contract"
  ];
  const statusesForAddJob = ["accepted", "waiting", "applied", "no reply"];

  const [editJobInputs, setEditJobInputs] = useState({
    title: props.job.title,
    status: props.job.status,
    link: props.job.link || "",
    company: props.job.company
  });
  const [editJobStatusOption, setEditJobStatusOption] = useState(
    statusesForAddJob[0]
  );
  const [open, setOpen] = useState(false);
  const [typeOption, setTypeOption] = useState(typeOptions[0]);
  const [statusOption, setStatusOption] = useState(statusOptions[0]);
  const [interviewInputs, setInterviewInputs] = useState({
    description: "",
    Type: "",
    Status: "",
    date: "",
    link: ""
  });

  const handleToggle = () => {
    setActive(!isActive);
  };

  const handleEditJobOpen = () => {
    setOpenEditJob(true);
  };

  const handleEditJobClose = () => {
    setOpenEditJob(false);
  };

  const handleAddInterviewClickOpen = () => {
    setOpenAddInterview(true);
  };

  const handleAddInterviewClickClose = () => {
    setOpenAddInterview(false);
  };

  const handleInterviewInputChange = (event, key) => {
    let tempInterviewInputs = { ...interviewInputs };
    tempInterviewInputs[key] = event.target.value;
    setInterviewInputs(tempInterviewInputs);
  };

  const handleAddInterview = () => {
    let flag = false;
    if (!typeOption || !statusOption || !interviewDate || !job) {
      return;
    }
    for (let i = 0; i < job.interviews.length && !flag; i++) {
      if (job.interviews[i].status.toLowerCase() !== "passed") {
        setOpen(true);
        flag = true;
      }
    }
    let newInterview = {
      description: interviewInputs.description,
      type: typeOption.toLowerCase(),
      status: statusOption.toLowerCase(),
      date: interviewDate,
      link: interviewInputs.link,
      jobId: jobId
    };

    if (updateInterviewStatus || !flag) {
      http.post(`${URL}/Interviews`, newInterview).then(() => {
        if(!job || !userId || !newInterview){toast.error("Item didn't sent to admin please update the admin that you added job")}
        else{
          http.post("/notifications/admin", {userId, newInterview, job}).then(res => {
            if(res.error){toast.error("Error sending job.")}
            else{toast.success("Successfully sended job.")}
          })
        }
        props.setRefresh(props.refresh + 1);
        setOpenAddInterview(false);
      });
    }
  };

  const handleDateChange = (newValue) => {
    setInterviewDate(newValue);
  };

  const handleStatusChange = (e) => {
    setStatusOption(e.value);
  };

  const handleTypeChange = (e) => {
    setTypeOption(e.value);
  };

  const handleEditJobStatusChange = (e) => {
    setEditJobStatusOption(e.value);
  };

  const handleJobInputChange = (event, key) => {
    let tempEditJobInputs = { ...editJobInputs };
    tempEditJobInputs[key] = event.target.value;
    setEditJobInputs(tempEditJobInputs);
  };

  const handleJobDateChange = (newValue) => {
    setJobDate(newValue);
  };

  const handleEditJob = () => {
    if (
      !editJobInputs.title ||
      !editJobInputs.link ||
      !editJobInputs.company ||
      !jobDate ||
      !editJobStatusOption
    ) {
      return;
    }
    let editedJob = {
      title: editJobInputs.title,
      link: editJobInputs.link,
      company: editJobInputs.company,
      status: editJobStatusOption,
      date: jobDate,
      jobId: jobId
    };
    http.put(`${URL}`, editedJob).then(() => {
      props.setRefresh(props.refresh + 1);
      handleEditJobClose(false);
    });
  };

  const handleDeleteJob = () => {
    http.delete(`${URL}`, { data: { jobId: jobId } }).then(() => {
      props.setRefresh(props.refresh + 1);
      handleEditJobClose(false);
    });
  };

  const handleAcceptChangeInterviewsStatus = () => {
    let error = false;
    if (!typeOption || !statusOption || !interviewDate || !job) {
      return;
    }
    for (let i = 0; i < job.interviews.length; i++) {
      if (job.interviews[i].status !== "passed") {
        http
          .put(`${URL}/Interviews/passed`, {
            interviewId: job.interviews[i]._id
          })
          .then((res) => {
            if (res.error) {
              error = true;
            }
          });
      }
    }
    if (error) {
      toast.error("Error updating interviews");
    } else {
      toast.success("All interviews updated successfully");
    }
    let newInterview = {
      description: interviewInputs.description,
      type: typeOption.toLowerCase(),
      status: statusOption.toLowerCase(),
      date: interviewDate,
      link: interviewInputs.link,
      jobId: jobId
    };
    http.post(`${URL}/Interviews`, newInterview).then(() => {
      if(!job || !userId || !newInterview){toast.error("Item didn't sent to admin please update the admin that you added job")}
      else{
        http.post("/notifications/admin", {userId, newInterview, job}).then(res => {
          if(res.error){toast.error("Error sending job.")}
          else{toast.success("Successfully sended job.")}
        })
      }
      props.setRefresh(props.refresh + 1);
    });
    setOpenAddInterview(false);
    setOpen(false);
  };

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const handleClose = () => {
    setUpdateInterviewStatus(false);
    setOpen(false);
    setOpenAddInterview(false);
  };

  const job = props.job;

  return (
    <div className="job-container">
      <div className="job" onClick={handleToggle}>
        <p>{job.title}</p>
        <p>{job.company}</p>
        <p>{job.date}</p>
        <p>
          {job.interviews.length > 0
            ? job.interviews[job.interviews.length - 1].type
            : "none"}
        </p>
        <p>{job.status}</p>
        <div className="job-edit-btns">
          <div>
            <Stack direction="row" spacing={2}>
              <AddCircleOutlinedIcon
                className="edit-inter-hover"
                onClick={handleAddInterviewClickOpen}
                variant="outlined"
              />
            </Stack>
          </div>
          <div>
            <Stack direction="row" spacing={2}>
              <ModeEditOutlineOutlinedIcon
                className="edit-inter-hover"
                onClick={handleEditJobOpen}
                variant="outlined"
              />
            </Stack>
          </div>
        </div>
      </div>

      <Dialog open={openEditJob} onClose={handleEditJobClose}>
        <DialogTitle>Edit Job :</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            onChange={(e) => {
              handleJobInputChange(e, "title");
            }}
            value={editJobInputs.title}
            id="title"
            label="Job Title"
            type="text"
            fullWidth
            variant="standard"
            required
            className="spacer"
          />
          <TextField
            autoFocus
            margin="dense"
            onChange={(e) => {
              handleJobInputChange(e, "link");
            }}
            value={editJobInputs.link}
            id="link"
            label="Job Link"
            type="text"
            fullWidth
            variant="standard"
            required
            className="spacer"
          />
          <Dropdown
            options={statusesForAddJob}
            onChange={(e) => {
              handleEditJobStatusChange(e);
            }}
            value={editJobStatusOption}
            placeholder="Status"
            required
            className="spacer"
          />
          <div className="datePicker spacer">
            <LocalizationProvider dateAdapter={DateAdapter}>
              <MobileDatePicker
                label="Date"
                inputFormat="DD/MM/yyyy"
                value={jobDate}
                onChange={handleJobDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
          <TextField
            autoFocus
            margin="dense"
            onChange={(e) => {
              handleJobInputChange(e, "company");
            }}
            value={editJobInputs.company}
            id="company"
            label="Company"
            type="text"
            fullWidth
            variant="standard"
            required
            className="spacer"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditJobClose}>Cancel</Button>
          <Button onClick={() => handleEditJob()}>Save</Button>
          <Button onClick={() => handleDeleteJob()}>Delete</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openAddInterview} onClose={handleAddInterviewClickClose}>
        <DialogTitle>Add Interview :</DialogTitle>
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
          <Button onClick={handleAddInterviewClickClose}>Cancel</Button>
          <Button onClick={() => handleAddInterview()}>Add</Button>
        </DialogActions>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Update other interviews Status ?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              You can't add interview if you didn't passed the previous once. Do
              you want to let the App update all previous interviews status to
              passed ?.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button onClick={handleAcceptChangeInterviewsStatus}>Agree</Button>
          </DialogActions>
        </Dialog>
      </Dialog>
      <div
        className={
          isActive
            ? "interviews-container display"
            : "interviews-container hide"
        }
      >
        <div className="interviews-header">
          <p >Type</p>
          <p >Date</p>
          <p>Status</p>
          <p>Description</p>
          <p>Link</p>
        </div>

        <div>
          {job.interviews.map((i, idx) => {
            return (
              <div key={idx}>
                <InterviewRow
                  refresh={props.refresh}
                  setRefresh={props.setRefresh}
                  key={idx}
                  inter={i}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Job;
