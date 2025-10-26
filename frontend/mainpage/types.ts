// FIX: Import ReactNode to resolve the 'Cannot find namespace React' error.
import type { ReactNode } from 'react';

export interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
  isHeadline: boolean;
  date: string;
  source: string;
  content: string[]; // Array of paragraphs for the article body
}

export interface Announcement {
  id: number;
  title: string;
  date: string;
}

export interface Expert {
  id: number;
  name: string;
  title: string;
  imageUrl: string;
  affiliation: string;
  tags: string[];
  bio: string[];
  researchFields: string[];
}

// --- E-commerce Types ---
export interface Review {
    id: string;
    author: string;
    rating: number; // 1 to 5
    comment: string;
    date: string;
}

export interface Seller {
    id: string;
    name: string;
    avatarUrl: string;
    rating: number; // 1 to 5
    totalSales: number;
    location: string;
    storeBio: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    imageUrl: string;
    images: string[];
    description: string;
    sellerId: string;
    categoryId: string;
    stock: number;
    shippingInfo: {
        origin: string;
        deliveryTime: string;
        guarantees: string[];
    };
    specs: { [key: string]: string };
    reviews: Review[];
}

export interface Category {
    id: string;
    name: string;
    imageUrl: string;
}


// --- Loan Platform Types ---
export interface LoanProduct {
  id: string;
  name: string;
  description: string;
  interestRate: string;
  loanTerm: string;
  amountRange: string;
  icon: ReactNode;
}

export interface LoanApplication {
  id: string;
  loanType: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Active' | 'Paid Off';
}


// --- User Community Types ---
export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  handle: string; // e.g., @chenxiaolin
  postCount?: number;
  followers?: number;
  following?: number;
  bio?: string;
}

export interface Comment {
    id: string;
    user: User;
    content: string;
    timestamp: string;
}

export interface Post {
    id:string;
    user: User;
    content: string;
    imageUrl?: string;
    timestamp: string;
    likes: number;
    comments: Comment[];
}