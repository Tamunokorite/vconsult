// import React, {ReactNode, SyntheticEvent} from 'react';
// import ApiCalendar from 'react-google-calendar-api';

// const config = {
//   "clientId": "523404803651-ahf6jvj1fai8i84oqmirospu6g1a3j1j.apps.googleusercontent.com",
//   "apiKey": process.env.REACT_GOOGLE_CALENDAR_API_KEY,
//   "scope": "https://www.googleapis.com/auth/calendar",
//   "discoveryDocs": [
//     "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
//   ]
// }

// const apiCalendar = new ApiCalendar(config);

// const eventFromNow = {
//   summary: "Poc Dev From Now",
//   time: 480,
// };

// apiCalendar
//   .createEventFromNow(eventFromNow)
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// const eventWithVideoConference = {
//   summary: "Event With Google Meet Conference",
//   start: {
//     dateTime: new Date().toISOString(),
//     timeZone: "Europe/Paris",
//   },
//   end: {
//     dateTime: new Date(new Date().getTime() + 3600000).toISOString(),
//     timeZone: "Europe/Paris",
//   },
// };

// apiCalendar
//   .createEventWithVideoConference(eventWithVideoConference)
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.log(error);
//   });
//   render() {
//     return ()
//   }

// }