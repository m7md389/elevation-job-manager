import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { observer, inject } from "mobx-react";
import httpService from "../services/httpService";
import PageNotFound from "./PageNotFound";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "../styles/detailed-course.css";

const Course = () => {
  const params = useParams();

  let [course, setCourse] = useState();

  useEffect(async () => {
    const courseData = await httpService.getCourseDetails(params.courseId);
    // if (!!courseData.error) {
    //   return <h1>a</h1>;
    // }
    setCourse(courseData);
  }, []);

  if (!course) return null;

  const handleRowClick = (userId) => {
    console.log(userId);
  };

  const getTableRows = () => {
    let users = [];
    course.cohorts.forEach((cohort) => {
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

  if (!course) return null;
  if (course.error) return <PageNotFound />;

  return (
    <div className="course-container">
      <div className="course-title">
        <h1>{course.title}</h1>
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
