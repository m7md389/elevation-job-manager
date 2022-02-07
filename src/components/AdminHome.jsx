import React, { useEffect, useState } from "react";
import { observer, inject } from "mobx-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import http from "../services/httpService";
import Title from "./common/Title";
import Course from "./Course";

// import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";

import "../styles/admin-home.css";
import "reactjs-popup/dist/index.css";

function AdminHome() {
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [refresh, setRefresh] = useState(1);
  const [selectedCourseToEdit, setSelectedCourseToEdit] = useState("");

  useEffect(async () => {
    let res = (await http.get(`/courses/names`)).data;
    if (res.error) {
      return setCourses([]);
    }
    setCourses(res);
  }, [refresh]);

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

    let updatedCourses = await http.post(`/courses`, { title: courseTitle });
    if (updatedCourses.data.error) {
      toast.error("Error adding course.");
    } else {
      toast.success("Course added successfully.");
    }
    setRefresh(refresh + 1);
    setOpen(false);
  };

  const [openEditCourse, setOpenEditCourse] = useState(false);

  const handleEditCourseOpen = (e) => {
    setSelectedCourseToEdit(e.target.closest("div").className);
    setOpenEditCourse(true);
  };

  const handleEditCourseClose = () => {
    setOpenEditCourse(false);
  };

  const handleCourseInputChange = (event) => {
    setCourseTitle(event.target.value);
  };

  const handleEditCourse = () => {
    if (!selectedCourseToEdit || !courseTitle) {
      return;
    }
    http
      .put(`/courses`, {
        data: { title: selectedCourseToEdit, newTitle: courseTitle }
      })
      .then(() => {
        setRefresh(refresh + 1);
        setOpenEditCourse(false);
      });
  };

  const handleDeleteCourse = () => {
    if (!selectedCourseToEdit) {
      return;
    }
    http
      .delete(`/courses`, { data: { title: selectedCourseToEdit } })
      .then((res) => {
        if (res.data.error) {
          toast.error("Can't delete course.");
        }
        setRefresh(refresh + 1);
        setOpenEditCourse(false);
      });
  };

  return (
    <div>
      <Title text="Home Page" />

      <div className="add-course-container">
        {/* <AddIcon onClick={handleOpen} className="add-icon" /> */}

        <Stack  direction="row" spacing={2}>
          <Button className="add-course-icon spacer" onClick={handleOpen} variant="outlined">
            Add Course
          </Button>
        </Stack>
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
            className="spacer"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddCourse}>Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        className="editCourse spacer"
        open={openEditCourse}
        onClose={handleEditCourseClose}
      >
        <DialogTitle>Edit Course :</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            value={selectedCourseToEdit}
            id="title"
            label="Course Title"
            type="text"
            fullWidth
            variant="standard"
            disabled={true}
            className="spacer"
          />
          <TextField
            autoFocus
            margin="dense"
            onChange={(e) => {
              handleCourseInputChange(e);
            }}
            value={courseTitle}
            id="title"
            label="Course Title"
            type="text"
            fullWidth
            variant="standard"
            required
            className="spacer"
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
          <div key={index} className="course-container">
            <div className="course-link">
            <div key={index} className={`${course.title}`}>
              <ModeEditOutlineOutlinedIcon
                onClick={handleEditCourseOpen}
                variant="outlined"
                className="edit-button"
              />
            </div>
              <Link
                className="course-link"
                key={course.title + index}
                to={`/courses/${course.title}`}
              >
                <Course course={course} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default inject()(observer(AdminHome));
