import React, { useState , useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import "../styles/navbar.css";
import axios from 'axios';

const AccountSettings = () => {
    let userId = "61eee2cedc8e3b3b16870b9a"
    let URL = "http://localhost:3001/users/"
    const [updatedDataInputs, setUpdatedDataInputs] = useState({name: "", email: "", phone: "", city: "", linkedin: "", status: ""});
    const [passwordChangeInput, setPasswordChangeInput] = useState({currentPassword: "",newPassword: ""})
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

    const handlePasswordInputChange = e => {
        let tempChangePasswordInputs = {...passwordChangeInput}
        tempChangePasswordInputs[e.target.className] = e.target.value
        setPasswordChangeInput(tempChangePasswordInputs)
    }

    const handleEditUser = () => {
        let tempUpdatedDataInputs = {...updatedDataInputs}
        tempUpdatedDataInputs["userId"] = userId
        axios.put(`${URL}`,tempUpdatedDataInputs);
    }

    const handlePasswordChange = () => {
        let tempPasswordChangeInput = {...passwordChangeInput}
        tempPasswordChangeInput["userId"] = userId
        console.log(tempPasswordChangeInput);
        axios.put(`${URL}password`,tempPasswordChangeInput)
        .then(res => {
            if(res.data.error){
                alert("Current password not match the current password")
            }
        })
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
            current password:<input type="password" id="accountSettingsPasswordInputs" className="currentPassword" onChange={handlePasswordInputChange} value={passwordChangeInput.currentPassword} /><br/>
            new password:<input type="password" id="accountSettingsPasswordInputs" className="newPassword" onChange={handlePasswordInputChange} value={passwordChangeInput.newPassword} required/><br/>
            <button onClick={handlePasswordChange} className="AccountSettingChangePasswordButton">change password</button><br/>
        </div>
    )
};

export default AccountSettings;
