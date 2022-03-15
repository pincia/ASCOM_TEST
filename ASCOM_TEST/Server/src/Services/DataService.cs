using ASCOM_TEST.DAL;
using ASCOM_TEST.DM;
using log4net;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace ASCOM_TEST.Services
{
    public interface IData
    {
        List<Patient> GetPatientsList();
        string Login(string username, string password);
        void RemovePatient(long id);
        void AddPatient(Patient patient);
        void SelectPatient(int patientId);
    }

    public class DataService : IData
    {
        private static readonly ILog Log = LogManager.GetLogger(typeof(DataService));
        private DBMapper _dbMapper;
        public DataService()
        {
           _dbMapper = new DBMapper();
        }

        public List<Patient> GetPatientsList()
        {
            return _dbMapper.GetAllPAtients();          
        }

        public string Login(string username, string password)
        {
            Log.Debug($"[DataService] Login username:{username} password: {password}");

            var isLogged = _dbMapper.Login(username,password);

            if (isLogged)
            {
                return "FAKE_TOKEN";
            }
            else
            {
                return "";
            }
        }

        public void RemovePatient(long id)
        {
            Log.Debug($"[DataService] Remove Patient id:{id}");

            _dbMapper.RemovePatient(id);
        }

        public void AddPatient(Patient patient)
        {
            Log.Debug($"[DataService] Add Patient id:{JsonConvert.SerializeObject(patient)}");

            _dbMapper.AddPatient(patient);
        }

        public void SelectPatient(int patientId)
        {
            Log.Debug($"[DataService] Select Patient id:{patientId}");

            _dbMapper.SelectPatient(patientId);
        }
    }
}
