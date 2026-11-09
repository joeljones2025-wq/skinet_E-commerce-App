using Core.Entities;
using Core.Interfaces;
using API.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/cart")]
public class CartController(ICartService cartService) : BaseApiController
{
    [HttpGet("{id}")]
    public async Task<ActionResult<ShoppingCart>> GetCartById(string id)
    {
        var cart = await cartService.GetCartAsync(id);

        return Ok(cart ?? new ShoppingCart { Id = id });
    }

    [HttpPost]
    public async Task<ActionResult<ShoppingCart>> UpdateCart([FromBody] ShoppingCart cart)
    {
        var updatedCart = await cartService.SetCartAsync(cart);

        return Ok(updatedCart);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCart(string id)
    {
        await cartService.DeleteCartAsync(id);
        return NoContent();
    }
}