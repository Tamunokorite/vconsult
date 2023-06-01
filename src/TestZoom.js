import React, { useState } from 'react';
import axios from 'axios';

const ZoomMeetingButton = () => {
  const [meetingLink, setMeetingLink] = useState('');

  const generateMeetingLink = async () => {
    try {
      const response = await axios.post(
        'https://api.zoom.us/v2/users/me/meetings', // Replace {userId} with the Zoom user ID or "me" for the authenticated user
        {
          topic: 'My Zoom Meeting',
          type: 1, // 1 for Instant Meeting, 2 for Scheduled Meeting
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_ZOOM_JWT_TOKEN}`, // Replace with your Zoom API access token
          },
        }
      );

      const meetingId = response.data.id;
      const link = `https://zoom.us/j/${meetingId}`;
      setMeetingLink(link);
      console.log(link);
    } catch (error) {
      console.error('Error generating meeting link:', error);
    }
  };

  return (
    <div>
      <button onClick={generateMeetingLink}>Generate Meeting Link</button>
      {meetingLink && (
        <div>
          <p>Meeting Link:</p>
          <a href={meetingLink} target="_blank" rel="noopener noreferrer">
            {meetingLink}
          </a>
        </div>
      )}
    </div>
  );
};

export default ZoomMeetingButton;
