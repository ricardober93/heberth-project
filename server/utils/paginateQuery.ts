// Función helper para crear respuesta paginada
async function paginateQuery<T>(
  query: any,
  countQuery: any,
  page: number,
  limit: number
): Promise<PaginatedResponse<T>> {
  const offset = (page - 1) * limit
  
  // Ejecutar consultas en paralelo para mejor rendimiento
  const [data, totalResult] = await Promise.all([
    query.offset(offset).limit(limit),
    countQuery
  ])
  
  const totalRecords = Number(totalResult[0].count)
  const totalPages = Math.ceil(totalRecords / limit)
  
  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalRecords,
      pageSize: limit,
      hasNext: page < totalPages,
      hasPrevious: page > 1
    }
  }
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export { paginateQuery };