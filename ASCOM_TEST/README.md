## USED TECHNOLOGIES

- Server: Asp.NET Core (NET core 3.1)
- Client: React v17

I started a new Visual Studio project using ASP.NET Core + React template.
Client files are located under ClientApp folder while server files are located under Server folder.

## SERVER

At server startup 3 services are started:

- DataServices: provides to create an inmemory DB with Sqllite (loading data from json files) and exposes methods to access to data.
- PushDataServices: sends patients data to the client every second using SignalR hub method.
- RemoveRandomPatientService: it cyclically removes a patient (randomly) from patients table and then adds it again after a few seconds.

A login API is provided for user authentication

## CLIENT

External library used:
- MaterialUI DataGrid: for rendering patients data
- Form.js: a validation library for validating email and password fields at login
 
## LOGIN PAGE

A login page is provided with form input validation.
After Login API is called (in case of success) token is stored in memory.
An authenticated route is provided to access to Patients Page. Patients Page is accessible only with a non empty token stored.
On logout button pressed (in Patients Page) token is deleted from memory and Login page is showed.

Login Credentials:
testuser@test.com // Test1!

## PATIENTS PAGE

Patients Page recives data from SignalR WebSocket. Data are showed in a DataGrid Table.
Table columns are sortable and filtarable as default in the Material UI DataGrid component.
By clicking on a row patient LastSelectedDate is updated on the server (by websocket) and patient details are showed in a window.

## EXTRA

Server logs are provided by log4net library


