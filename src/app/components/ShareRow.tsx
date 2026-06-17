// src/app/components/ShareRow.tsx
// Twitter, FB, CopyLink, Spotify buttons
"use client";

import React from 'react';
import { FaFacebook, FaInstagram, FaLink } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6'; // Using FaXTwitter for the X logo
// import {
//   FacebookShareButton, FacebookIcon,
//   TwitterShareButton, TwitterIcon,
//   // LinkedinShareButton, LinkedinIcon, // Example, not in brief
//   // EmailShareButton, EmailIcon, // Example
// } from 'react-share';
// import { CopyToClipboard } from 'react-copy-to-clipboard'; // If using this specific library

interface ShareRowProps {
  urlToShare: string;
  titleToShare: string;
  // onCopy?: () => void; // Callback for copy action
}

const ShareRow: React.FC<ShareRowProps> = ({ urlToShare /*, titleToShare */ }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(urlToShare).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2s
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div className="flex items-center space-x-3 my-4">
      <p className="text-sm font-medium">Share:</p>
      
      {/* Twitter */}
      <button title="Share on X" className="p-2 rounded-full hover:bg-gray-200 text-gray-700 hover:text-black transition-colors" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(urlToShare)}`, '_blank')}>
        <FaXTwitter size={20} />
      </button>

      {/* Facebook */}
      <button title="Share on Facebook" className="p-2 rounded-full hover:bg-gray-200 text-gray-700 hover:text-blue-600 transition-colors" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlToShare)}`, '_blank')}>
        <FaFacebook size={20} />
      </button>

      {/* Copy Link */}
      <button 
        onClick={handleCopy}
        title="Copy Link"
        className={`p-2 rounded-full hover:bg-gray-200 text-gray-700 transition-colors ${copied ? 'text-green-600' : 'hover:text-black'}`}
      >
        {copied ? 'Copied!' : <FaLink size={20} />}
      </button>
    </div>
  );
};

export default ShareRow;
