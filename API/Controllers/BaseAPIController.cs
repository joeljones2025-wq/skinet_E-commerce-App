using System;
using API.RequestHelper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BaseApiController : ControllerBase
{
    protected async Task<ActionResult> CreatePagedResult<T>(IUnitOfWork unit,
        ISpecification<T> specification, int pageIndex, int pageSize) where T : BaseEntity
    {
        var repository = unit.Repository<T>();
        var items = await repository.ListAsync(specification);
        var totalItems = await repository.CountAsync(specification);
        var pagination = new Pagenation<T>(pageIndex, pageSize, totalItems, items);
        return Ok(pagination);
    }

    protected async Task<ActionResult> CreatePagedResult<T, TDto>(IGenericRepository<T> repo,
        ISpecification<T> spec, int pageIndex, int pageSize, Func<T, TDto> toDto)
            where T : BaseEntity, IDtoConvertible
            where TDto: class
    {
        var items = await repo.ListAsync(spec);
        var count = await repo.CountAsync(spec);

        var dtoItems = items.Select(toDto).ToList();

        var pagination = new Pagenation<TDto>(pageIndex, pageSize, count, dtoItems);

        return Ok(pagination);
    }
}