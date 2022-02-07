import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer, inject } from "mobx-react";
import courseService from "../services/courseService";
import PageNotFound from "./PageNotFound";
import Title from "./common/Title";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "../styles/detailed-course.css";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DateAdapter from "@mui/lab/AdapterMoment";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import http from "../services/httpService";

import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { toast } from "react-toastify";
import { toArray } from "lodash";

const Course = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState();
  const [refresh, setRefresh] = useState(1);
  const [jobsInputs, setJobsInputs] = useState({
    title: "",
    link: "",
    company: "",
    description: ""
  });

  useEffect(async () => {
    let c = await courseService.getCourseDetails(params.courseName);
    setFilteredCohorts(c.cohorts);
    setCourse(c);
  }, [refresh]);

  const getCohorts = () => {
    let cohorts = [];
    if (!course) {
      return cohorts.push("");
    }
    course.cohorts.forEach((cohort) => {
      cohorts.push(cohort);
    });
    return cohorts;
  };

  const cohorts = getCohorts();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [date, setDate] = useState(new Date(Date.now()));
  const [editDate, setEditDate] = useState(new Date(Date.now()));
  const [filteredCohorts, setFilteredCohorts] = useState();
  const [cohort, setCohort] = useState("");
  const [editCohort, setEditCohort] = useState("");
  const [selectedStatus, setSelectedStatus] = useState('All-statuses');
  const [cohortName, setCohortName] = useState("");
  const [cohortEditName, setCohortEditName] = useState("");
  const [sendJobEmails, setSendJobEmails] = useState([]);
  const [selectAllCheckBox, setSelectAllCheckBox] = useState(false);
  const [sendJob, setSendJob] = useState(false);

  useEffect(async () => {
    if (!course) return null;
    if (cohort === "All-cohorts" || !cohort === "") {
      setFilteredCohorts(course.cohorts);
    } else {
      setFilteredCohorts([course.cohorts.find((c) => c.name === cohort)]);
    }
  }, [cohort]);

  const handleRowClick = (studentId, event) => {
    event.stopPropagation();
    navigate(`/student/${studentId}`);
  };

  const handleChange = (event) => {
    setCohort(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleInputChange = (event) => {
    setCohortName(event.target.value);
  };

  const handleSendJobOpen = () => {
    setSendJob(true);
  };

  const handleSendJobClose = () => {
    setSendJob(false);
  };

  const handleSendJobInputChange = (event, key) => {
    let tempSendJobInputs = { ...jobsInputs };
    tempSendJobInputs[key] = event.target.value;
    setJobsInputs(tempSendJobInputs);
  };

  const handleSendJob = () => {
    if (!jobsInputs.link || !sendJobEmails.length) {
      !jobsInputs.link
        ? toast.error("Please add link.")
        : toast.error("No selected users.");
      return null;
    }

    http.post("/notifications", {sendJobEmails , jobsInputs}).then(res => {
      if(res.error){toast.error("Error sending job.")}
      else{toast.success("Successfully sended job.")}
    })
    setSendJob(false);
  };

  const getTableRows = () => {
    let users = [];
    filteredCohorts.forEach((cohort) => {
      cohort.users.forEach((user) => {
        if (
          selectedStatus === "All-statuses" ||
          user.status === selectedStatus
        ) {
          users.push({
            _id: user._id,
            name: user.name,
            phone: user.phone,
            cohort: cohort.name,
            status: user.status,
            email: user.email
          });
        }
      });
    });
    return users;
  };

  const getStatuses = () => {
    let statuses = [];
    course.cohorts.forEach((cohort) => {
      cohort.users.forEach((student) => {
        if (!statuses.includes(student.status) && student.status) {
          statuses.push(student.status);
        }
      });
    });
    return statuses;
  };

  const handleEditCohortOpen = () => {
    setEditOpen(true);
  };

  const handleEditCohortClose = () => {
    setEditOpen(false);
  };

  const handleEditCohortChange = (event) => {
    setEditCohort(event.target.value);
    setCohortEditName(event.target.value);
    let tempCohort = course.cohorts.find(
      (cohort) => cohort.name === event.target.value
    );
    setEditDate(tempCohort.start_date);
  };

  const handleEditCohortInputChange = (event) => {
    setCohortEditName(event.target.value);
  };

  const handleEditDateChange = (newValue) => {
    setEditDate(new Date(newValue));
  };

  const handleDeleteCohort = () => {
    if (!editCohort) {
      return;
    }
    let tempCohort = course.cohorts.find(
      (cohort) => cohort.name === editCohort
    );
    http
      .delete(`/courses/cohorts`, { data: { cohortId: tempCohort._id } })
      .then((res) => {
        if (res.data.error) {
          toast.error("Can't Delete Cohort");
        }
        setRefresh(refresh + 1);
        setEditOpen(false);
      });
  };

  const handleEditCohort = () => {
    if (!editCohort || !cohortEditName || !editDate) {
      return;
    }
    let tempCohort = course.cohorts.find(
      (cohort) => cohort.name === editCohort
    );
    http
      .put(`/courses/cohorts`, {
        data: {
          newName: cohortEditName,
          newDate: editDate.toString(),
          courseId: course._id,
          cohortId: tempCohort._id
        }
      })
      .then((res) => {
        if (res.data.error) {
          toast.error("Can't edit cohort");
        }
        setRefresh(refresh + 1);
        setEditOpen(false);
      });
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

  const handleAddCohort = () => {
    if (!cohortName || !date) {
      return;
    }
    let Cohort = {
      name: cohortName,
      start_date: date,
      courseId: course._id
    };
    http.post(`/courses/cohort`, Cohort).then(() => {
      setRefresh(refresh + 1);
    });
    setOpen(false);
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    let tempEmail = sendJobEmails;
    if (e.target.checked) {
      if (!tempEmail.includes(e.target.value)) {
        tempEmail.push(e.target.value);
      }
    } else if (tempEmail.includes(e.target.value)) {
      tempEmail.splice(tempEmail.indexOf(e.target.value), 1);
    }
    setSendJobEmails(tempEmail);
  };

  const handleSelectAllCheckbox = (e) => {
    let tempAllEmails = [];
    setSelectAllCheckBox(e.target.checked);
    const tableRows = toArray(e.target.closest("table").lastChild.children);
    tableRows.forEach((row) => {
      let tempInput = row.firstChild.firstChild;
      if (e.target.checked) {
        if (!tempAllEmails.includes(tempInput.value))
          tempAllEmails.push(tempInput.value);
        tempInput.checked = true;
      } else {
        tempInput.checked = false;
      }
    });
    if (e.target.checked) {
      setSendJobEmails(tempAllEmails);
    } else {
      setSendJobEmails([]);
    }
  };

  if (!course) return null;
  if (course.error) return <PageNotFound />;

  const statuses = getStatuses();

  return (
    <div className="course-container">
      <Title text={course.title} />

      <div className="filters-detail box">
        <div className="cohort-div">
          <Box className="cohort-div-filter" id="box" sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="cohorts">Cohorts</InputLabel>
              <Select
                labelId="select-cohort"
                id="select-cohort"
                value={cohort}
                label="cohorts"
                onChange={handleChange}
              >
                <MenuItem value={"All-cohorts"} key={"All-cohorts"}>
                  {"All-cohorts"}
                </MenuItem>
                {cohorts.map((cohort, idx) => {
                  return (
                    <MenuItem value={cohort.name} key={idx}>
                      {cohort.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>

          <div className="addd-edit">
            <div className="add-edit-cohort">
              <div className="add-edit-cohort">
                <div className="box">
                  <Stack direction="row" spacing={2}>
                    <AddIcon
                      onClick={handleClickOpen}
                      variant="outlined"
                      className="add-icon spacer"
                    />
                  </LocalizationProvider>
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleAddCohort}>Add</Button>
              </DialogActions>
            </Dialog>
          </div>
          <div className="box">
            <Stack direction="row" spacing={2}>
              <ModeEditOutlineOutlinedIcon
                className="add-icon"
                onClick={handleEditCohortOpen}
                variant="outlined"
              />
            </Stack>
            <Dialog open={editOpen} onClose={handleEditCohortClose}>
              <DialogTitle>Edit Cohorts :</DialogTitle>
              <DialogContent>
                <InputLabel id="cohorts">Cohorts</InputLabel>
                <Select
                  labelId="select-cohort"
                  id="select-cohort"
                  value={editCohort}
                  label="cohorts"
                  onChange={handleEditCohortChange}
                >
                  {cohorts.map((cohort, idx) => {
                    return (
                      <MenuItem value={cohort.name} key={idx}>
                        {cohort.name}
                      </MenuItem>
                    );
                  })}
                </Select>
                <TextField
                  autoFocus
                  margin="dense"
                  onChange={(e) => {
                    handleEditCohortInputChange(e, "name");
                  }}
                  value={cohortEditName}
                  id="cohortName"
                  label="Cohort Name"
                  type="text"
                  fullWidth
                  variant="standard"
                  required
                />
                <div className="editDatePicker">
                  <LocalizationProvider dateAdapter={DateAdapter}>
                    <MobileDatePicker
                      label="edit Date"
                      inputFormat="DD/MM/yyyy"
                      value={editDate}
                      onChange={handleEditDateChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
<<<<<<< Updated upstream
                  </LocalizationProvider>
=======
                  </Stack>
                  <Dialog open={editOpen} onClose={handleEditCohortClose}>
                    <DialogTitle>Edit Cohorts :</DialogTitle>
                    <DialogContent>
                      <InputLabel id="cohorts">Cohorts</InputLabel>
                      <Select
                        labelId="select-cohort"
                        id="select-cohort"
                        value={editCohort}
                        label="cohorts"
                        onChange={handleEditCohortChange}
                        className="spacer"
                      >
                        {cohorts.map((cohort, idx) => {
                          return (
                            <MenuItem value={cohort.name} key={idx}>
                              {cohort.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      <TextField
                        autoFocus
                        margin="dense"
                        onChange={(e) => {
                          handleEditCohortInputChange(e, "name");
                        }}
                        value={cohortEditName}
                        id="cohortName"
                        label="Cohort Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        required
                        className="spacer"
                      />
                      <div className="editDatePicker spacer">
                        <LocalizationProvider dateAdapter={DateAdapter}>
                          <MobileDatePicker
                            label="edit Date"
                            inputFormat="DD/MM/yyyy"
                            value={editDate}
                            onChange={handleEditDateChange}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </LocalizationProvider>
                      </div>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleEditCohortClose}>Cancel</Button>
                      <Button onClick={handleEditCohort}>Save</Button>
                      <Button onClick={handleDeleteCohort}>Delete</Button>
                    </DialogActions>
                  </Dialog>
>>>>>>> Stashed changes
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleEditCohortClose}>Cancel</Button>
                <Button onClick={handleEditCohort}>Save</Button>
                <Button onClick={handleDeleteCohort}>Delete</Button>
              </DialogActions>
            </Dialog>
          </div>
          <div>
            <Stack direction="row" spacing={2}>
              <Button onClick={handleSendJobOpen} variant="outlined">
                Send Job
              </Button>
            </Stack>
            <Dialog open={sendJob} onClose={handleSendJobClose}>
              <DialogTitle>Send Job :</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  onChange={(e) => {
                    handleSendJobInputChange(e, "title");
                  }}
                  value={jobsInputs.title}
                  id="title"
                  label="Job Title"
                  type="text"
                  fullWidth
                  variant="standard"
                  required
                />
                <TextField
                  autoFocus
                  margin="dense"
                  onChange={(e) => {
                    handleSendJobInputChange(e, "link");
                  }}
                  value={jobsInputs.link}
                  id="link"
                  label="Job Link"
                  type="text"
                  fullWidth
                  variant="standard"
                  required
                />
                <TextField
                  autoFocus
                  margin="dense"
                  onChange={(e) => {
                    handleSendJobInputChange(e, "company");
                  }}
                  value={jobsInputs.company}
                  id="company"
                  label="Company"
                  type="text"
                  fullWidth
                  variant="standard"
                  required
                />
                <TextField
                  autoFocus
                  margin="dense"
                  onChange={(e) => {
                    handleSendJobInputChange(e, "description");
                  }}
                  value={jobsInputs.description}
                  id="description"
                  label="description"
                  type="text"
                  fullWidth
                  variant="standard"
                  required
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleSendJobClose}>Cancel</Button>
                <Button onClick={handleSendJob}>Send</Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>
      <div className="filters-detail box">
        <Box id="box" sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="cohorts">Cohorts</InputLabel>
            <Select
              labelId="select-cohort"
              id="select-cohort"
              value={cohort}
              label="cohorts"
              onChange={handleChange}
            >
              <MenuItem value={"all-cohorts"} key={"all-cohorts"}>
                {"all-cohorts"}
              </MenuItem>
              {cohorts.map((cohort, idx) => {
                return (
                  <MenuItem value={cohort.name} key={idx}>
                    {cohort.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <Box id="box" sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="Status">Status</InputLabel>
            <Select
              labelId="select-Status"
              id="select-Status"
              value={selectedStatus}
              label="Statuses"
              onChange={handleStatusChange}
            >
              <MenuItem value={"All-statuses"} key={"All-statuses"}>
                {"All-statuses"}
              </MenuItem>
              {statuses.map((status, idx) => {
                return (
                  <MenuItem value={status} key={idx}>
                    {status}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
      </div>
<<<<<<< Updated upstream
=======

      <div className="send-job-btn spacer">
        <Stack direction="row" spacing={2}>
          <Button onClick={handleSendJobOpen} variant="outlined">
            Send Job
          </Button>
        </Stack>
        <Dialog open={sendJob} onClose={handleSendJobClose}>
          <DialogTitle>Send Job :</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              onChange={(e) => {
                handleSendJobInputChange(e, "title");
              }}
              value={jobsInputs.title}
              id="title"
              label="Job Title"
              type="text"
              fullWidth
              variant="standard"
              required
            />
            <TextField
              autoFocus
              margin="dense"
              onChange={(e) => {
                handleSendJobInputChange(e, "link");
              }}
              value={jobsInputs.link}
              id="link"
              label="Job Link"
              type="text"
              fullWidth
              variant="standard"
              required
            />
            <TextField
              autoFocus
              margin="dense"
              onChange={(e) => {
                handleSendJobInputChange(e, "company");
              }}
              value={jobsInputs.company}
              id="company"
              label="Company"
              type="text"
              fullWidth
              variant="standard"
              required
            />
            <TextField
              autoFocus
              margin="dense"
              onChange={(e) => {
                handleSendJobInputChange(e, "description");
              }}
              value={jobsInputs.description}
              id="description"
              label="description"
              type="text"
              fullWidth
              variant="standard"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSendJobClose}>Cancel</Button>
            <Button onClick={handleSendJob}>Send</Button>
          </DialogActions>
        </Dialog>
      </div>

>>>>>>> Stashed changes
      <TableContainer
        component={Paper}
        sx={{
          width: "80%",
          margin: "0 auto",
          boxShadow: "rgb(102, 123, 145) 0px 0px 25px -10px"
        }}
        className="table-container"
      >
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <input
                  type="checkbox"
                  id="selectAll"
                  defaultChecked={selectAllCheckBox}
                  onClick={handleSelectAllCheckbox}
                />
              </TableCell>
              <TableCell align="center">
                <span className="table-cell">Name</span>
              </TableCell>
              <TableCell align="center">
                <span className="table-cell">Phone</span>
              </TableCell>
              <TableCell align="center">
                <span className="table-cell">Cohort</span>
              </TableCell>
              <TableCell align="center">
                <span className="table-cell">Status</span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getTableRows().map((row, index) => (
              <TableRow
                className="table-row"
                key={index}
                onClick={(event) => handleRowClick(row._id, event)}
                id={row.id}
              >
                <TableCell align="center">
                  <input
                    type="checkbox"
                    id={index}
                    defaultChecked={false}
                    value={row.email}
                    onClick={handleCheckboxClick}
                  />
                </TableCell>
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">{row.phone}</TableCell>
                <TableCell align="center">{row.cohort}</TableCell>
                <TableCell align="center">{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default inject()(observer(Course));
