using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace Infrastructure.Services;

public class CouponService : ICouponService
{
    public CouponService(IConfiguration config)
    {
        var secretKey = config["StripeSettings:SecretKey"];
        if (string.IsNullOrWhiteSpace(secretKey))
        {
            throw new InvalidOperationException("Stripe secret key is not configured.");
        }

        StripeConfiguration.ApiKey = secretKey;
    }

    public async Task<AppCoupon?> GetCouponFromPromoCode(string code)
    {
        if (string.IsNullOrWhiteSpace(code))
        {
            return null;
        }

        var promotionService = new PromotionCodeService();

        var options = new PromotionCodeListOptions
        {
            Code = code.Trim(),
            Active = true,
            Limit = 1
        };

        var promotionCodes = await promotionService.ListAsync(options);

        var promotionCode = promotionCodes.FirstOrDefault();

        if (promotionCode != null && promotionCode.Coupon != null)
        {
            return new AppCoupon
            {
                Name = promotionCode.Coupon.Name,
                AmountOff = promotionCode.Coupon.AmountOff,
                PercentOff = promotionCode.Coupon.PercentOff,
                CouponId = promotionCode.Coupon.Id,
                PromotionCode = promotionCode.Code
            };
        }

        return null;
    }
}
