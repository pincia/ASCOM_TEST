using System;

namespace ASCOM_TEST.DM
{
    public class Patient
    {
        public long Id { get; set; }
        public string FamilyName { get; set; }
        public string GivenName { get; set; }
        public DateTime LastSelectedDate { get; set; }
    }
}
