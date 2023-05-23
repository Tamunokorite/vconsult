import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { collection, query, where, getDocs, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function AppointmentCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [user, loading, error] = useAuthState(auth);

  const navigate = useNavigate();

  // Dummy appointments data for demonstration
//   const appointments = [
//     { title: 'Appointment 1', date: new Date(2023, 4, 22, 10, 0) },
//     { title: 'Appointment 2', date: new Date(2023, 4, 23, 14, 30) },
//     { title: 'Appointment 3', date: new Date(2023, 4, 24, 9, 45) },
//   ];

  const [appointments, setAppointments] = useState([]);

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

  // Function to format appointment details
  const formatAppointment = (appointment) => {
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
    },[]);

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
        fetchUserName();
    }, [user, loading]);

  return (
    <div>
      <h2>Appointments</h2>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileContent={tileContent}
      />
      <h3>{selectedDate.toLocaleDateString()}</h3>
      {appointments.map((appointment) => {
        if (
          appointment.date.getFullYear() === selectedDate.getFullYear() &&
          appointment.date.getMonth() === selectedDate.getMonth() &&
          appointment.date.getDate() === selectedDate.getDate()
        ) {
          return formatAppointment(appointment);
        }
        return null;
      })}
    </div>
  );
};
