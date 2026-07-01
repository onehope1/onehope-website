'use client';

import React, { useState } from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import { PublicLayout } from '@/layouts/PublicLayout';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Bookmark, MessageSquare, Share2, MapPin, ArrowRight, PlayCircle, Send, X } from 'lucide-react';

export default function StoriesReel() {
  const { state, likeStory, bookmarkStory, addStoryComment } = useDatabase();
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [showCommentsId, setShowCommentsId] = useState<string | null>(null);

  const renderMedia = (story: any) => {
    const url = story.media?.[0]?.url || '';
    const type = story.media?.[0]?.type || 'image';

    const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
    const isInstagram = url.includes('instagram.com');
    const isVimeo = url.includes('vimeo.com');
    const isDirectVideo = url.includes('.mp4') || url.includes('.webm') || url.includes('.ogg');

    if (type === 'video' || isYoutube || isInstagram || isVimeo || isDirectVideo) {
      if (isYoutube) {
        let videoId = '';
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (match) videoId = match[1];
        const embedUrl = videoId 
          ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0`
          : url;
        return (
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full object-cover z-0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            style={{ border: 'none' }}
          />
        );
      }
      
      if (isInstagram) {
        let cleanUrl = url.split('?')[0];
        if (!cleanUrl.endsWith('/')) cleanUrl += '/';
        const embedUrl = `${cleanUrl}embed`;
        return (
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full object-cover z-0"
            allowFullScreen
            scrolling="no"
            style={{ border: 'none' }}
          />
        );
      }

      return (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-85"
          key={url}
        >
          <source src={url} type="video/mp4" />
        </video>
      );
    }

    return (
      <Image
        src={url || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400'}
        alt={story.title}
        fill
        sizes="(max-w-md) 100vw"
        className="object-cover opacity-80"
        priority
      />
    );
  };
  const [commentText, setCommentText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleLike = (id: string) => {
    likeStory(id);
  };

  const handleBookmark = (id: string) => {
    bookmarkStory(id);
  };

  const handleShare = (id: string) => {
    const shareUrl = `${window.location.origin}/stories/${id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAddComment = (e: React.FormEvent, storyId: string) => {
    e.preventDefault();
    if (!state.currentUser) return alert('Please log in using the header Portal to comment.');
    if (!commentText.trim()) return;

    addStoryComment(storyId, commentText);
    setCommentText('');
  };

  const currentComments = state.stories.find(s => s.id === showCommentsId)?.comments || [];

  return (
    <PublicLayout>
      <div className="max-w-md mx-auto py-4 px-4 font-inter flex flex-col justify-center min-h-[82vh] sm:min-h-0">
        
        {/* Reels Frame */}
        <div className="relative stories-container rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 w-full aspect-[9/16] max-h-[72vh] md:max-h-[600px] mx-auto">
          {state.stories.map((story, index) => {
            const hasLiked = state.currentUser ? story.likedBy.includes(state.currentUser.id) : false;
            const hasBookmarked = state.currentUser ? state.currentUser.savedStories.includes(story.id) : false;
            const relatedCamp = state.campaigns.find(c => c.id === story.campaignId);

            return (
              <div
                key={story.id}
                className="story-card-snap h-full w-full relative flex flex-col justify-end p-6"
                style={{ display: activeStoryIdx === index ? 'flex' : 'none' }}
              >
                {/* Visual Media Background */}
                {renderMedia(story)}
                
                {/* Darkness gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />

                {/* Right side floating controls */}
                <div className="absolute right-4 bottom-24 z-20 flex flex-col items-center gap-6">
                  {/* Like Button */}
                  <button
                    onClick={() => handleLike(story.id)}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:scale-105 active:scale-95 transition-all text-white">
                      <Heart size={20} className={hasLiked ? 'fill-red-500 text-red-500' : ''} />
                    </div>
                    <span className="text-[10px] font-bold text-white shadow-sm">{story.likes}</span>
                  </button>

                  {/* Comments Drawer Trigger */}
                  <button
                    onClick={() => setShowCommentsId(story.id)}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:scale-105 active:scale-95 transition-all text-white">
                      <MessageSquare size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-white shadow-sm">{story.comments.length}</span>
                  </button>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => handleBookmark(story.id)}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:scale-105 active:scale-95 transition-all text-white">
                      <Bookmark size={18} className={hasBookmarked ? 'fill-emerald-400 text-emerald-400' : ''} />
                    </div>
                    <span className="text-[10px] font-bold text-white shadow-sm">Save</span>
                  </button>

                  {/* Share button */}
                  <button
                    onClick={() => handleShare(story.id)}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:scale-105 active:scale-95 transition-all text-white">
                      <Share2 size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-white shadow-sm">
                      {copiedId === story.id ? 'Copied' : 'Share'}
                    </span>
                  </button>
                </div>

                {/* Bottom Story Description Information */}
                <div className="relative z-20 space-y-3.5 pr-14 text-white">
                  {/* Author Meta */}
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20">
                      <Image src={story.authorAvatar} alt={story.author} fill className="object-cover" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block leading-tight">{story.author}</span>
                      <span className="text-[9px] text-slate-400 flex items-center gap-0.5"><MapPin size={8} /> {story.location}</span>
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <div>
                    <h3 className="font-poppins font-extrabold text-sm sm:text-base leading-snug text-emerald-400">
                      {story.title}
                    </h3>
                    <p className="text-xs text-slate-350 leading-relaxed mt-1 line-clamp-3">
                      {story.description}
                    </p>
                  </div>

                  {/* Related Campaign Link */}
                  {relatedCamp && (
                    <Link
                      href={`/campaigns/${relatedCamp.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/90 hover:bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-md transition-colors"
                    >
                      <span>Sponsor: {relatedCamp.category}</span>
                      <ArrowRight size={10} />
                    </Link>
                  )}
                </div>

              </div>
            );
          })}

          {/* Swipe navigation buttons for desktop users */}
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <button
              onClick={() => setActiveStoryIdx(prev => Math.max(0, prev - 1))}
              disabled={activeStoryIdx === 0}
              className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-black/40 border border-white/10 text-white disabled:opacity-30"
            >
              Prev
            </button>
            <button
              onClick={() => setActiveStoryIdx(prev => Math.min(state.stories.length - 1, prev + 1))}
              disabled={activeStoryIdx === state.stories.length - 1}
              className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-black/40 border border-white/10 text-white disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>

        {/* Swipe indicator label */}
        <p className="text-center text-slate-400 text-xs mt-3">
          Showing Story {activeStoryIdx + 1} of {state.stories.length}
        </p>

      </div>

      {/* Floating Comments Panel Modal */}
      <AnimatePresence>
        {showCommentsId && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCommentsId(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="relative bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 max-w-md w-full h-[70vh] sm:h-96 shadow-2xl z-10 border border-slate-100 dark:border-slate-800 flex flex-col justify-between font-inter"
            >
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-850">
                  <h3 className="font-bold text-slate-900 dark:text-white font-poppins text-sm">
                    Reel Comments ({currentComments.length})
                  </h3>
                  <button onClick={() => setShowCommentsId(null)} className="text-slate-400 hover:text-slate-600">
                    <X size={18} />
                  </button>
                </div>

                {/* Comments List scrollable section */}
                <div className="h-44 sm:h-48 overflow-y-auto space-y-3 pt-3 scrollbar-none">
                  {currentComments.map((comm) => (
                    <div key={comm.id} className="flex gap-2 text-xs">
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                        <Image src={comm.userAvatar} alt={comm.userName} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="flex gap-2 text-slate-400">
                          <span className="font-bold text-slate-900 dark:text-white">{comm.userName}</span>
                          <span>{comm.date}</span>
                        </div>
                        <p className="text-slate-650 dark:text-slate-350 leading-relaxed">{comm.text}</p>
                      </div>
                    </div>
                  ))}
                  {currentComments.length === 0 && (
                    <p className="text-center text-slate-400 text-xs italic py-10">No comments yet. Support this story!</p>
                  )}
                </div>
              </div>

              {/* Comment submit form */}
              <form
                onSubmit={(e) => handleAddComment(e, showCommentsId)}
                className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-850 mt-auto"
              >
                <input
                  type="text"
                  placeholder="Add comments of hope..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-grow px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                >
                  <Send size={12} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PublicLayout>
  );
}
