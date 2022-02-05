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
import ElevationButton from "./common/ElevationButton";
import { toast } from "react-toastify";

import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";

import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

function AdminHome() {
  const [courses, setCourses] = useState([]);
  const [coursesOptions, setCoursesOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [refresh, setRefresh] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(async () => {
    let res = (await http.get(`/courses/names`)).data;
    if (res.error) {
      return setCourses([]);
    }
    setCourses(res);
  }, [refresh]);

  useEffect(async () => {
    let coursesNames = [];
    courses.forEach((course) => {
      if (!coursesNames.includes(course.title)) {
        coursesNames.push(course.title);
      }
    });
    setCoursesOptions(coursesNames);
  }, [courses]);

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
    if (updatedCourses.error) {
      return;
    }
    setCourses(updatedCourses);
    setOpen(false);
  };

  const [openEditCourse, setOpenEditCourse] = useState(false);

  const handleEditCourseOpen = () => {
    setOpenEditCourse(true);
  };

  const handleEditCourseClose = () => {
    setOpenEditCourse(false);
  };

  const handleCourseInputChange = (event) => {
    setCourseTitle(event.target.value);
  };

  const handleCourseOptionChange = (e) => {
    setSelectedCourse(e.value);
    setCourseTitle(e.value);
  };

  const handleEditCourse = () => {
    if (!selectedCourse || !courseTitle) {
      return;
    }
    http
      .put(`/courses`, {
        data: { title: selectedCourse, newTitle: courseTitle }
      })
      .then(() => {
        setRefresh(refresh + 1);
        setOpenEditCourse(false);
      });
  };

  const handleDeleteCourse = () => {
    if (!coursesOptions) {
      return;
    }
    http.delete(`/courses`, { data: { title: courseTitle } }).then((res) => {
      if (res.data.error) {
        toast.error("Current password not match the current password");
      }
      setRefresh(refresh + 1);
      setOpenEditCourse(false);
    });
  };

  return (
    <div>
      <ElevationButton />
      <Title text="Home Page" />

      <div className="add-course-container">
        <AddIcon onClick={handleOpen} className="add-icon" />
        <ModeEditOutlineOutlinedIcon
          onClick={handleEditCourseOpen}
          variant="outlined"
        />
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
      <Dialog
        className="editCourse"
        open={openEditCourse}
        onClose={handleEditCourseClose}
      >
        <DialogTitle>Edit Course :</DialogTitle>
        <DialogContent>
          <Dropdown
            options={coursesOptions}
            onChange={(e) => {
              handleCourseOptionChange(e);
            }}
            value={selectedCourse}
            placeholder="Course"
            required
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
