import React from "react";
import { useParams } from "react-router-dom";
import { observer, inject } from "mobx-react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "../styles/course.css";

const Course = () => {
  const params = useParams();

  const course = {
    id: 15234232,
    name: "Full Stack",
    cohorts: [
      {
        name: "cohort-1",
        users: [
          {
            id: 2201,
            name: "John",
            phone: "053123123",
            status: "working"
          }
        ]
      },
      {
        name: "cohort-3",
        users: [
          {
            id: 2203,
            name: "Eric",
            phone: "056713098",
            status: "no-info"
          }
        ]
      },
      {
        name: "cohort-3",
        users: [
          {
            id: 2203,
            name: "Eric",
            phone: "056713098",
            status: "no-info"
          }
        ]
      },
      {
        name: "cohort-3",
        users: [
          {
            id: 2203,
            name: "Eric",
            phone: "056713098",
            status: "no-info"
          }
        ]
      },
      {
        name: "cohort-3",
        users: [
          {
            id: 2203,
            name: "Eric",
            phone: "056713098",
            status: "no-info"
          }
        ]
      },
      {
        name: "cohort-3",
        users: [
          {
            id: 2203,
            name: "Eric",
            phone: "056713098",
            status: "no-info"
          }
        ]
      },
      {
        name: "cohort-3",
        users: [
          {
            id: 2203,
            name: "Eric",
            phone: "056713098",
            status: "no-info"
          }
        ]
      },
      {
        name: "cohort-4",
        users: [
          {
            id: 2204,
            name: "Dylan",
            phone: "056050025",
            status: "studying"
          }
        ]
      }
    ]
  };

  const handleRowClick = () => {};

  const getTableRows = () => {
    let users = [];
    course.cohorts.forEach((cohort, i) => {
      cohort.users.forEach((user) => {
        users.push({
          name: user.name,
          phone: user.phone,
          cohort: cohort.name,
          status: user.status
        });
      });
    });
    return users;
  };

  return (
    <div className="course-container">
      <h1 className="course-title">{course.name}</h1>

      <TableContainer component={Paper} className="table-container2">
        <div className="table-container">
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Phone</TableCell>
                <TableCell align="center">Cohort</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getTableRows().map((row, index) => (
                <TableRow
                  className="table-row"
                  key={index}
                  onClick={handleRowClick}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{row.name}</TableCell>
                  <TableCell align="center">{row.phone}</TableCell>
                  <TableCell align="center">{row.cohort}</TableCell>
                  <TableCell align="center">{row.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TableContainer>
    </div>
  );
};

export default inject()(observer(Course));