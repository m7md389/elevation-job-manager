import React, { useState, useEffect } from "react";
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
import axios from "axios";

const Course = () => {
  const URL = "http://localhost:3001";
  const params = useParams();
  const navigate = useNavigate();

  const [refresh, setRefresh] = useState(1);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date(Date.now()));
  const [course, setCourse] = useState();
  const [filteredCohorts, setFilteredCohorts] = useState();
  const [cohort, setCohort] = useState("all-cohorts");
  const [selectedStatus, setSelectedStatus] = useState("all-statuses");

  const [cohortName, setCohortName] = useState("");

  useEffect(async () => {
    let c = await courseService.getCourseDetails(params.courseName);
    setFilteredCohorts(c.cohorts);
    setCourse(c);
  }, [refresh]);

  useEffect(async () => {
    if (!course) return null;
    if (cohort === "all-cohorts" || cohort === "") {
      setFilteredCohorts(course.cohorts);
    } else {
      setFilteredCohorts([course.cohorts.find((c) => c.name === cohort)]);
    }
  }, [cohort]);

  const handleRowClick = (studentId) => {
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

  const getTableRows = () => {
    let users = [];
    filteredCohorts.forEach((cohort) => {
      cohort.users.forEach((user) => {
        if (
          selectedStatus === "all-statuses" ||
          user.status === selectedStatus
        ) {
          users.push({
            _id: user._id,
            name: user.name,
            phone: user.phone,
            cohort: cohort.name,
            status: user.status
          });
        }
      });
    });
    return users;
  };

  const getCohorts = () => {
    let cohorts = [];
    course.cohorts.forEach((cohort) => {
      cohorts.push(cohort);
    });
    return cohorts;
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
    axios.post(`${URL}/courses/cohort`, Cohort).then(() => {
      setRefresh(refresh + 1);
    });
    setOpen(false);
  };

  if (!course) return null;
  if (course.error) return <PageNotFound />;

  const cohorts = getCohorts();
  const statuses = getStatuses();

  return (
    <div className="course-container">
      <Title text={course.title} />
      <div>
        <Stack direction="row" spacing={2}>
          <AddIcon
            onClick={handleClickOpen}
            variant="outlined"
            className="add-icon"
          />
        </Stack>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Cohort :</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              onChange={(e) => {
                handleInputChange(e, "name");
              }}
              value={cohortName}
              id="cohortName"
              label="Cohort Name"
              type="text"
              fullWidth
              variant="standard"
              required
            />
            <div className="datePicker">
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAddCohort}>Add</Button>
          </DialogActions>
        </Dialog>
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
              label="statuses"
              onChange={handleStatusChange}
            >
              <MenuItem value={"all-statuses"} key={"all-statuses"}>
                {"all-statuses"}
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
                onClick={() => handleRowClick(row._id)}
                id="1212121212"
              >
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
