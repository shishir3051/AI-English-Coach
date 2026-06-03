/**
 * Free a TCP port before starting the API (Windows-friendly).
 * Usage: node scripts/kill-port.js 5000
 */
import { execSync } from 'child_process';

const port = process.argv[2] || '5000';

function killOnWindows() {
  try {
    const out = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
    const pids = new Set();
    for (const line of out.split('\n')) {
      if (!line.includes('LISTENING')) continue;
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && pid !== '0') pids.add(pid);
    }
    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
        console.log(`Stopped process ${pid} on port ${port}`);
      } catch {
        /* already gone */
      }
    }
  } catch {
    /* port not in use */
  }
}

function killOnUnix() {
  try {
    execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'ignore', shell: true });
    console.log(`Stopped process on port ${port}`);
  } catch {
    /* port not in use */
  }
}

if (process.platform === 'win32') killOnWindows();
else killOnUnix();
