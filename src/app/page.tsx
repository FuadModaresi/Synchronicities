
"use client";

import { redirect } from 'next/navigation'

// This is a temporary redirect to the default locale.
export default function RootPage() {
  redirect('/en');
}
