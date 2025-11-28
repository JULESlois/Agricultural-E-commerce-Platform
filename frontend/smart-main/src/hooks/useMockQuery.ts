import { useEffect, useState, useCallback } from 'react';

export function useMockQuery<T>(queryFn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<Error | null>(null);

  const run = useCallback(async () => {
    setIsLoading(true);
    setIsError(null);
    try {
      const res = await queryFn();
      setData(res);
    } catch (e: any) {
      setIsError(e);
    } finally {
      setIsLoading(false);
    }
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  const retry = useCallback(() => {
    run();
  }, [run]);

  return { data, isLoading, isError, retry } as const;
}

