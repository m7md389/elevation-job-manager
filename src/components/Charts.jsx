import axios from "axios";
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function Charts() {
    let URL = "http://localhost:3001/courses"

    const charTitles = ['Working Students', 'Courses', 'Cohorts']
    const [chosenChart, setChosenChart] = useState('')
    const [allData, setAllData] = useState([])
    const [options, setOptions] = useState({ title: "Working Students" })
    const [data, setData] = useState([])
    const [refresh, setRefresh] = useState(1)
    const [showCohorts, setShowCohorts] = useState('none')
    const [chosenCohort, setChosenCohort] = useState('All')


    useEffect(async () => {
        let courses = (await axios.get(`${URL}`)).data
        setAllData(courses)
        setData(getWorkingStudents(courses))
    }, [])

    const getWorkingStudents = (courses) => {
        let working = 0, searching = 0;
        courses.forEach((course) => {
            course.cohorts.forEach((cohort) => {
                cohort.users.forEach((user) => {
                    if (user.role === 'user' && user.status === "working") {
                        working++;
                    } else if (user.role === 'user') { searching++ }
                });
            });
        });
        return [['status', 'status per all courses'],
        ["searching", searching],
        ["working", working]]

    }

    const getCourses = async () => {
        let arr = []
        let res = await axios.get('http://localhost:3001/courses/names')
        res.data.forEach((course, idx) => {
            if(idx == 0 ){arr.push(['Courses', 'working'])}
            arr.push([course.title, (course.working * course.studNum / 100)])
        })
        return arr;
    }

    useEffect(async() => {
        if(chosenChart === 'Working Students'){
            setData(getWorkingStudents(allData));
            setOptions({title: chosenChart})
            setRefresh(refresh + 1)
        }
        if(chosenChart === 'Courses'){
            let tempData = await getCourses(allData);
            setData(tempData);
            setOptions({title: chosenChart})
            setRefresh(refresh + 1)
        }
        if(chosenChart === 'Cohorts'){
             getByCohorts()
        }
    }, [chosenChart])

    const handleRangeChange = (e) => {
        setChosenChart(e.target.value)
        if(e.target.value === 'Courses'){setShowCohorts('block')}
        else{setShowCohorts('none')}
    }

    const getByCohorts = () => {

    }

    const handleCohortChange = (e) =>{

    }

    const cohortsTitles = []

    return (
        <div>
            <div style={{display: 'grid', width: '30%', margin: '40px auto' }}>
                <div className='filters'>
                    <div className='Chart-filter'>
                        <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                                <InputLabel id="Chart-filters">Filter By:</InputLabel>
                                <Select
                                    labelId="select-filter"
                                    id="select-filter"
                                    value={chosenChart}
                                    label="Filter By:"
                                    onChange={handleRangeChange}
                                >
                                    {charTitles.map((name, idx) => {
                                        return (
                                            <MenuItem key={idx} value={name}>
                                                {name}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Box>
                    </div>
                    <div className='Cohort-filter' style={{}}>
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
                                    {cohortsTitles.map((cohortName, idx) => {
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
                </div>
            </div>


            <Chart
                chartType="PieChart"
                data={data}
                options={options}
                width={"100%"}
                height={"400px"}
            />

        </div>
    );
}

export default Charts;
