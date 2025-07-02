using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace BusinessObjects.Entities;

public partial class Role
{
    public int RoleId { get; set; }

    public string RoleName { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<Account> Accounts { get; set; } = new List<Account>();
}
