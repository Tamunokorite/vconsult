import React, { useEffect, useState } from "react";
import axios from "axios";

export function TestZoom() {

    const [res, setRes] = useState("");

    const body = {
        topic: "Test Meeting",
        type: 1,
        start_time: "2023-05-23 14:00:00",
        duration: 30,
        agenda: "This is the agenda",
        settings: {
            "host_video": true,
            "approval_type": 0,
            "participant_video": true,
            "join_before_host": true,
            "mute_upon_entry": false,
            "watermark": false,
            "enforce_login": true,
            "waiting_room": false,
            "registrants_email_notification": true,
            "registrants_email_confirmation": false,
            "allow_multiple_devices": true,
            "show_share_button": true,
        }
    }

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.REACT_ZOOM_JWT_TOKEN}`,
    }

    useEffect(() => {
        axios.post("https://api.zoom.us/v2/users/me/meetings", body, {headers})
        .then((r) => {
            console.log(r);
            setRes(r);
        })
        .catch(error => {
            console.log(error)
        });
    }, []);
    
    return (
        <div>{res}</div>
    )
}