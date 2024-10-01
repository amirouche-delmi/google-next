'use client'

import { Suspense } from 'react';
import ImageSearchResults from '@/components/ImageSearchResults';
import Link from 'next/link';
import Loading from './loading'; // Importez le composant loading

export default function ImageSearchPage({ searchParams }) {
  const startIndex = searchParams.start || '1';

  return (
    <Suspense fallback={<Loading />}> {/* Utilisez votre composant Loading ici */}
      <ImageSearchContent searchParams={searchParams} startIndex={startIndex} />
    </Suspense>
  );
}

async function ImageSearchContent({ searchParams, startIndex }) {
  // Simulating loading state
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const response = await fetch(
    `https://www.googleapis.com/customsearch/v1?key=${process.env.API_KEY}&cx=${process.env.CONTEXT_KEY}&q=${encodeURIComponent(searchParams.searchTerm)}&searchType=image&start=${startIndex}`
  );

  if (!response.ok) {
    return (
      <div className='flex flex-col justify-center items-center pt-10'>
        <h1 className='text-3xl mb-4'>Something went wrong.</h1>
        <p className='text-lg'>
          Please try again later or return to{' '}
          <Link href='/' className='text-blue-500'>Home</Link>.
        </p>
      </div>
    );
  }

  const data = await response.json();
  const results = data.items || [];

  if (results.length === 0) {
    return (
      <div className='flex flex-col justify-center items-center pt-10'>
        <h1 className='text-3xl mb-4'>
          No results found for &quot;{searchParams.searchTerm}&quot;
        </h1>
        <p className='text-lg'>
          Try searching the web or images for something else{' '}
          <Link href='/' className='text-blue-500'>Home</Link>.
        </p>
      </div>
    );
  }

  return <ImageSearchResults results={results} />;
}