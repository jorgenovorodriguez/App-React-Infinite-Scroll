import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ResponseAPI } from "../interfaces";
import { fetcher } from "../utils/getNextPage";

export const useCharacter = () => {
    
    const { data, error, fetchNextPage, status, hasNextPage } = useInfiniteQuery(
        ['characters'],

        ({ pageParam = 1 }) => fetcher(pageParam),
        {
            getNextPageParam: (lastPage: ResponseAPI) => {

                const previousPage = lastPage.info.prev ? +lastPage.info.prev.split('=')[1] : 0
                const currentPage = previousPage + 1;

                if (currentPage === lastPage.info.pages) return false;
                return currentPage + 1;
            }
        }
    )

    const characters = useMemo(() => data?.pages.reduce((prev, page) => {
        return {
          info: page.info,
          results: [...prev.results, ...page.results]
        }
    }), [data])

    return {
        error, fetchNextPage, status, hasNextPage, characters, data
    }
}