import * as React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import auth from "../services/authService";
import http from "../services/httpService";
import Title from "./common/Title";
import Job from "./Job";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "../styles/Student.css";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DateAdapter from "@mui/lab/AdapterMoment";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

import "../styles/Student.css";

export default function Student() {
  let URL = "/jobs";

  const params = useParams();
  const currentUser = auth.getCurrentUser();

  const userId = params.id || currentUser._id;
  const [date, setDate] = useState(new Date(Date.now()));
  const [refresh, setRefresh] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [jobsInputs, setJobsInputs] = useState({
    title: "",
    link: "",
    company: ""
  });
  const [userInfo, setUserInfo] = useState({});
  const statusesForAddJob = ["Applied", "Accepted", "waiting", "no reply"];
  const [userCohort, setUserCohort] = useState({});
  const [company, setCompany] = useState("All");
  const [status, setStatus] = useState("All");
  const [statusOption, setStatusOption] = useState(statusesForAddJob[0]);

  const getJobs = async () => {
    let tempJobs = [];
    let userJobs = (await http.get(`${URL}/${userId}`)).data;
    userJobs.jobs.forEach((job) => {
      if (company !== "All" || status !== "All") {
        if (
          job.company.toLowerCase() === company &&
          job.status.toLowerCase() === status
        ) {
          tempJobs.push(job);
        } else {
          if (
            company &&
            status === "All" &&
            job.company.toLowerCase() === company
          ) {
            tempJobs.push(job);
          }
          if (
            status &&
            company === "All" &&
            job.status.toLowerCase() === status
          ) {
            tempJobs.push(job);
          }
        }
      } else {
        tempJobs.push(job);
      }
    });
    setJobs(userJobs.jobs);
    setUserInfo(userJobs);
    setFilteredJobs(tempJobs);
  };

  React.useEffect(async () => {
    let URL = "/cohorts/courses";
    let cohort = (await http.get(`${URL}/${userId}`)).data;
    setUserCohort(cohort);
  }, []);

  React.useEffect(async () => {
    getJobs();
  }, [refresh]);

  React.useEffect(async () => {
    getJobs();
  }, [company, status]);

  const handleCompanyChange = (event) => {
    setCompany(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDateChange = (newValue) => {
    setDate(newValue);
  };

  const handleAddStatusChange = (e) => {
    setStatusOption(e.value);
  };

  const handleInputChange = (event, key) => {
    let tempJobsInputs = { ...jobsInputs };
    tempJobsInputs[key] = event.target.value;
    setJobsInputs(tempJobsInputs);
  };

  const handleAddJob = () => {
    if (
      !jobsInputs.title ||
      !jobsInputs.link ||
      !jobsInputs.company ||
      !date ||
      !statusOption
    ) {
      return;
    }
    let newJob = {
      title: jobsInputs.title,
      link: jobsInputs.link,
      company: jobsInputs.company,
      date: date,
      status: statusOption,
      userId: userId
    };
    http.post(`${URL}`, newJob).then(() => {
      setRefresh(refresh + 1);
    });
    setOpen(false);
  };

  const getCompanies = () => {
    let companies = ["All"];
    jobs.forEach((job) => {
      if (!companies.includes(job.company.toLowerCase())) {
        companies.push(job.company.toLowerCase());
      }
    });
    return companies;
  };

  const getStatuses = () => {
    let statuses = ["All"];
    jobs.forEach((job) => {
      if (!statuses.includes(job.status.toLowerCase())) {
        statuses.push(job.status.toLowerCase());
      }
    });
    return statuses;
  };

  if (!params || !userId) return null;
  const companies = getCompanies();
  const statuses = getStatuses();

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 40 * 4.5 + 5,
        width: 250
      }
    }
  };

  return (
    <div>
      <Title text="Home" />

      <div className="student-page-container">
        <div className="student-details">
          <p>
            Name: <span>{userInfo.name}</span>
          </p>
          <p>
            Course: <span>{userCohort.course}</span>
          </p>
          <p>
            Cohort: <span>{userCohort.cohort}</span>{" "}
          </p>
          <p>
            Email: <span>{userInfo.email}</span>
          </p>
          <p>
            City: <span>{userInfo.city}</span>
          </p>
          <p>
            Phone: <span>{userInfo.phone}</span>
          </p>
        </div>
        <div className="filters-detail">
          <div className="cont">
            <Box sx={{ minWidth: 120 }} className="box">
              <FormControl fullWidth>
                <InputLabel id="companies">Companies</InputLabel>
                <Select
                  MenuProps={MenuProps}
                  labelId="select-companies"
                  id="select-companies"
                  value={company}
                  label="companies"
                  onChange={handleCompanyChange}
                >
                  {companies.map((c, idx) => {
                    return (
                      <MenuItem key={idx} value={c}>
                        {c}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </div>
          <div className="cont">
            <Box sx={{ minWidth: 120 }} className="box">
              <FormControl fullWidth>
                <InputLabel id="statuses">Statuses</InputLabel>
                <Select
                  MenuProps={MenuProps}
                  labelId="select-statuses"
                  id="select-statuses"
                  value={status}
                  label="statuses"
                  onChange={handleStatusChange}
                >
                  {statuses.map((s, idx) => {
                    return (
                      <MenuItem key={idx} value={s}>
                        {s}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </div>
        </div>

        <div>
          {" "}
          <div className="student-page-container">
            <Stack direction="row" spacing={2}>
              <Button className="add-job-btn" onClick={handleClickOpen} variant="outlined">
                Add Job
              </Button>
            </Stack>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Add Job :</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  onChange={(e) => {
                    handleInputChange(e, "title");
                  }}
                  value={jobsInputs.title}
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
                    handleInputChange(e, "link");
                  }}
                  value={jobsInputs.link}
                  id="link"
                  label="Job Link"
                  type="text"
                  fullWidth
                  variant="standard"
                  required
                  className="job-link"
                />
                <div className="datePicker spacer">
                  <LocalizationProvider dateAdapter={DateAdapter}>
                    <MobileDatePicker
                      label="Date"
                      inputFormat="DD/MM/yyyy"
                      value={date}
                      onChange={handleDateChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>
                <Dropdown
                  options={statusesForAddJob}
                  onChange={(e) => {
                    handleAddStatusChange(e);
                  }}
                  value={statusOption}
                  placeholder="Status"
                  required
                  className="spacer"
                />
                <TextField
                  autoFocus
                  margin="dense"
                  onChange={(e) => {
                    handleInputChange(e, "company");
                  }}
                  value={jobsInputs.company}
                  id="company"
                  label="Company"
                  type="text"
                  fullWidth
                  variant="standard"
                  required
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleAddJob}>Add</Button>
              </DialogActions>
            </Dialog>
          </div>

          <hr />


          <div className="jobs-title">
            <div>Job Name</div>
            <div className="vLine">Company</div>
            <div className="vLine">Date</div>
            <div className="vLine">Last Interview</div>
            <div className="vLine">Status</div>
          </div>
          <div className="rows">
            {filteredJobs.map((j, idx) => {
              return (
                <Job
                  userId={userId}
                  refresh={refresh}
                  setRefresh={setRefresh}
                  key={idx}
                  job={j}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
