'use client';

import React, { useState } from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import { PublicLayout } from '@/layouts/PublicLayout';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Tag, Clock } from 'lucide-react';

export default function BlogCatalog() {
  const { state } = useDatabase();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', 'Transparency', 'Nutrition', 'Education', 'Welfare'];

  const filtered = state.blogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || 
                          b.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || b.category === category;
    return matchesSearch && matchesCategory && b.published;
  });

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 font-inter space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold font-poppins text-slate-900 dark:text-white">
            OneHope Press & Updates
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Operational field reviews, nutritional studies, and transparency audit details from Rishikesh.
          </p>
        </div>

        {/* Toolbar */}
        <div className="space-y-4 max-w-xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 pl-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:border-blue-500 focus:outline-none text-slate-950 dark:text-white text-sm"
            />
            <Search className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
          </div>

          <div className="flex gap-2 justify-center overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                  category === cat
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-slate-900 text-slate-600 border-slate-100 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((blog) => (
            <div key={blog.id} className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-premium flex flex-col sm:flex-row items-stretch">
              <div className="relative aspect-video sm:aspect-square w-full sm:w-48 shrink-0 bg-slate-100">
                <Image src={blog.coverImage} alt={blog.title} fill className="object-cover group-hover:scale-103 transition-transform duration-500" />
              </div>
              
              <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Tag size={10} /> {blog.category}</span>
                    <span className="flex items-center gap-0.5"><Clock size={10} /> {blog.readTime}</span>
                  </div>
                  
                  <h3 className="font-bold text-slate-900 dark:text-white font-poppins text-base sm:text-lg leading-tight group-hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                  </h3>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-3">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-850">
                  <div className="flex items-center gap-2">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden">
                      <Image src={blog.author.avatar} alt={blog.author.name} fill className="object-cover" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-550 dark:text-slate-350">{blog.author.name}</span>
                  </div>
                  
                  <span className="text-[10px] text-slate-400 font-semibold">{blog.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-950 rounded-3xl text-xs text-slate-400 italic">
            No articles found matching search keywords.
          </div>
        )}

      </div>
    </PublicLayout>
  );
}
