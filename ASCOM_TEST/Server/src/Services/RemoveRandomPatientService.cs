using ASCOM_TEST.DM;
using log4net;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;

namespace ASCOM_TEST.Services
{
    public class RemoveRandomPatientService : IHostedService
    {
        private static readonly ILog Log = LogManager.GetLogger(typeof(RemoveRandomPatientService));
        private IData _dataService;
        private Timer _removeTimer;
        private Timer _addTimer;
        private Patient _removedPatient;

        public RemoveRandomPatientService(IData dataService)
        {
            Log.Debug($"[RemoveRandomPatientService] initialized");
            _dataService = dataService;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            Log.Debug($"[RemoveRandomPatientService] service started");

            _removeTimer = new Timer(RemovePatient, null, TimeSpan.Zero, TimeSpan.FromSeconds(10));
            _addTimer = new Timer(AddLastRemovedPatient, null, (TimeSpan.Zero + TimeSpan.FromSeconds(5)), TimeSpan.FromSeconds(10));
            return Task.CompletedTask;
        }

        private void RemovePatient(object state)
        {
            Log.Debug($"[RemoveRandomPatientService] Remove patient");

            var patients = _dataService.GetPatientsList();
    
            if (patients.Count > 0)
            {
                Random rnd = new Random();
                int randomIndex = rnd.Next(0, patients.Count);
                long patientId = patients[randomIndex].Id;

                var removedPatient = new Patient
                {
                    Id = patients[randomIndex].Id,
                    FamilyName = patients[randomIndex].FamilyName,
                    GivenName = patients[randomIndex].GivenName,
                    LastSelectedDate = patients[randomIndex].LastSelectedDate
                };

                _removedPatient = removedPatient;

                _dataService.RemovePatient(patientId);
            }
 
        }

        private void AddLastRemovedPatient(object state)
        {
            Log.Debug($"[RemoveRandomPatientService] Add last removed patient");
            AddPatient(_removedPatient);
        }

        private void AddPatient(Patient patient)
        {
            Log.Debug($"[RemoveRandomPatientService] Add patient Id:{patient.Id}");
            _dataService.AddPatient(patient);           
        
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            Log.Debug($"[RemoveRandomPatientService] service stopped");

            _removeTimer?.Change(Timeout.Infinite, 0);
            _addTimer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }
    }
}

