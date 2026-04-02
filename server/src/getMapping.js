import { spawn } from 'node:child_process';

function getMapping(file, args = []) {
  return new Promise((resolve, reject) => {
    const process = spawn('python3', [file, ...args]);

    let stdout = '';
    let stderr = '';

    process.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(stderr || `Process exited with code ${code}`));
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

getMapping('tools/instrumenter/instrumenter.py', ['--mode', 'parser', './sample.py'])
  .then((result) => {
    console.log('Mapping result:', result);
  })
  .catch((error) => {
    console.error('Error getting mapping:', error);
  });

export default getMapping;