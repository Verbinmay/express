import {PaginatorStart} from "./paginatorType";

export const paginator = (query: any): PaginatorStart => {
    return {
        searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null, //default null
        sortBy: query.sortBy ? query.sortBy : "createdAt",
        sortDirection: query.sortDirection ? query.sortDirection : "desc",
        pageNumber: query.pageNumber ? Number(query.pageNumber) : 1,
        pageSize: query.pageSize ? Number(query.pageSize) : 10,
        searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : null,
        searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : null,
    };
};


export const createFilterSort = (a: { sortBy: string, sortDirection: string }) => {
    return {[a.sortBy]: a.sortDirection === "desc" ? -1 : 1};
};

export const countTotalAndPages = async (a: {
                                             modelClass: any,
                                             filter: any,
                                             pageSize: number
                                         }
): Promise<{ pagesCount: number; totalCount: number }> => {
    const totalCount = await a.modelClass.countDocuments(a.filter);
    const pagesCount = Math.ceil(totalCount / a.pageSize);
    return {totalCount: totalCount, pagesCount: pagesCount};
};
