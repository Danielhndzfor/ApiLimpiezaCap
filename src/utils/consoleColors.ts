export const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
};

export function printBanner(lines: string[], color: string): void {
  const width = Math.max(...lines.map((line) => line.length)) + 4;
  const border = '─'.repeat(width);

  console.log(`${color}${colors.bold}┌${border}┐${colors.reset}`);
  for (const line of lines) {
    const padding = ' '.repeat(width - line.length - 2);
    console.log(`${color}${colors.bold}│  ${line}${padding}│${colors.reset}`);
  }
  console.log(`${color}${colors.bold}└${border}┘${colors.reset}`);
}
