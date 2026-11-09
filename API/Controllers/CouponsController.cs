using Core.Entities;
using Core.Interfaces;
using API.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class CouponsController(
    ICouponService couponService,
    ICartService cartService) : BaseApiController
{
    [HttpPost("apply")]
    public async Task<ActionResult<ShoppingCart>> ApplyCoupon(
        [FromQuery] string cartId,
        [FromBody] ApplyCouponRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Code))
        {
            return BadRequest("Coupon code is required.");
        }

        var cart = await cartService.GetCartAsync(cartId);
        if (cart is null)
        {
            return NotFound("Cart not found.");
        }

        var coupon = await couponService.GetCouponFromPromoCode(request.Code);
        if (coupon is null)
        {
            return BadRequest("Coupon code is invalid or inactive.");
        }

        cart.Coupon = coupon;
        var updatedCart = await cartService.SetCartAsync(cart);

        return updatedCart is null
            ? Problem("Could not save the coupon to the cart.")
            : Ok(updatedCart);
    }

    public sealed record ApplyCouponRequest(string Code);
}
