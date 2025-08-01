﻿using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace BusinessObjects.Entities;

public partial class Orchid
{
    public int OrchidId { get; set; }

    public bool IsNatural { get; set; }

    public string? OrchidDescription { get; set; }

    public string OrchidName { get; set; } = null!;

    public string? OrchidUrl { get; set; }

    public decimal Price { get; set; }

    public int CategoryId { get; set; }

    [JsonIgnore]
    public virtual Category Category { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}
