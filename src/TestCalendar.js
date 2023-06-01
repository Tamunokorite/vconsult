import React, { useState } from 'react';
import Jitsi from 'react-jitsi';

const MeetingComponent = () => {
  const [meetingLink, setMeetingLink] = useState('');

  const generateUniqueId = () => {
    // Generate a random string of characters
    const randomString = Math.random().toString(36).substr(2, 9);

    // Create a unique ID by combining the random string and current timestamp
    const uniqueId = `${randomString}-${Date.now()}`;

    return uniqueId;
  };

  const generateMeetingLink = () => {
    const meetingId = generateUniqueId();
    const url = `https://meet.jit.si/${meetingId}`;
    setMeetingLink(url);
  };

  return (
    <div>
      <button onClick={generateMeetingLink}>Create Meeting</button>
      {meetingLink && <a href={meetingLink}>{meetingLink}</a>}
      {meetingLink && (
        <Jitsi
          roomName={meetingLink}
          displayName="Your Name"
          containerStyle={{ width: '800px', height: '600px' }}
          frameStyle={{ display: 'block', width: '100%', height: '100%' }}
        />
      )}
    </div>
  );
};

export default MeetingComponent;
