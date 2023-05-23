import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../firebase";
import { Form } from "react-bootstrap";
import "./Register.css";

export default function Register()
{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    const userType = window.location.href.includes("doctors") ? "doctor" : "patient";
    const register = () => {
        if (!name) {alert("Please enter name"); return;}
        if (userType === "patient") {
            registerWithEmailAndPassword(name, email, password, dob, userType);
        }
        else {
            registerWithEmailAndPassword(name, email, password, dob, userType, selectedCat);
        }
     };
    const [category, setCategory] = useState([
        "Primary Care", "Pediatrics", "Psychology", "Psychiatry", "Psychology",
        "Dermatology", "Women's Health", "Men's Health", 
    ]);
    const cat = category.map(cat => cat);
    const handleCatChange = (e) => {
        setSelectedCat(e.target.value);
    };
    const [selectedCat, setSelectedCat] = useState("Primary Care");
    useEffect(() => {
        if (loading) return;
        if (user) navigate(userType === "patient" ? "/dashboard" : "/doctors/dashboard")
    }, [user, loading]);
    return (
        <div className="register">
        <div className="register__container">
            <h1 className="mb-4">Register</h1>
            <input
            type="text"
            className="register__textBox"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            />
            <input
            type="text"
            className="register__textBox"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail Address"
            />
            <input
            type="date"
            className="register__textBox"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            placeholder="Date of Birth"
            />
            <input
            type="password"
            className="register__textBox"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            />
            {userType === "doctor" ? 
            <Form.Select aria-label="Category" onChange={e => handleCatChange(e)} required>
            {
                cat.map((cat, key) => <option value={cat} key={key}>{cat}</option>)
            }
        </Form.Select>
            :""}
            <button className="register__btn" onClick={register}>
            Register
            </button>
            <div>
            Already have an account? <Link to={userType === "patient" ? "/login" : "/doctors/login"}>Login</Link> now.
            </div>
            {userType === "patient" ? 
            <div>
            Are you a doctor? <Link to="/doctors/register">Register here</Link> now.
            </div> : ""}
        </div>
        </div>
    );
}