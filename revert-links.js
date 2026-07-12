import fs from 'fs';
import path from 'path';

function walkAndReplace(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkAndReplace(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('/dashboard/chat')) {
        content = content.replace(/\/dashboard\/chat/g, '/chat');
        fs.writeFileSync(fullPath, content);
        console.log(`Reverted links in ${fullPath}`);
      }
    }
  }
}

walkAndReplace('./src');
