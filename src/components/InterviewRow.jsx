import React from 'react';
import '../styles/InterviewRow.css'
function processRow(props) {

    const interview = props.inter
    console.log(interview);
    return (
        <div className='interviews'>
            <p>{interview.type}</p>
            <p>{interview.date}</p>
            <p>{interview.status}</p>
            <p>{interview.description}</p>
            <p className='link'>Link</p>
            {/* <p>{interview.link}</p> */}
        </div>
    );
}

export default processRow;
