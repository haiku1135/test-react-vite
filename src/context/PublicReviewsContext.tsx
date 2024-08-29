import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { url } from '../const';

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
}

const PublicReviewContext = createContext<PublicReviewContextType | undefined>(undefined);

export const PublicReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${url}/public/books?offset=${offset}`);
        setReviews(res.data);
        setError(null);
      } catch (err) {
        setError('レビューの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [offset]);

  return (
    <PublicReviewContext.Provider value={{ reviews, offset, setOffset, loading, error }}>
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