import { useEffect, useMemo, useState } from 'react';

type Loader<T> = (params: { page: number; pageSize: number } & Record<string, any>) => Promise<{ data: T[]; total: number; page: number; pageSize: number }>;

export function usePagingQuery<T>(loader: Loader<T>, initialParams: { page?: number; pageSize?: number } & Record<string, any> = {}) {
  const [params, setParams] = useState({ page: 1, pageSize: 10, ...initialParams });
  const [list, setList] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setIsError(null);
    loader(params)
      .then(resp => {
        if (!mounted) return;
        setList(resp.data);
        setTotal(resp.total);
      })
      .catch(e => {
        if (!mounted) return;
        setIsError(e as Error);
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [loader, params.page, params.pageSize, ...Object.values(params).filter(v => v !== params.page && v !== params.pageSize)]);

  const canLoadMore = useMemo(() => params.page * params.pageSize < total, [params.page, params.pageSize, total]);

  const setPage = (page: number) => setParams(p => ({ ...p, page }));
  const setPageSize = (pageSize: number) => setParams(p => ({ ...p, pageSize }));
  const update = (patch: Record<string, any>) => setParams(p => ({ ...p, page: 1, ...patch }));

  return { list, total, params, isLoading, isError, canLoadMore, setPage, setPageSize, update } as const;
}

