import http from "../services/httpService";
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Title from "./common/Title";

function Charts() {
  let URL = "/courses";

  const charTitles = ["Working Students", "Courses", "Cohorts"];
  const [chosenChart, setChosenChart] = useState("");
  const [allData, setAllData] = useState([]);
  const [workingStudentsTitle, setWorkingStudentsTitle] = useState({ title: "Working students in all courses" });
  const [coursesTitle, setCoursesTitle] = useState({ title: "Working students by course" });
  const [cohortTitle, setCohortTitle] = useState({ title: "Data by cohort" });

  const [selectedCourse, setSelectedCourse] = useState('')

  const [data, setData] = useState([]);
  // const [refresh, setRefresh] = useState(1);
  // const [showCohorts, setShowCohorts] = useState("none");
  const [chosenCohort, setChosenCohort] = useState("All Cohorts");
  const [cohorts, setCohorts] = useState([])
  const [showCohort, setShowCohort] = useState([])
  const [courses, setCourses] = useState([])



  // ['all cohorts', 'working']
  // ['searching', 5]
  // ['working', 3]
  // ['studding', 1]

  const getCohortByCourse = selectedCourse => {
    let [course] = allData.filter(c => c.title === selectedCourse)
    let cohort = course.cohorts.map(c => c.name)
    setCohorts(['All Cohorts', ...cohort])//put selected course cohort into the cohorts
  }

  useEffect(async () => {
    if (selectedCourse) {
      getCohortByCourse(selectedCourse);
      // owCohort
      setShowCohort(showCohortOnChart(chosenCohort))

    }

  }, [selectedCourse])

  useEffect(async () => {
    let courses = (await http.get(`${URL}`)).data;
    setAllData(courses);
    setData(getWorkingStudents(courses));
    setCourses(await getCourses())
  }, []);

  const getWorkingStudents = (courses) => {
    let working = 0,
      searching = 0;
    courses.forEach((course) => {
      course.cohorts.forEach((cohort) => {
        cohort.users.forEach((user) => {
          if (user.role !== 'admin' && user.status === "working") {
            working++;
          } else if (user.role !== "admin") {
            searching++;
          }
        });
      });
    });
    return [
      ["status", "status per all courses"],
      ["searching", searching],
      ["working", working]
    ];
  };

  const getCourses = async () => {
    let arr = [];
    let res = await http.get(URL + "/names");
    res.data.forEach((course, idx) => {
      if (idx == 0) {
        arr.push(["Courses", "working"]);
      }
      arr.push([course.title, (course.working * course.studNum) / 100]);
    });

    return arr;
  };


  const showCohortOnChart = cohortName => {
    let result = []
    let searching = 0, working = 0, studding = 0, noInfo = 0
    let [course] = allData.filter(c => c.title === selectedCourse)

    if (cohortName === 'All Cohorts') {

      result.push(['All Cohorts', 'status'])
      // search by all cohorts
      course.cohorts.map(c => {
        c.users.map(u => {
          if (u.role != 'admin' && u.status === 'searching')
            searching++;
          else if (u.role != 'admin' && u.status === 'working')
            working++
          else if (u.role != 'admin' && u.status === 'studying')
            studding++;
          else if (u.role != 'admin')
            noInfo++;
        })
      })
      result.push(['searching', searching],
        ['working', working],
        ['studding', studding],
        ['no info', noInfo])
    } else {
      result.push([cohortName, 'status'])
      let [specificCohort] = course.cohorts.filter(c => c.name === cohortName)
      specificCohort.users.map(u => {
        if (u.role != 'admin' && u.status === 'searching')
          searching++;
        else if (u.role != 'admin' && u.status === 'working')
          working++
        else if (u.role != 'admin' && u.status === 'studying')
          studding++;
        else if (u.role != 'admin')
          noInfo++;
      })
      result.push(['searching', searching],
        ['working', working],
        ['studding', studding],
        ['no info', noInfo])
    }
    return result;
  }


  const handleCohortChange = (e) => {
    setChosenCohort(e.target.value)
    setShowCohort(showCohortOnChart(e.target.value))
  }

  return (
    <div >

      <Chart
        chartType="PieChart"
        data={data}
        options={workingStudentsTitle}
        width={"100%"}
        height={"400px"}
      />

      <Chart
        chartType="PieChart"
        data={courses}
        options={coursesTitle}
        width={"100%"}
        height={"400px"}
        chartEvents={[
          {
            eventName: "ready",
            callback: ({ chartWrapper, google }) => {
              const chart = chartWrapper.getChart();
              google.visualization.events.addListener(chart, 'click', (e) => {
                setSelectedCourse(chart.ha.C[Number.parseInt(e.targetID.split('#')[1])].title)
                setChosenCohort("All Cohorts");

              })
            }
          }
        ]}
      />



      {selectedCourse ? (

        <div style={{ display: 'grid', justifyItems: 'center' }}>
          {/* <hr /> */}
          <div style={{ width: '30%', margin: '30px 0' }}>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="statuses">Select Chart :</InputLabel>
                <Select
                  labelId="select-Cohort"
                  id="select-Cohort"
                  value={chosenCohort}
                  label="Cohort"
                  onChange={handleCohortChange}
                >
                  {cohorts.map((cohortName, idx) => {
                    return (
                      <MenuItem key={idx} value={cohortName}>
                        {cohortName}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </div>

          <Chart
            chartType="PieChart"
            data={showCohort}
            options={cohortTitle}
            width={"100%"}
            height={"400px"}
          />
        </div>
      ) : null}

    </div>
  );
}

export default Charts;
