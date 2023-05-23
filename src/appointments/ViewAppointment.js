import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { Col, Container } from "react-bootstrap";

export default function ViewAppointment()
{
    let { id } = useParams();
    const [appointment, setAppointment] = useState({});
    const [connection, setConnection] = useState("");

    useEffect(() => {
        onSnapshot(doc(db, "appointments", id), async (res) => {
            let d = res.data();
            let date = new Date(d.date);
            d.date = date.toDateString();
            let c = window.location.href.includes("doctors") ? "Patient: " + d.patient.name : "Doctor: " + d.doctor.name;

            setConnection(c);
            setAppointment(d);
        });
    },[]);

    // useEffect(() => {
    //     if (Object.keys(appointment).length !== 0) {
    //         if (window.location.href.includes("doctors")) {
    //             onSnapshot(doc(db, "users", appointment.patient), (res) => {
    //                 let s = res.data();
    //                 let v = "Patient: " + s.name;
    //                 setConnection(v);
    //             });
    //         }
    //         else {
    //             onSnapshot(doc(db, "users", appointment.doctor), (res) => {
    //                 let s = res.data();
    //                 let v = "Doctor: " + s.name;
    //                 setConnection(v);
    //             });
    //         }
    //     }
    // }, []);


    return (
        // <div>
        //     <h1>{appointment.category}</h1>
        // </div>
        <Container className="mt-4">
            <h1>{appointment.category}</h1>
            <p className="text-muted">({appointment.time}) {appointment.date}</p>
            <p className="text-muted">{connection}</p>
            <Col xs={12}>
                <h2>Notes</h2>
                <p>{appointment.notes}</p>
            </Col>
        </Container>
    )
}