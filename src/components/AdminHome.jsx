import React from 'react';
import '../styles/AdminHome.css'
import Course from './Course';
import { observer, inject } from 'mobx-react';


function AdminHome() {

    const courses = ['Full Stack', 'QA', 'Course3', 'Course4'] // should come from mobx
    const colors = ['aaa', 'aaa', 'aaa', 'aaa']
    return (
        <div className='page-container'>
            {courses.map((c, idx) => {
                return <Course name={c} color={colors[idx]} />
            })}
        </div>
    );
}

export default inject()(observer(AdminHome));
