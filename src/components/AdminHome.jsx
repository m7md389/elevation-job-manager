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

import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";

function AdminHome() {
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState(false);
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

  const [openEditCourse, setOpenEditCourse] = useState(false);
  const [editJobInputs, setEditJobInputs] = useState({
    title: "course.title"
  });

  const handleEditCourseOpen = () => {
    console.log("hi");
    setOpenEditCourse(true);
  };

  const handleEditCourseClose = () => {
    setOpenEditCourse(false);
  };

  const handleCourseInputChange = (event, key) => {
    let tempEditJobInputs = { ...editJobInputs };
    tempEditJobInputs[key] = event.target.value;
    setEditJobInputs(tempEditJobInputs);
  };

  const handleEditCourse = () => {

  }

  const handleDeleteCourse = () => {

  }

  return (
    <div>
      <Title text="Home Page" />

      <div className="add-course-container">
        <AddIcon onClick={handleOpen} className="add-icon" />
        <ModeEditOutlineOutlinedIcon onClick={handleEditCourseOpen} variant="outlined"/>
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
      <Dialog open={openEditCourse} onClose={handleEditCourseClose}>
        <DialogTitle>Edit Job :</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            onChange={(e) => {
              handleCourseInputChange(e, "title");
            }}
            value={editJobInputs.title}
            id="title"
            label="Job Title"
            type="text"
            fullWidth
            variant="standard"
            required
          />
          <br />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCourseClose}>Cancel</Button>
          <Button onClick={() => handleEditCourse()}>Save</Button>
          <Button onClick={() => handleDeleteCourse()}>Delete</Button>
        </DialogActions>
      </Dialog>

      <div className="page-container">
        {courses.map((course, index) => (
          <Link
            className="course-link"
            key={course.title + index}
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
