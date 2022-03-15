
using System;
using System.Threading.Tasks;
using ASCOM_TEST.DM;
using ASCOM_TEST.Services;
using Microsoft.AspNetCore.SignalR;

namespace ASCOM_TEST.Hubs
{
        public class PatientsHub : Hub
        {
        private IData _dataService;

        public PatientsHub(IData dataService)
        {
            _dataService = dataService;
        }
        public async Task SendMessage(PatientsListMessage message)
        {
            await Clients.All.SendAsync("PatientsListMessage", message).ConfigureAwait(false); ;
        }
        public async Task PatientSelected(int patientId)
        {
            _dataService.SelectPatient(patientId);
        }
    }
}
