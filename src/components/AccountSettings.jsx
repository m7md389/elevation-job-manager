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
            name:<input id="accountSettingsInputs" className="name" onChange={handleInputChange} value={updatedDataInputs.name} /><br/>
            email:<input id="accountSettingsInputs" className="email" onChange={handleInputChange} value={updatedDataInputs.email} /><br/>
            phone:<input id="accountSettingsInputs" className="phone" onChange={handleInputChange} value={updatedDataInputs.phone} /><br/>
            city:<input id="accountSettingsInputs" className="city" onChange={handleInputChange} value={updatedDataInputs.city} /><br/>
            linkedin:<input id="accountSettingsInputs" className="linkedin" onChange={handleInputChange} value={updatedDataInputs.linkedin} /><br/>
            status:<input id="accountSettingsInputs" className="status" onChange={handleInputChange} value={updatedDataInputs.status} /><br/>
            <button onClick={handleEditUser} className="AccountSettingSaveButton">Save</button><br/>
        </div>
    )
};

export default AccountSettings;
