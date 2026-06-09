// hooks/usePaginatedSearch.js
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

 export const usePaginatedSearch = (fetchAction, selectData, selectLoading, extraParams = {}) => {
    const dispatch = useDispatch();
    const data = useSelector(selectData);
    const loading = useSelector(selectLoading);
    const [searchParams, setSearchParams] = useSearchParams();
        const query = searchParams.get("q") || "";
    const paramsPage = parseInt(searchParams.get("page") || "1");
    const paramsPageSize = parseInt(searchParams.get("pageSize") || "10");

    const [committed, setCommitted] = useState(false); // has user searched at least once?

    // Re-fetch when page changes (only after first search)
    useEffect(() => {
        if (committed) {
            dispatch(fetchAction({ page: paramsPage, pageSize: paramsPageSize, ...extraParams }));
        }
    }, [paramsPage]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setCommitted(true);
        setSearchParams({ q: query, page: 1, pageSize: paramsPageSize });
        dispatch(fetchAction({ q: query, page: 1, pageSize: paramsPageSize, ...extraParams }));
    };

    return { data, loading, paramsPage, paramsPageSize, searchParams, setSearchParams, handleSubmit };
};