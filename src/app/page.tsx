"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This is a temporary redirect to the default locale.
export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/en');
  }, [router]);
  return null;
}
