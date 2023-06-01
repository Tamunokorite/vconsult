import React, { useState } from 'react';
import { google } from 'googleapis';

const GoogleMeetButton = () => {
  const [meetingLink, setMeetingLink] = useState('');

  const generateMeetingLink = async () => {
    try {
      // Load client secrets from a JSON file or another secure source
      const credentials = {
        // Replace with your actual client credentials
        client_id: '523404803651-ahf6jvj1fai8i84oqmirospu6g1a3j1j.apps.googleusercontent.com',
        client_secret: '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',
        redirect_uris: ['http://localhost:3000/testgoogle'],
      };

      // Create an OAuth2 client using the loaded credentials
      const oAuth2Client = new google.auth.OAuth2(
        credentials.client_id,
        credentials.client_secret,
        credentials.redirect_uris[0]
      );

      // Set the scope for the Google Calendar API
      const SCOPES = ['https://www.googleapis.com/auth/calendar'];

      // Generate an authentication URL and prompt the user to authorize the application
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
      });

      // Redirect the user to the authorization URL and obtain the authorization code
      // Once you have the code, exchange it for an access token and refresh token

      // Create an authorized client using the obtained access token and refresh token
      oAuth2Client.setCredentials({
        access_token: 'YOUR_ACCESS_TOKEN',
        refresh_token: 'YOUR_REFRESH_TOKEN',
      });

      // Create a new event using the Google Calendar API
      const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

      const event = {
        summary: 'Google Meet Meeting',
        location: 'Virtual Meeting',
        conferenceData: {
          createRequest: {
            requestId: 'YOUR_REQUEST_ID',
          },
        },
        start: {
          dateTime: '2023-05-23T10:00:00',
          timeZone: 'Africa/Lagos',
        },
        end: {
          dateTime: '2023-05-23T11:00:00',
          timeZone: 'Africa/Lagos',
        },
      };

      const createdEvent = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1,
      });

      const meetingLink = createdEvent.data.hangoutLink;
      setMeetingLink(meetingLink);
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

export default GoogleMeetButton;
