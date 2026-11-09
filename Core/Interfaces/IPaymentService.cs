using System;
using Core.Entities;

namespace Core.Interfaces;

public interface IPaymentService
{
    Task<ShoppingCart?> CreateOrUpdatePaymentIntent(string cartId);
    Task<long> CalculateDiscountInCentsAsync(AppCoupon coupon, long subtotalInCents);
    Task<(bool IsSucceeded, bool AmountMatches)> VerifyPaymentIntentAsync(
        string paymentIntentId, long expectedAmountInCents);
    Task<string> RefundPayment(string paymentIntentId);
}
