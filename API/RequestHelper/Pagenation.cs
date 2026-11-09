namespace API.RequestHelper
{
    public class Pagenation<T>(int pageIndex, int pageSize, int totalCount, IReadOnlyList<T> data)
    {
        public int PageIndex { get; set; } = pageIndex;
        public int PageSize { get; set; } = pageSize;
        public int TotalCount { get; set; } = totalCount;
        public IReadOnlyList<T> Data { get; set; } = data;
    }
}