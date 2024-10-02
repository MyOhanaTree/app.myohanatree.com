import { readdirSync, statSync, writeFileSync } from 'fs';
import { resolve, join, relative, basename, extname } from 'path';

// Get the directory from the command-line arguments
const targetDir = process.argv[2];

if (!targetDir) {
  console.error('Please provide a directory path.');
  process.exit(1);
}

// Resolve the full path to the target directory
const componentsDir = resolve(targetDir);

// Path to the index file that will be generated
const indexFilePath = join(componentsDir, 'index.ts');

// Function to recursively get all component files from a directory
function getAllFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if ((file.endsWith('.ts') || file.endsWith('.tsx')) && file !== 'index.ts') {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Get all component files from the target directory and its subdirectories
const componentFiles = getAllFiles(componentsDir);

// Create the index file content
const indexContent = componentFiles
  .map(filePath => {
    const relativePath = `./${relative(componentsDir, filePath)}`;
    const relativePathWithoutExtension = relativePath.replace(/\.[^/.]+$/, ''); // Remove file extension
    const componentName = basename(filePath, extname(filePath));
    return `export { default as ${componentName} } from '${relativePathWithoutExtension}';`;
  })
  .join('\n');

// Write the content to the index file
writeFileSync(indexFilePath, indexContent, 'utf8');

console.log(`Index file created at ${indexFilePath}`);
