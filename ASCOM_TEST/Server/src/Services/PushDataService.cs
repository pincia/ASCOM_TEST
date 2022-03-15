using ASCOM_TEST.Hubs;
using log4net;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ASCOM_TEST.Services
{
    public class PushDataService : IHostedService
    {
        private static readonly ILog Log = LogManager.GetLogger(typeof(PushDataService));
        private readonly IHubContext<PatientsHub> _counterHubContext;
        private Timer _timer;
        private IData _dataService;

        public PushDataService(IHubContext<PatientsHub> patientsHubContext, IData dataService)
        {
            Log.Debug($"[SendDataService] initialized");

            _counterHubContext = patientsHubContext;
            _dataService = dataService; 
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            Log.Debug($"[SendDataService] starts push data");

            _timer = new Timer(PushData, null, TimeSpan.Zero, TimeSpan.FromSeconds(1));
            return Task.CompletedTask;
        }

        private void PushData(object state)
        {
            _counterHubContext.Clients.All.SendAsync("PatientsListMessage", JsonConvert.SerializeObject(_dataService.GetPatientsList())).ConfigureAwait(false);
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            Log.Debug($"[SendDataService] stop push data");

            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }
    }
}
