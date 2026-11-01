/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * OHDrug.com — A product of MuneerDataAI
 * CMS Blog Editor Modal with Live Markdown Split-Preview
 * Enforces <200KB Client-Side Image Compression into 'blog-images' Supabase Bucket
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Eye, 
  Edit3, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  FileCode2, 
  Image as ImageIcon,
  Check,
  Clock,
  Globe,
  Lock,
  Video,
  Play
} from 'lucide-react';
import { compressImage } from '@/src/lib/utils/imageCompressor';
import { getYouTubeEmbedUrl, isValidYouTubeUrl } from '@/src/lib/utils/youtube';
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase/client';
import type { Blog } from '@/src/types/database';

interface BlogEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (blog: Blog) => void;
  initialBlog?: Blog | null;
}

export function BlogEditorModal({
  isOpen,
  onClose,
  onSaved,
  initialBlog,
}: BlogEditorModalProps) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [category, setCategory] = useState('Medicine Info');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [readingTime, setReadingTime] = useState<number>(5);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  // Editor View Mode: 'write' | 'preview' | 'split'
  const [viewMode, setViewMode] = useState<'write' | 'preview' | 'split'>('split');
  
  // Image Upload & Compressor State
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStats, setCompressionStats] = useState<{
    originalKB: number;
    compressedKB: number;
  } | null>(null);

  // Form Submission & Toast State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Auto calculate reading time based on content word count
  const calculateReadingTime = (text: string) => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  };

  // Populate initial values when modal opens
  useEffect(() => {
    if (initialBlog) {
      setTitle(initialBlog.title);
      setSlug(initialBlog.slug);
      setIsSlugManual(true);
      setCategory(initialBlog.category || 'Medicine Info');
      setExcerpt(initialBlog.excerpt || '');
      setContent(initialBlog.content);
      setVideoUrl(initialBlog.video_url || '');
      setCoverImageUrl(initialBlog.cover_image_url || '');
      setIsPublished(initialBlog.is_published || initialBlog.published || false);
      setReadingTime(calculateReadingTime(initialBlog.content));
    } else {
      setTitle('');
      setSlug('');
      setIsSlugManual(false);
      setCategory('Medicine Info');
      setExcerpt('');
      setVideoUrl('');
      const defaultContent = `### Executive Summary

Detail the core pharmaceutical data pipeline or automation architecture problem here.

\`\`\`python
# Example: High-throughput ingestion worker
async def process_batch(records):
    pass
\`\`\`

### Technical Implementation Gates

1. Step one of automated extraction pipeline
2. Step two with strict schema validation
3. Step three storage output with RLS enforcement
`;
      setContent(defaultContent);
      setReadingTime(calculateReadingTime(defaultContent));
      setCoverImageUrl('');
      setIsPublished(false);
    }
    setCompressionStats(null);
    setFeedback(null);
  }, [initialBlog, isOpen]);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManual) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  };

  const handleContentChange = (val: string) => {
    setContent(val);
    setReadingTime(calculateReadingTime(val));
  };

  // Image Upload handler enforcing <200KB client compression
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    setFeedback(null);

    try {
      // 1. Run client-side HTML5 canvas compression to guarantee <200KB
      const compressed = await compressImage(file, {
        maxSizeKB: 200,
        outputType: 'image/webp',
      });

      setCompressionStats({
        originalKB: compressed.originalSizeKB,
        compressedKB: compressed.compressedSizeKB,
      });

      // 2. Upload to Supabase Storage if configured
      if (isSupabaseConfigured) {
        const fileExt = 'webp';
        const fileName = `${Date.now()}-${slug || 'cover'}.${fileExt}`;
        const filePath = `articles/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(filePath, compressed.file, {
            contentType: 'image/webp',
            upsert: true,
          });

        if (uploadError) {
          throw new Error(`Storage upload error: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from('blog-images')
          .getPublicUrl(filePath);

        setCoverImageUrl(publicUrlData.publicUrl);
      } else {
        // Fallback object URL for instant preview testing
        const previewUrl = URL.createObjectURL(compressed.file);
        setCoverImageUrl(previewUrl);
      }
    } catch (err: any) {
      console.error(err);
      setFeedback({
        type: 'error',
        message: err.message || 'Image compression/upload failed.',
      });
    } finally {
      setIsCompressing(false);
    }
  };

  // Save / Publish handler
  const handleSave = async (targetPublishedStatus: boolean) => {
    if (!title.trim() || !slug.trim() || !content.trim()) {
      setFeedback({
        type: 'error',
        message: 'Please provide Title, Slug, and Article Markdown content.',
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const blogRecord: Partial<Blog> = {
      title: title.trim(),
      slug: slug.trim(),
      category,
      excerpt: excerpt.trim() || null,
      content: content.trim(),
      cover_image_url: coverImageUrl || null,
      video_url: videoUrl.trim() || null,
      is_published: targetPublishedStatus,
      tags: [category, 'MuneerDataAI', 'Architecture'],
      author_id: 'muneer-data-ai-architect',
      updated_at: new Date().toISOString(),
    };

    try {
      if (isSupabaseConfigured) {
        if (initialBlog?.id) {
          // Update existing
          const { data, error } = await (supabase.from('blogs') as any)
            .update(blogRecord)
            .eq('id', initialBlog.id)
            .select()
            .single();

          if (error) throw new Error(error.message);
          onSaved(data);
        } else {
          // Insert new
          const { data, error } = await (supabase.from('blogs') as any)
            .insert({
              ...blogRecord,
              created_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (error) throw new Error(error.message);
          onSaved(data);
        }
      } else {
        // Local simulation fallback
        const simulated: Blog = {
          id: initialBlog?.id || `blog-${Date.now().toString(36)}`,
          title: blogRecord.title!,
          slug: blogRecord.slug!,
          category: blogRecord.category!,
          excerpt: blogRecord.excerpt || null,
          content: blogRecord.content!,
          cover_image_url: blogRecord.cover_image_url || null,
          video_url: blogRecord.video_url || null,
          is_published: targetPublishedStatus,
          published: targetPublishedStatus,
          tags: blogRecord.tags || [],
          author_id: 'muneer-data-ai-architect',
          created_at: initialBlog?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          reading_time: '5 min read', // <-- Yeh line add kar dein
        };
        await new Promise((resolve) => setTimeout(resolve, 600));
        onSaved(simulated);
      }

      setFeedback({
        type: 'success',
        message: targetPublishedStatus
          ? 'Article published successfully to knowledge hub.'
          : 'Article draft saved successfully.',
      });

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to save blog to Supabase.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Editor Modal Window */}
      <div className="relative w-full max-w-6xl bg-[#111827] border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[92vh] z-10 overflow-hidden text-left">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0c101a]">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Edit3 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {initialBlog ? 'Edit Knowledge Hub Article' : 'Create Technical Publication'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Supabase CMS &amp; Markdown Pipeline · A product of <span className="text-emerald-400 font-semibold">MuneerDataAI</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Segmented Controls */}
            <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setViewMode('write')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  viewMode === 'write' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  viewMode === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Preview
              </button>
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  viewMode === 'split' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Split View
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Feedback Banner / Toast */}
        {feedback && (
          <div
            className={`px-6 py-2.5 text-xs flex items-center gap-2 border-b ${
              feedback.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                : 'bg-red-950/40 border-red-800 text-red-300'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-400" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Metadata Section (Title, Slug, Category, Reading Time, Published Status, Excerpt) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Title */}
            <div className="md:col-span-8">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Article Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., High-Throughput Scraper Clustering with Playwright..."
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Category (3 Editorial Columns) */}
            <div className="md:col-span-4">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Dispatch Column <span className="text-rose-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
              >
                <option value="Medicine Info">Medicine Info (WHO EML, ATC, Dosage)</option>
                <option value="Data Analytics">Data Analytics (Kaggle, Price Trends)</option>
                <option value="MedTech News">MedTech News (Automation, AI, Research)</option>
              </select>
            </div>

            {/* Slug */}
            <div className="md:col-span-5">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  URL Slug (Auto-Generated) <span className="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsSlugManual(!isSlugManual)}
                  className="text-[11px] text-blue-400 hover:underline"
                >
                  {isSlugManual ? 'Reset Auto' : 'Edit Slug'}
                </button>
              </div>
              <div className="flex items-center rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-slate-400">
                <span className="font-mono text-slate-500 shrink-0">/blog/</span>
                <input
                  type="text"
                  value={slug}
                  disabled={!isSlugManual}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-transparent font-mono text-white outline-none pl-1 disabled:text-slate-400"
                />
              </div>
            </div>

            {/* Reading Time Input */}
            <div className="md:col-span-3">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Reading Time (Minutes)
              </label>
              <div className="flex items-center rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white">
                <Clock className="h-3.5 w-3.5 text-slate-500 mr-2 shrink-0" />
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={readingTime}
                  onChange={(e) => setReadingTime(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full bg-transparent font-mono text-white outline-none"
                />
                <span className="text-[11px] text-slate-500 font-mono">min</span>
              </div>
            </div>

            {/* Published Status Toggle */}
            <div className="md:col-span-4 flex flex-col justify-end">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Publication Status
              </label>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-700">
                <span className="text-xs font-medium text-slate-300">
                  {isPublished ? 'Published to Hub' : 'Draft Only'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsPublished(!isPublished)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isPublished ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      isPublished ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Cover Image Upload (<200KB Compression) */}
            <div className="md:col-span-12">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Cover Image (Egress Policy: &lt;200KB WebP)
              </label>
              <div className="flex items-center gap-3">
                <label 
                  htmlFor="blog-cover-upload"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer text-center"
                >
                  {isCompressing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                      <span>Compressing client-side with HTML5 Canvas...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 text-emerald-400" />
                      <span>Upload &amp; Auto-Compress to &lt;200KB WebP</span>
                    </>
                  )}
                  <input
                    id="blog-cover-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    disabled={isCompressing}
                    className="hidden"
                  />
                </label>
                {coverImageUrl && (
                  <div className="h-10 w-16 rounded overflow-hidden border border-slate-700 shrink-0 bg-slate-900">
                    <img src={coverImageUrl} alt="Cover preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
              {compressionStats && (
                <div className="mt-1 text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Compressed from {compressionStats.originalKB}KB to {compressionStats.compressedKB}KB WebP (Under 200KB bucket limit).</span>
                </div>
              )}
            </div>

            {/* YouTube Video Embed URL */}
            <div className="md:col-span-12">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Video URL (YouTube Embed for Case Studies, Kaggle Breakdowns &amp; WHO Walkthroughs)
              </label>
              <div className="flex items-center rounded-lg bg-slate-900 border border-slate-700 px-3.5 py-2 text-xs text-white">
                <Video className="h-4 w-4 text-rose-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="e.g., https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  className="w-full bg-transparent font-mono text-xs text-white placeholder-slate-500 outline-none"
                />
                {videoUrl && (
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono shrink-0 ${
                    isValidYouTubeUrl(videoUrl)
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950/60 text-amber-400 border border-amber-800'
                  }`}>
                    {isValidYouTubeUrl(videoUrl) ? 'Valid YouTube URL' : 'Invalid Link'}
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Embedded directly into the top hero spotlight and article reader using privacy-enhanced <code className="text-slate-400">youtube-nocookie.com</code>.
              </p>
            </div>

            {/* Excerpt */}
            <div className="md:col-span-12">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Executive Excerpt (Search Snippet Direct Answer)
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="2-sentence summary providing direct answer value for search snippets and article listings..."
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 outline-none resize-none"
              />
            </div>
          </div>

          {/* Markdown Editor & Instant Live Preview */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60">
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-900 text-xs font-medium text-slate-400 flex items-center justify-between">
              <span>Markdown Article Body</span>
              <span className="font-mono text-[11px] text-slate-500">
                {content.split(/\s+/).filter(Boolean).length} words · ~{readingTime} min read
              </span>
            </div>

            <div className={`grid ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800' : 'grid-cols-1'}`}>
              
              {/* Write Pane */}
              {(viewMode === 'write' || viewMode === 'split') && (
                <div className="p-4">
                  <textarea
                    rows={14}
                    value={content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Write article in Markdown. Use ### headers, ```code blocks, bullet points..."
                    className="w-full h-80 bg-transparent font-mono text-xs text-slate-100 placeholder-slate-600 outline-none resize-none leading-relaxed"
                  />
                </div>
              )}

              {/* Preview Pane */}
              {(viewMode === 'preview' || viewMode === 'split') && (
                <div className="p-4 bg-[#0a0e18] overflow-y-auto max-h-80 text-left">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Instant Live Preview
                  </div>
                  <div className="prose prose-invert prose-blue max-w-none text-xs text-slate-300">
                    <h2 className="text-base font-bold text-white mb-2">{title || 'Untitled Article'}</h2>
                    {excerpt && (
                      <p className="p-2.5 rounded bg-blue-950/20 border border-blue-900/40 text-blue-200 text-[11px] italic mb-3">
                        {excerpt}
                      </p>
                    )}
                    {videoUrl && isValidYouTubeUrl(videoUrl) && (
                      <div className="my-3 aspect-video w-full rounded-lg overflow-hidden border border-slate-800 bg-black">
                        <iframe
                          src={getYouTubeEmbedUrl(videoUrl) || ''}
                          title="YouTube Video Preview"
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                    <div className="whitespace-pre-wrap leading-relaxed font-sans text-xs text-slate-200">
                      {content}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Modal Footer with Actions (Save Draft & Publish Article) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-800 bg-[#0c101a]">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-white">Author Attribution:</span>
            <span>Muneer (muneerdev.com)</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow transition-colors cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Publish Article</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
