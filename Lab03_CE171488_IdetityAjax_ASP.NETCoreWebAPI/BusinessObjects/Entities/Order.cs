using System;
using System.Collections.Generic;

namespace BusinessObjects.Entities;

public partial class Order
{
    public int Id { get; set; }

    public int AccountId { get; set; }

    public DateTime OrderDate { get; set; }

    //Pending: "Chờ xử lý"       
    //Processing: "Đang xử lý"    
    //Confirmed: "Đã xác nhận"    
    //Shipping: "Đang giao"      
    //Delivered: "Đã giao"      
    //Cancelled: "Đã hủy"        
    public string OrderStatus { get; set; } = null!;

    public decimal TotalAmount { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}
