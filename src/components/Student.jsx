import * as React from 'react';
import 'reactjs-popup/dist/index.css';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import '../styles/Student.css'
import InterviewRow from './InterviewRow'
import axios from 'axios';
import Job from './Job';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DateAdapter from '@mui/lab/AdapterMoment';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { useParams } from 'react-router-dom';

export default function Student() {
    let URL = "http://localhost:3001/jobs"

    const params = useParams()
    const userId = params.id
    const [date, setDate] = React.useState(new Date(Date.now()));
    const [refresh,setRefresh] = React.useState(1)
    const [jobs, setJobs] = React.useState([])
    const [company, setCompany] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [jobsInputs , setJobsInputs] = React.useState({title: "", link: "", company: ""})

    React.useEffect(async () => {
        let res = (await axios.get(`${URL}/${userId}`)).data
        setJobs(res)
    }, [refresh])

    const companies = ['All companies', 'Yad2', 'Facebook', 'Twitter', 'Intel']
    const statuses = ['All status', 'Accepted', 'waiting', 'Applied', 'no reply']

    const handleChange = (event) => {
        setCompany(event.target.value);
    };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event , key) => {
    let tempJobsInputs = {...jobsInputs}
    tempJobsInputs[key] = event.target.value
    setJobsInputs(tempJobsInputs)
  }

  const handleAddJob = () => {
    if(!jobsInputs.title || !jobsInputs.link || !jobsInputs.company || !date ){return}
    let newJob = {
        title: jobsInputs.title,
        link: jobsInputs.link,
        company: jobsInputs.company,
        date: date,
        userId: userId
    }
    axios.post(`${URL}`,newJob).then(()=>{
        setRefresh(refresh+1)
    })
    setOpen(false);
  };

  const handleDateChange = (newValue) => {
    setDate(newValue);
  };

    return (
        <div className='student-page-container'>
            <div className='filters-detail'>
                <div className='cont'>
                    <Box sx={{ minWidth: 120 }} className='box'>
                        <FormControl fullWidth>
                            <InputLabel id="companies">Companies</InputLabel>
                            <Select
                                labelId="select-companies"
                                id="select-companies"
                                value={companies}
                                label="companies"
                                onChange={handleChange}>
                                {companies.map((c, idx) => {
                                    return (
                                        <MenuItem key = {idx} value={c}>{c}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ minWidth: 120 }} >
                        <FormControl fullWidth>
                            <InputLabel id="statuses">Statuses</InputLabel>
                            <Select
                                labelId="select-statuses"
                                id="select-statuses"
                                value={statuses}
                                label="statuses"
                                onChange={handleChange}>
                                {statuses.map((s, idx) => {
                                    return (
                                        <MenuItem key={idx} value={s}>{s}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                    </Box>

                </div>

                <div className='right-box-details'>
                    <p>name : </p>
                    <p>cohort : </p>
                    <p>email : </p>
                    <p>city : </p>
                    <p>phone : </p>
                </div>
            </div>

            <div style={{ width: '80%', margin: '10px auto' }}> <hr />

            <div>
                <Stack direction="row" spacing={2}>
                        <Button onClick={handleClickOpen} variant="outlined">Add Job</Button>
                </Stack>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Add Job :</DialogTitle>
                    <DialogContent> 
                        <TextField autoFocus margin="dense" onChange= {(e) => {handleInputChange(e,"title")}} value={jobsInputs.title} id="title" label="Job Title" type="text" fullWidth variant="standard" required/>
                        <TextField autoFocus margin="dense" onChange= {(e) => {handleInputChange(e,"link")}} value={jobsInputs.link} id="link" label="Job Link" type="text" fullWidth variant="standard" required/>
                        <div className='datePicker'>
                            <LocalizationProvider dateAdapter={DateAdapter}><MobileDatePicker label="Date mobile" inputFormat="MM/dd/yyyy" value={date} onChange={handleDateChange} renderInput={(params) => <TextField {...params} />}/></LocalizationProvider>
                        </div>
                        <TextField autoFocus margin="dense" onChange={(e) => {handleInputChange(e,"company")}} value={jobsInputs.company} id="company" label="Company" type="text" fullWidth variant="standard" required/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleAddJob}>Add</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
            <div className='jobs-title'>
                <div>job name</div>
                <div className='vLine'>company</div>
                <div className='vLine'>date</div>
                <div className='vLine'>last interview</div>
                <div className='vLine'>status</div>
            </div>
            <div className='rows'>
                {
                    jobs.map((j,idx) => {
                        return <Job refresh={refresh} setRefresh={setRefresh} key={idx} job={j} />
                    })
                }
            </div >
        </div >
    );
}
