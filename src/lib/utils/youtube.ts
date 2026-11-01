/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * OHDrug.com — A product of MuneerDataAI
 * YouTube URL parser for privacy-focused embed rendering
 */

/**
 * Extracts YouTube video ID and returns a privacy-enhanced youtube-nocookie embed URL.
 * Supports standard watch, short youtu.be, embed, shorts, and live stream URLs.
 */
export function getYouTubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // If already an embed URL, convert to youtube-nocookie
  if (trimmed.includes('youtube.com/embed/') || trimmed.includes('youtube-nocookie.com/embed/')) {
    const id = trimmed.split('/embed/')[1]?.split('?')[0];
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }

  // Common YouTube URL regex matching 11-char ID
  const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|(?:shorts\/))|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regExp);

  if (match && match[1]) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}`;
  }

  return null;
}

/**
 * Validates whether a string is a recognizable YouTube link
 */
export function isValidYouTubeUrl(url: string | null | undefined): boolean {
  return getYouTubeEmbedUrl(url) !== null;
}
