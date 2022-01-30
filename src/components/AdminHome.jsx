import React, { useEffect, useState } from "react";
import { observer, inject } from "mobx-react";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import Course from "./Course";
import "../styles/admin-home.css";
import http from "../services/httpService";
import Title from "./common/Title";
import "reactjs-popup/dist/index.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

function AdminHome() {
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [courseTitle, setCourseTitle] = useState("");

  useEffect(async () => {
    let res = (await http.get(`/courses/names`)).data;
    setCourses(res);
  }, []);

  useEffect(async () => {
    // setCourses(res);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleInputChange = (e) => {
    setCourseTitle(e.target.value);
  };

  const handleAddCourse = async () => {
    if (!courseTitle) return;

    let updatedCourses = (await http.post(`/courses`, { title: courseTitle }))
      .data;
    setCourses(updatedCourses);
    setOpen(false);
  };

  return (
    <div>
      <Title text="Home Page" />

      <div className="add-course-container">
        <AddIcon onClick={handleOpen} className="add-icon" />
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Course :</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            onChange={(e) => {
              handleInputChange(e);
            }}
            value={courseTitle}
            id="title"
            label="course Title"
            type="text"
            fullWidth
            variant="standard"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddCourse}>Save</Button>
        </DialogActions>
      </Dialog>

      <div className="page-container">
        {courses.map((course) => (
          <Link
            className="course-link"
            key={course.title}
            to={`/courses/${course.title}`}
          >
            <Course course={course} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default inject()(observer(AdminHome));
