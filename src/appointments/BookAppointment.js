import React, { useState, useEffect } from "react";
import { Container, Form, Row, Button } from "react-bootstrap";
import { addDoc, collection, Timestamp, query, where, getDocs } from 'firebase/firestore';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function BookAppointment()
{
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [notes, setNotes] = useState("");
    const [added, setAdded] = useState(false);
    const [category, setCategory] = useState([
        "Primary Care", "Pediatrics", "Psychology", "Psychiatry",
        "Dermatology", "Women's Health", "Men's Health", 
    ]);
    const cat = category.map(cat => cat);
    const handleCatChange = (e) => {
        setSelectedCat(e.target.value);
    };
    const [user, loading, error] = useAuthState(auth);
    const [selectedCat, setSelectedCat] = useState("Primary Care");
    const [name, setName] = useState("");
    const fetchUserName = async () => {
        try {
          const q = query(collection(db, "users"), where("uid", "==", user?.uid));
          const doc = await getDocs(q);
          const data = doc.docs[0].data();
          setName(data.name);
        } catch (err) {
          console.error(err);
          alert("An error occured while fetching user data");
        }
      };
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const patient = {id: user?.uid, name: name, email: user?.email};
            console.log(patient);
            await addDoc(collection(db, "appointments"), {
                patient: patient,
                date,
                time,
                notes,
                category: selectedCat,
                accepted: false,
                created: Timestamp.now()
            });
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };
    useEffect(() => {
        if (loading) return;
        if (!user) navigate("/");
        fetchUserName();
        console.log(new Date().toISOString().split("T")[0]);
    }, [user, loading, error]);
    return (
        // <div>
        //     <h1>Book an Appointment</h1>
        // </div>
        <Container className="d-flex flex-column align-items-center mt-5">
            <Row><h1>Book an Appointment</h1></Row>
            <Row className="mt-5">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" value={date} min={new Date().toISOString().split("T")[0]} onChange={e => setDate(e.target
                            .value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Time</Form.Label>
                        <Form.Control type="time" value={time} onChange={e => setTime(e.target
                            .value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select aria-label="Category" onChange={e => handleCatChange(e)} required>
                            {
                                cat.map((cat, key) => <option value={cat} key={key}>{cat}</option>)
                            }
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Notes</Form.Label>
                        <Form.Control as="textarea" rows={3} style={{resize:"none"}} value={notes} onChange={e => setNotes(e.target
                            .value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Book Now
                    </Button>
                </Form>
            </Row>
        </Container>
    )
}