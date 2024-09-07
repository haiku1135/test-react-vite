import { QueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});


let flagValue = false;

const listeners = new Set<(value: boolean) => void>();

export const setFlag = (value: boolean) => {
  flagValue = value;
  listeners.forEach(listener => listener(value));
};

export const useFlag = () => {
  const [flag, setLocalFlag] = useState(flagValue);

  useEffect(() => {
    const listener = (value: boolean) => setLocalFlag(value);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return flag;
};

// クエリフェッチ(GET)の開始と完了をログに出力
queryClient.getQueryCache().subscribe(event => {
  if (event.type === 'observerAdded') {
    console.log('クエリフェッチ開始', event.query.queryKey);
  }
  if (event.type === 'updated') {
    console.log('クエリフェッチ完了:', event.action.type, event.query.queryKey);
    setFlag(false);
  }
});

// ミューテーション(POST,PUT,DELETE)の開始と完了をログに出力
queryClient.getMutationCache().subscribe(event => {
  if (event.type === 'added') {
    console.log('ミューテーション開始');
  }
  if (event.type === 'updated' && event.action.type === 'success') {
    // ミューテーションが成功した場合の処理
    console.log('ミューテーション成功:', event.action.data);
    setFlag(true);
  }
  if (event.type === 'removed') {
    console.log('ミューテーション完了');
    setFlag(true);
  }
});