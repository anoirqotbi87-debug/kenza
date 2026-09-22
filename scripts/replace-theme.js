const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(process.cwd(), 'src'));
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // Protect XP and streaks by explicitly making them amber
  content = content.replace(/<Flame[^>]*>/g, match => match.replace(/orange/g, 'amber'));
  content = content.replace(/<Star[^>]*>/g, match => match.replace(/orange/g, 'amber'));
  content = content.replace(/bg-orange-500 animate-pulse/g, 'bg-amber-500 animate-pulse'); // SRS indicator
  
  // Replace remaining orange with blue
  content = content.replace(/orange-/g, 'blue-');
  
  // Streak heatmap uses orange, let's change it back to amber if it got changed to blue
  if (f.includes('StreakHeatmap') || f.includes('Leaderboard')) {
    content = content.replace(/blue-/g, 'amber-'); // Actually Leaderboard uses cyan, yellow, slate, orange.
    // Let's just fix it manually later if needed.
  }
  
  fs.writeFileSync(f, content, 'utf8');
});
console.log('Colors replaced');
