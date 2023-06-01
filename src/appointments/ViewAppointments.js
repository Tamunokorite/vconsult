import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { Card, Container } from "react-bootstrap";
import { json, useNavigate } from "react-router-dom";
import Calendar from 'react-calendar';
import { PaystackButton } from "react-paystack";
import Jitsi from 'react-jitsi';

export default function ViewAppointments()
{
    const publicKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY;
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [appointments, setAppointments] = useState([]);
    const [user, loading, error] = useAuthState(auth);
    const aType = window.location.href.includes("requests") ? "requests" : window.location.href.includes("doctors") ? "doctors" : "patients";
    const [name, setName] = useState("");
    const [selectedCat, setSelectedCat] = useState("");
    const [meetingLink, setMeetingLink] = useState('');
    const prices = {
        "Primary Care": 1500000, 
        "Pediatrics": 2000000, 
        "Psychology": 3000000, 
        "Psychiatry": 5000000, 
        "Dermatology": 2500000, 
        "Women's Health": 2000000, 
        "Men's Health": 2000000,
    };
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

    const generateUniqueId = () => {
        // Generate a random string of characters
        const randomString = Math.random().toString(36).substr(2, 9);
    
        // Create a unique ID by combining the random string and current timestamp
        const uniqueId = `${randomString}-${Date.now()}`;
    
        return uniqueId;
      };

    const fetchSelectedCat = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            setSelectedCat(data.selectedCat);
        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data");
        }
    };
    const getNewAppointments = (appointment) => {
        return !appointment.data.accepted && appointment.data.category === selectedCat;
    }

    const getPatientAppointments = (appointment) => {
        return appointment.data.patient.id === user.uid;
    }

    const getDoctorAppointments = (appointment) => {
        return appointment.data.doctor.id === user.uid;
    }
    const navigate = useNavigate();

    const formatAppointment = (appointment, doctorView=false) => {
        if (doctorView) {
            return (
                <div key={appointment.id}>
                  <strong>{appointment.data.category}</strong>
                  <p>Date: {appointment.date.toLocaleDateString()}</p>
                  <p>Time: {appointment.date.toLocaleTimeString()}</p>
                  <p>Patient: {appointment.data.patient.name}</p>
                  <p>Notes: {appointment.data.notes}</p>
                  {appointment.data.paid && <a href={appointment.data.meetingLink}>Meeting Link</a>}
                </div>
              );
        }
        if (appointment.data.paid) {
            return (
                <div key={appointment.id}>
                  <strong>{appointment.data.category}</strong>
                  <p>Date: {appointment.date.toLocaleDateString()}</p>
                  <p>Time: {appointment.date.toLocaleTimeString()}</p>
                  <a href={appointment.data.meetingLink}>Meeting Link</a>
                </div>
            );
        }
        if (appointment.data.accepted) {
            const componentProps = {
                email: user.email,
                amount: prices[appointment.data.category],
                metadata: {
                  name,
                  email: user.email
                },
                publicKey,
                text: "Get Meeting Link ₦" + prices[appointment.data.category]/100,
                onSuccess: () => {
                    const meetingId = generateUniqueId();
                    const url = `https://meet.jit.si/${meetingId}`;
                    setMeetingLink(url);
                    const appointmentID = doc(db, 'appointments', appointment.id);
                    // console.log(JSON.stringify(appointmentID));
                    updateDoc(appointmentID, {
                        paid: true,
                        meetingLink: url
                    })
                    .then((r) => {
                        const q = query(collection(db, "users"), where("uid", "==", appointment.data.doctor.id));
                        getDocs(q)
                        .then(async (r) => {
                            console.log(r.docs);
                            const data = r.docs[0].data();
                            const updatedBalance = data.balance;
                            const doctorID = doc(db, 'users', r.docs[0].id);
                            console.log(r.docs[0].id);
                            updateDoc(doctorID, {
                                balance: updatedBalance + prices[appointment.data.category]
                            }).then((r) => {
                                alert("Thanks for doing business with us! You now have access to the meeting link for your appointment!!")
                            })
                            .catch((err) => {
                                alert(err);
                            });
                            })
                            .catch((err) => {
                                alert(err);
                            });
                    })
                    .catch((err) => {
                        alert(err);
                    });
                },
                onClose: () => alert("Wait! Don't leave :("),
              }
            return (
                <div key={appointment.id}>
                  <strong>{appointment.data.category}</strong>
                  <p>Date: {appointment.date.toLocaleDateString()}</p>
                  <p>Time: {appointment.date.toLocaleTimeString()}</p>
                  <p>Doctor: {appointment.data.doctor.name}</p>
                  <PaystackButton {...componentProps} />
                  {meetingLink && <a href={meetingLink}>{meetingLink}</a>}
                </div>
              );
        }
        return (
            <div key={appointment.id}>
              <strong>{appointment.data.category}</strong>
              <p>Date: {appointment.date.toLocaleDateString()}</p>
              <p>Time: {appointment.date.toLocaleTimeString()}</p>
            </div>
        );
      };
    
    // Function to customize the day tile
    const tileContent = ({ date }) => {
    const hasAppointment = appointments.some(
        (appointment) =>
        appointment.date.toDateString() === date.toDateString()
    );
    const acceptedAppointment = appointments.some(
        (appointment) =>
            appointment.data.accepted
    );
    return hasAppointment ? (acceptedAppointment ? <div className="appointment-marker-green" /> : <div className="appointment-marker-red" />) : null;
    };

    useEffect(() => {
        const q = query(collection(db, 'appointments'), orderBy('created', 'desc'))
        onSnapshot(q, (querySnapshot) => {
          setAppointments(querySnapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
            date: new Date(doc.data().date),
          })))
        })
    },[])

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
        fetchUserName();
        fetchSelectedCat();
    }, [user, loading]);

    const handleAccept = async (e, appointment) => {
        e.preventDefault();
        const doctor = {id: user?.uid, name: name, email: user?.email};
        const appointmentID = doc(db, 'appointments', appointment.id);
        try {
            await updateDoc(appointmentID, {
                accepted: true,
                doctor: doctor
            });
        }
        catch (err) {
            alert(err);
        }
    };

    const handlePayment = async (appointment) => {
        const doctor = {id: user?.uid, name: name, email: user?.email};
        const appointmentID = doc(db, 'appointments', appointment.id);
        try {
            await updateDoc(appointmentID, {
                accepted: true,
                doctor: doctor
            });
        }
        catch (err) {
            alert(err);
        }
    };

    if (aType === "patients") {
        return (
            <Container className="d-flex flex-column align-items-center mt-5">
                <h1>My Appointments</h1>
                <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileContent={tileContent}
                />
                <h3>{selectedDate.toLocaleDateString()}</h3>
                {appointments.filter(getPatientAppointments).map((appointment) => {
                    if (
                        appointment.date.getFullYear() === selectedDate.getFullYear() &&
                        appointment.date.getMonth() === selectedDate.getMonth() &&
                        appointment.date.getDate() === selectedDate.getDate()
                    ) {
                    return formatAppointment(appointment);
                    }
                    return null;
              
                })}
            </Container>
        )
    }
    else if (aType === "requests"){
        return (
            <Container className="d-flex flex-column align-items-center mt-5">
                <h1>New Appointments</h1>
                <p className="text-muted">Showing {appointments.filter(getNewAppointments).length} new appointments</p>
                <div>
                {appointments.filter(getNewAppointments).map((appointment) => (
                    <Card style={{ width: '18rem' }} key={appointment.id} className="mt-5 mb-2">
                    <Card.Body>
                      <Card.Title>{appointment.data.patient.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">{appointment.data.date} {appointment.data.time}</Card.Subtitle>
                      {
                        appointment.data.notes === "" ? "" : 
                        <Card.Text>
                        {appointment.data.notes.substring(0, 70)}{appointment.data.notes.length > 70 ? "..." : ""}
                      </Card.Text>
                      }
                      <Card.Link href="#" onClick={e => handleAccept(e, appointment)}>Accept</Card.Link>
                      {/* <Card.Link href="#">Another Link</Card.Link> */}
                    </Card.Body>
                  </Card>
              
                ))}
                </div>
            </Container>
        )
    }
    else {
        return (
            <Container className="d-flex flex-column align-items-center mt-5">
                <h1>My Appointments</h1>
                <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileContent={tileContent}
                />
                <h3>{selectedDate.toLocaleDateString()}</h3>
                {appointments.filter(getDoctorAppointments).map((appointment) => {
                    if (
                        appointment.date.getFullYear() === selectedDate.getFullYear() &&
                        appointment.date.getMonth() === selectedDate.getMonth() &&
                        appointment.date.getDate() === selectedDate.getDate()
                    ) {
                    return formatAppointment(appointment, true);
                    }
                    return null;
              
                })}
            </Container>
        )
    }
}