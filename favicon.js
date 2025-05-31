// Simple script to generate a favicon dynamically
document.addEventListener('DOMContentLoaded', function() {
  // Create a link element for the favicon
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = 'favicon.svg';
  
  // Append to head
  document.head.appendChild(link);
  
  // Also create a fallback favicon for browsers that don't support SVG
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, 32, 32);
  gradient.addColorStop(0, '#2563eb');
  gradient.addColorStop(1, '#e11d48');
  
  // Draw background
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);
  
  // Draw text
  ctx.fillStyle = 'white';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ED', 16, 16);
  
  // Create PNG favicon for fallback
  const pngLink = document.createElement('link');
  pngLink.rel = 'icon';
  pngLink.type = 'image/png';
  pngLink.href = canvas.toDataURL('image/png');
  
  // Add alternative favicon for browsers that don't support SVG
  document.head.appendChild(pngLink);
});
