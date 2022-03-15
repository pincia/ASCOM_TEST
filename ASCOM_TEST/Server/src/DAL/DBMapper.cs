using ASCOM_TEST.DM;
using log4net;
using Microsoft.Data.Sqlite;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;

namespace ASCOM_TEST.DAL
{
    public class DBMapper
    {
        private static readonly ILog Log = LogManager.GetLogger(typeof(DBMapper));

        const string connectionString = "Data Source=InMemoryDB;Mode=Memory;Cache=Shared";
        private SqliteConnection _connection;
        public DBMapper()
        {
            _connection = new SqliteConnection(connectionString);
            InitDB();
        }
      
        public void InitDB()
        {
            _connection.Open();
            CreateTables();
            LoadData();
        }
        public void CreateTables()
        {
            Log.Debug($"[DBMapper] Creating tables...");

            try
            {
                var creatUsersTable = _connection.CreateCommand();
                creatUsersTable.CommandText =
                    @"
                CREATE TABLE [Users](
	                [Id] [bigint] NULL,
	                [Username] [nvarchar](50) NULL,
	                [Password] [nvarchar](50) NULL
                ) 
            ";
                creatUsersTable.ExecuteNonQuery();

                var createPatientsTable = _connection.CreateCommand();
                createPatientsTable.CommandText =
                    @"
                CREATE TABLE [Patients](
	                [Id] [bigint] NOT NULL,
	                [FamilyName] [nvarchar](50) NULL,
	                [GivenName] [nvarchar](50) NULL,
	                [LastSelectedDate] [datetime] NULL
                )
            ";
                createPatientsTable.ExecuteNonQuery();

               
            }
            catch(Exception ex)
            {
                Log.Error($"[DBMapper] error on CreateTables() {ex.Message}");
                throw;
            }

            Log.Debug($"[DBMapper] tables created");
        }

        public void LoadData()
        {
            Log.Debug($"[DBMapper] Loading data...");

            try
            {
                StreamReader r = new StreamReader("Server/src/Data/patients_data.json");
                string patientsJsonString = r.ReadToEnd();
                var patients = (DataTable)JsonConvert.DeserializeObject(patientsJsonString, (typeof(DataTable)));

                r = new StreamReader("Server/src/Data/users_data.json");
                string usersJsonString = r.ReadToEnd();
                var users = (DataTable)JsonConvert.DeserializeObject(usersJsonString, (typeof(DataTable)));


                foreach (var row in users.AsEnumerable())
                {
                    var insertUserCommand = _connection.CreateCommand();
                    insertUserCommand.CommandText =
                            @"
                    INSERT INTO Users
                    VALUES (@Id,@Username,@Password)
                ";
                    insertUserCommand.Parameters.Add(new SqliteParameter("@Id", Convert.ToInt32(row["Id"])));
                    insertUserCommand.Parameters.Add(new SqliteParameter("@Username", Convert.ToString(row["Username"])));
                    insertUserCommand.Parameters.Add(new SqliteParameter("@Password", Convert.ToString(row["Password"])));
                    var res = insertUserCommand.ExecuteNonQuery();
                }

                foreach (var row in patients.AsEnumerable())
                {
                    var insertPatientCommand = _connection.CreateCommand();
                    insertPatientCommand.CommandText =
                            @"
                    INSERT INTO Patients
                    VALUES (@Id,@FamilyName,@GivenName,@LastSelectedDate)
                ";
                    insertPatientCommand.Parameters.Add(new SqliteParameter("@Id", Convert.ToInt32(row["Id"])));
                    insertPatientCommand.Parameters.Add(new SqliteParameter("@FamilyName", Convert.ToString(row["FamilyName"])));
                    insertPatientCommand.Parameters.Add(new SqliteParameter("@GivenName", Convert.ToString(row["GivenName"])));
                    insertPatientCommand.Parameters.Add(new SqliteParameter("@LastSelectedDate", Convert.ToDateTime(row["LastSelectedDate"])));
                    var res = insertPatientCommand.ExecuteNonQuery();
                }

            }
            catch (Exception ex)
            {
                Log.Error($"[DBMapper] error on LoadData() {ex.Message}");
                throw;
            }
            Log.Debug($"[DBMapper] data loaded");           
        }

        public void RemovePatient(long patientId)
        {
            Log.Debug($"[DBMapper] Removing patient...");

            try
            {
                    var removePatientCommand = _connection.CreateCommand();
                    removePatientCommand.CommandText =
                            @"DELETE FROM Patients WHERE Id = @Id";

                    removePatientCommand.Parameters.Add(new SqliteParameter("@Id", patientId));
                    var res = removePatientCommand.ExecuteNonQuery();
                
            }
            catch (Exception ex)
            {
                Log.Error($"[DBMapper] error on RemovePatient() {ex.Message}");
                throw;
            }
            Log.Debug($"[DBMapper] Patient removed");
        }

        public void AddPatient(Patient patient)
        {
            Log.Debug($"[DBMapper] Adding patient...");

            try
            {
                    var insertPatientCommand = _connection.CreateCommand();
                    insertPatientCommand.CommandText =
                            @"
                    INSERT INTO Patients
                    VALUES (@Id,@FamilyName,@GivenName,@LastSelectedDate)
                ";
                    insertPatientCommand.Parameters.Add(new SqliteParameter("@Id", patient.Id));
                    insertPatientCommand.Parameters.Add(new SqliteParameter("@FamilyName", patient.FamilyName));
                    insertPatientCommand.Parameters.Add(new SqliteParameter("@GivenName", patient.GivenName));
                    insertPatientCommand.Parameters.Add(new SqliteParameter("@LastSelectedDate", patient.LastSelectedDate));
                    var res = insertPatientCommand.ExecuteNonQuery();
                
            }
            catch (Exception ex)
            {
                Log.Error($"[DBMapper] error on AddingPatient() {ex.Message}");
                throw;
            }
            Log.Debug($"[DBMapper] Patient added");
        }

        public void SelectPatient(int patientId)
        {
            Log.Debug($"[DBMapper] Selecting patient...");

            try
            {
                var updateLastSelectedDate = _connection.CreateCommand();
                updateLastSelectedDate.CommandText = @"UPDATE Patients SET LastSelectedDate = @LasteSelectedDate WHERE Id = @Id";

                updateLastSelectedDate.Parameters.Add(new SqliteParameter("@Id", patientId));
                updateLastSelectedDate.Parameters.Add(new SqliteParameter("@LasteSelectedDate", DateTime.Now));

                var res = updateLastSelectedDate.ExecuteNonQuery();

            }
            catch (Exception ex)
            {
                Log.Error($"[DBMapper] error on SelectPatient() {ex.Message}");
                throw;
            }
            Log.Debug($"[DBMapper] Patient selected");
        }

        public List<Patient> GetAllPAtients()
        {
            Log.Debug($"[DBMapper] Geting all patients...");

            var patients = new List<Patient>();

            try
            {
                    if (_connection.State == ConnectionState.Open)
                    {                    
                        var sql = @"SELECT * FROM Patients ORDER BY Id";

                        using var queryCommand = new SqliteCommand(sql, _connection);

                        var rd = queryCommand.ExecuteReader();

                        while (rd.Read())
                        {
                            var patient = new Patient();
                            patient.Id = rd.GetInt64(0);
                            patient.FamilyName = rd.GetString(1);
                            patient.GivenName = rd.GetString(2);
                            patient.LastSelectedDate = rd.GetDateTime(3);
                            patients.Add(patient);
                        }
                    }      

            }
            catch (Exception ex)
            {
                Log.Error($"[DBMapper] error on GetAllPAtients() {ex.Message}");
                throw;
            }
            Log.Debug($"[DBMapper] All patients got");
            return patients;

        }
        public bool Login(string username, string password)
        {
            Log.Debug($"[DBMapper] Logging in... {username} {password} ");

            var res = false;

            try
            {
                var updateLastSelectedDate = _connection.CreateCommand();

                updateLastSelectedDate.CommandText = $"SELECT * FROM Users WHERE Username = @Username AND Password = @Password";
                updateLastSelectedDate.Parameters.Add(new SqliteParameter("@Username", username));
                updateLastSelectedDate.Parameters.Add(new SqliteParameter("@Password", password));

                var rd = updateLastSelectedDate.ExecuteReader();

                while (rd.Read())
                {
                    res = true;
                }

            }
            catch (Exception ex)
            {
                Log.Error($"[DBMapper] error on Login() {ex.Message}");
                throw;
            }
            Log.Debug($"[DBMapper] Log in ended");

            return res;
        }
        public void deleteDB()
        {
            _connection.Close();
        }
        
    }
}
