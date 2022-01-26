import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer, inject } from "mobx-react";
import httpService from "../services/httpService";
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

const Course = () => {
  const params = useParams();
  const navigate = useNavigate();

  let [course, setCourse] = useState();
  let [filteredCohorts, setFilteredCohorts] = useState();
  let [cohort, setCohort] = React.useState("all-cohorts");

  useEffect(async () => {
    let c = await httpService.getCourseDetails(params.courseName);
    setFilteredCohorts(c.cohorts);
    setCourse(c);
  }, []);

  useEffect(async () => {
    if (!course) return null;
    if (cohort === "all-cohorts") {
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

  const getTableRows = () => {
    let users = [];
    filteredCohorts.forEach((cohort) => {
      cohort.users.forEach((user) => {
        users.push({
          _id: user._id,
          name: user.name,
          phone: user.phone,
          cohort: cohort.name,
          status: user.status
        });
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

  if (!course) return null;
  if (course.error) return <PageNotFound />;

  const cohorts = getCohorts();

  return (
    <div className="course-container">
      <Title text={course.title} />

      <div classNamee="filters-detail box">
        <Box id="box" sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="cohorts">Cohorts</InputLabel>
            <Select
              labelId="select-cohort"
              id="select-cohort"
              value={cohort.name}
              label="cohorts"
              onChange={handleChange}
            >
              <MenuItem value={"all-cohorts"} key={"all-cohorts"}>
                {"all-cohorts"}
              </MenuItem>
              {cohorts.map((cohort, idx) => {
                return (
                  <MenuItem value={cohort.name} key={cohort.name}>
                    {cohort.name}
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
