import React, { useState } from 'react';
import '../styles/job.css'
import InterviewRow from './InterviewRow'

function Job(props) {

    const [isActive, setActive] = useState(false);

    const handleToggle = () => {
        setActive(!isActive);
    };

    const job = props.job
    return (
        <div >
            <div className='job' onClick={handleToggle} >
                <p>{job.title}</p>
                <p>{job.company}</p>
                <p>{job.date}</p>
                <p>{job.interviews.length > 0 ? job.interviews[job.interviews.length - 1].type : 'none'}</p>
                <p>{job.status}</p>

            </div>

            <div className={isActive ? 'interviews-container display' : 'interviews-container hide'}>


                <div className='interviews-header'>
                    <p>type</p>
                    <p>date</p>
                    <p>status</p>
                    <p>description</p>
                    <p>link</p>
                </div>


                <div>
                    {job.interviews.map(i => {
                        return (
                            <div >
                                <InterviewRow inter={i} />
                            </div>
                        )
                    })}
                </div>


            </div>

        </div>
    );
}

export default Job;
