import axios from 'axios';
import { url } from '../const';
import { createContext, useState, useContext, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useFlag } from '../queryClient';

interface Review {
  id: string;
  title: string;
  url: string;
  detail: string;
  review: string;
  reviewer: string;
}

interface PublicReviewContextType {
  reviews: Review[];
  offset: number;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const PublicReviewContext = createContext<PublicReviewContextType | undefined>(undefined);

export const PublicReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [offset, setOffset] = useState(0);
  const flag = useFlag();
  const queryClient = useQueryClient();

  const fetchReviews = async () => {
    const res = await axios.get(`${url}/public/books?offset=${offset}`);
    return res.data;
  };

  const { data: reviews, isLoading, error, refetch } = useQuery({
    queryKey: ['books', offset],
    queryFn: fetchReviews,
    staleTime: 5000,
  });

  // flagが変更されたときにクエリを無効化
  useEffect(() => {
    if (flag) {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    }
  }, [flag, queryClient]);

  return (
    <PublicReviewContext.Provider value={{ 
      reviews: reviews || [], 
      offset, 
      setOffset, 
      loading: isLoading, 
      error: error ? error.message : null,
      refetch
    }}>
      {children}
    </PublicReviewContext.Provider>
  );
};

export const usePublicReview = () => {
  const context = useContext(PublicReviewContext);
  if (context === undefined) {
    throw new Error('usePublicReview must be used within a PublicReviewProvider');
  }
  return context;
};