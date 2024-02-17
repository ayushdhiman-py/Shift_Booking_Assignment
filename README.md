To start the server, follow these steps:
- Navigate to the shiftsapi directory: `cd shiftsapi`
- Install dependencies: `npm install`
- Start the server: `npm start`

To install and run the React Native app, proceed with the following commands:
- Go to the ShiftBooking directory: `cd ../ShiftBooking`
- Install dependencies: `npm install`
- Start the app (select the desired platform):
  - For Android: `npm start`, then press "a"
  - For iOS: `npm start`, then press "i"

NOTE: If you are running the app on a physical Android device and need it to fetch API data, follow these additional steps:
- Install ADB
- Connect your phone to the PC via USB
- Open CMD and run: `adb reverse tcp:8080 tcp:8080`
- Now, run `npm start`, then press "a" for Android or "i" for iOS.
