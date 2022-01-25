import React, { useState , useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import "../styles/navbar.css";
import axios from 'axios';

const AccountSettings = () => {
    let userId = "61eee2cedc8e3b3b16870b9a"
    let URL = "http://localhost:3001/users/"
    const [updatedDataInputs, setUpdatedDataInputs] = useState({name: "", email: "", phone: "", city: "", linkedin: "", status: ""});
useEffect(() => {
    axios.get(`${URL}${userId}`).then(res => {
        let user = res.data
        setUpdatedDataInputs({
            name: user.name,
            email: user.email,
            phone: user.phone,
            city: user.city,
            linkedin: user.linkedin,
            status: user.status
        })
    })
},[])
    const handleInputChange = e => {
        let tempUpdatedDataInputs = {...updatedDataInputs}
        tempUpdatedDataInputs[e.target.className] = e.target.value
        setUpdatedDataInputs(tempUpdatedDataInputs)
    }

    const handleEditUser = () =>{
        let tempUpdatedDataInputs = {...updatedDataInputs}
        tempUpdatedDataInputs["userId"] = userId
        axios.put(`${URL}`,tempUpdatedDataInputs);
    }

    return (
        <div>
            name:<input className="name" onChange={handleInputChange} value={updatedDataInputs.name} />
            email:<input className="email" onChange={handleInputChange} value={updatedDataInputs.email} />
            phone:<input className="phone" onChange={handleInputChange} value={updatedDataInputs.phone} />
            city:<input className="city" onChange={handleInputChange} value={updatedDataInputs.city} />
            linkedin:<input className="linkedin" onChange={handleInputChange} value={updatedDataInputs.linkedin} />
            status:<input className="status" onChange={handleInputChange} value={updatedDataInputs.status} />
            <button onClick={handleEditUser} className="AccountSettingSaveButton">Save</button>
        </div>
    )
};

export default AccountSettings;
