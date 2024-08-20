import React from 'react';

interface PaginationProps {
  offset: number;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
}

export const Pagination: React.FC<PaginationProps> = ({ offset, setOffset }) => {
  return (
    <div className='flex mt-8 mb-8 justify-around'>
      {offset > 0 && (
        <button
          onClick={() => setOffset(offset - 10)}
          className='bg-blue-500 text-white px-4 py-2 rounded-md'
        >
          前へ
        </button>
      )}
      <button
        onClick={() => setOffset(offset + 10)}
        className='bg-blue-500 text-white px-4 py-2 rounded-md'
      >
        次へ
      </button>
    </div>
  );
};