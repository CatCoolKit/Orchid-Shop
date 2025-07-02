using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace BusinessObjects.Entities;

public partial class Account
{
    public int AccountId { get; set; }

    public string AccountName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public int RoleId { get; set; }

    [JsonIgnore]
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual Role Role { get; set; } = null!;
}
