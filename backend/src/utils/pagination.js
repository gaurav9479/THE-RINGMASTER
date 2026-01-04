/**
 * Apply pagination to a Mongoose query
 * @param {Query} query - Mongoose query object
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Number of items per page
 * @returns {Query} - Modified query with pagination applied
 */
export const paginate = (query, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return query.skip(skip).limit(limit);
};

/**
 * Generate pagination metadata for API responses
 * @param {number} total - Total number of documents
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {Object} - Pagination metadata
 */
export const getPaginationMeta = (total, page, limit) => ({
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1
});

/**
 * Build sort object from query parameters
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - 'asc' or 'desc'
 * @returns {Object} - MongoDB sort object
 */
export const buildSortObject = (sortBy = 'createdAt', sortOrder = 'desc') => {
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    return sortOptions;
};

export default { paginate, getPaginationMeta, buildSortObject };
