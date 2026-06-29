'use client';

import React, { use } from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import { PublicLayout } from '@/layouts/PublicLayout';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Tag, User } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogDetails({ params }: PageProps) {
  const unwrappedParams = use(params);
  const { slug } = unwrappedParams;
  const { state } = useDatabase();
  
  const blog = state.blogs.find(b => b.slug === slug);

  if (!blog) {
    return (
      <PublicLayout>
        <div className="max-w-md mx-auto py-24 text-center space-y-4 font-inter">
          <span className="text-4xl">⚠️</span>
          <h2 className="text-xl font-bold font-poppins text-slate-900 dark:text-white">Article not found</h2>
          <p className="text-slate-500 text-xs">The article slug does not exist.</p>
          <Link href="/blog" className="inline-block py-2.5 px-6 bg-blue-600 text-white font-bold rounded-xl text-xs">
            Back to Blog
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <article className="max-w-4xl mx-auto px-4 py-12 font-inter space-y-8">
        
        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600">
          <ArrowLeft size={14} />
          <span>Back to Blog</span>
        </Link>

        {/* Article Meta */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="flex justify-center sm:justify-start items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1 text-blue-600"><Tag size={10} /> {blog.category}</span>
            <span>•</span>
            <span className="flex items-center gap-0.5"><Clock size={10} /> {blog.readTime}</span>
            <span>•</span>
            <span>{blog.date}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-poppins text-slate-900 dark:text-white leading-tight">
            {blog.title}
          </h1>
        </div>

        {/* Cover image */}
        <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-md bg-slate-200">
          <Image src={blog.coverImage} alt={blog.title} fill className="object-cover" priority />
        </div>

        {/* Grid: content vs Author card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
          
          {/* Content (Left) */}
          <div className="lg:col-span-8 space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            <div
              className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-350"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-slate-850">
              {blog.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-semibold">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Author Card (Right) */}
          <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-200">
                <Image src={blog.author.avatar} alt={blog.author.name} fill className="object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm font-poppins">{blog.author.name}</h4>
                <span className="text-[10px] text-slate-400">Author</span>
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
              {blog.author.bio}
            </p>
          </div>

        </div>

      </article>
    </PublicLayout>
  );
}
