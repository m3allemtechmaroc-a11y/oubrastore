const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Backgrounds
  content = content.replace(/bg-dark-900/g, 'bg-slate-950');
  content = content.replace(/bg-dark-800/g, 'bg-slate-900');
  content = content.replace(/bg-dark-700/g, 'bg-blue-950');
  content = content.replace(/bg-dark-600/g, 'bg-gray-50');
  content = content.replace(/bg-dark-500/g, 'bg-white');
  content = content.replace(/bg-dark-400/g, 'bg-white');
  content = content.replace(/bg-dark-300/g, 'bg-gray-100');
  content = content.replace(/bg-dark-200/g, 'bg-gray-200');
  content = content.replace(/bg-dark-100/g, 'bg-gray-300');

  // Text
  // Note: Only replace text-white if it is NOT part of a gradient or button that explicitly needs white
  // For safety, we'll replace text-white with text-gray-900 generally, but will manually fix Header/Footer/Hero if needed.
  content = content.replace(/text-white/g, 'text-gray-900');
  content = content.replace(/text-gray-300/g, 'text-gray-600');
  content = content.replace(/text-gray-400/g, 'text-gray-500');
  content = content.replace(/text-gray-500/g, 'text-gray-400');
  
  // Borders
  content = content.replace(/border-white\/5/g, 'border-gray-200');
  content = content.replace(/border-white\/10/g, 'border-gray-200');
  content = content.replace(/border-white\/20/g, 'border-gray-300');
  content = content.replace(/border-primary-400\/10/g, 'border-primary-400/30');

  // Hover and specific components
  content = content.replace(/bg-white\/5/g, 'bg-gray-100');
  content = content.replace(/bg-white\/10/g, 'bg-gray-200');
  content = content.replace(/bg-white\/20/g, 'bg-gray-300');
  content = content.replace(/hover:text-white/g, 'hover:text-gray-900');
  
  // Specific Blue replacements for the luxury feel
  content = content.replace(/text-dark-600/g, 'text-slate-900');
  content = content.replace(/bg-dark-400\/95/g, 'bg-white/95');
  content = content.replace(/bg-dark-500\/95/g, 'bg-white/95');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      processFile(filePath);
    }
  }
}

walkDir(path.join(__dirname, 'src'));
console.log('Light Theme Refactoring complete!');
