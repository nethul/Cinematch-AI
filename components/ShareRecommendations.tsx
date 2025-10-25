import React, { useState, useRef, useEffect } from 'react';
import { MovieRecommendation } from '../types';

interface ShareRecommendationsProps {
  recommendations: MovieRecommendation[];
  // optional: baseUrl to include in the shared message (defaults to README placeholder)
  baseUrl?: string;
}

const ShareRecommendations: React.FC<ShareRecommendationsProps> = ({ recommendations, baseUrl = 'https://your-domain.example/' }) => {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const titles = recommendations.map(r => r.title).join(', ');
  const shortTitles = recommendations.map(r => r.title).slice(0, 5).join(', ');

  // Create a shareable URL that encodes the recommendations into the query string
  // so recipients can open the link and see the same recommendations.
  const encodedRecommendations = encodeURIComponent(JSON.stringify(recommendations));
  const shareLink = `${baseUrl}?shared=${encodedRecommendations}`;

  const shareText = `I got these AI-based movie recommendations from Cinematch AI:\n\n${shortTitles}\n\nWhat will you get?\n\nCheck it out yourself: ${shareLink}`;

  const twitterText = encodeURIComponent(`I got these AI-based movie recommendations from Cinematch AI: ${shortTitles}. What will you get? Try it: ${shareLink}`);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${twitterText}`;
  const whatsappText = encodeURIComponent(`I got these AI-based movie recommendations from Cinematch AI: ${shortTitles}. Try it: ${baseUrl}`);
  const whatsappUrl = `https://wa.me/?text=${whatsappText}`;
  const mailtoText = encodeURIComponent(`I got these AI-based movie recommendations from Cinematch AI: ${titles}.\n\nTry it: ${baseUrl}`);
  const mailtoUrl = `mailto:?subject=${encodeURIComponent('My Cinematch AI recommendations')}&body=${mailtoText}`;

  const handleNativeShare = async () => {
    try {
      if ((navigator as any).share) {
        await (navigator as any).share({
          title: 'My Cinematch AI recommendations',
          text: shareText,
          url: baseUrl,
        });
      } else {
        await handleCopy();
      }
    } catch (err) {
      console.error('Native share failed', err);
      await handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      // fallback
      try {
        const el = document.createElement('textarea');
        el.value = shareText;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (e) {
        console.error('Copy fallback failed', e);
      }
    }
  };

  // Close popover when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex items-center justify-end gap-3 mb-6 relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-4 py-2 rounded-md shadow hover:shadow-cyan-500/30 transition"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M15 8a3 3 0 10-2.83-4H9.41l1.3 1.3a1 1 0 01-1.42 1.42L8 5.41 6.71 6.7A1 1 0 115.29 5.29L6.59 4H4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8h-3z" />
        </svg>
        Share
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-20">
          <div className="p-3">
            <div className="text-sm text-slate-300 mb-2">Share your recommendations</div>
            <button
              onClick={handleNativeShare}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-700 transition text-white flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.83-4H9.41l1.3 1.3a1 1 0 01-1.42 1.42L8 5.41 6.71 6.7A1 1 0 115.29 5.29L6.59 4H4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8h-3z" />
              </svg>
              Share with your Friends
            </button>

            <button
              onClick={handleCopy}
              className="w-full text-left mt-2 px-3 py-2 rounded-md hover:bg-slate-700 transition text-white flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4a2 2 0 00-2 2v12h2V3h12V1zM20 5H8a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2zm0 16H8V7h12v14z" />
              </svg>
              {copied ? 'Copied message' : 'Copy message'}
            </button>

            {/* <div className="flex gap-2 mt-3">
              <a href={twitterUrl} target="_blank" rel="noreferrer" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-2 rounded-md text-center text-sm">Twitter</a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-2 rounded-md text-center text-sm">WhatsApp</a>
            </div> */}

            {/* <a href={mailtoUrl} className="block mt-3 text-sm text-slate-400 hover:text-slate-200">Share by email</a> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareRecommendations;
