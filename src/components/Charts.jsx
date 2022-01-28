import axios from 'axios';
import React, { useEffect, useState } from 'react';
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
        // console.log([['status', 'status per all courses'], ["searching", searching], ["working", working]]);

        return [['status', 'status per all courses'],
        ["searching", searching],
        ["working", working]]

    }


    // const data = [
    //     ["Task", "Hours per Day"],
    //     ["searching", 11],
    //     ["working", 2]
    // ];


    const getCourses = (courses) => {
        let arr = [['Courses', 'working']]
        console.log(chosenChart);
        axios.get('http://localhost:3001/courses/names').then((res) => {
            res.data.forEach((course, idx) => {
                arr.push([course.title, (course.working * course.studNum / 100)])
            })
        })

        return arr;

    }

    useEffect(() => {
        console.log(chosenChart);
        switch (chosenChart) {
            case 'Working Students':
                setData(getWorkingStudents(allData));
                break;
            case 'Courses':
                setData(getCourses(allData));
                break;
            case 'Cohorts':
                // getByCohorts()
                break;
            default:
                break;

        }

    }, [chosenChart])

    const choseChart = async (chosenChart) => {

    }

    const handleRangeChange = (e) => {
        setChosenChart(e.target.value)
        // console.log(data);
        // setOptions({ title: e.target.value })

        // choseChart(e.target.value)
        //here have to handle the changes that happing to chart
    }


    return (
        <div>

            <div style={{ width: '30%', margin: '40px auto' }}>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="statuses">Select Chart :</InputLabel>
                        <Select
                            labelId="select-Range"
                            id="select-Range"
                            value={chosenChart}
                            label="range"
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
