#!/usr/bin/env node

import { cac } from 'cac';
import { build } from '..';

const cli = cac('alkaid');

cli.option('--name <name>', 'Provide your name');
cli.option('--loader <name>', 'Use swc or rollup to bundle you files.');

// cli
//   .command('build', 'desc')
//   .option('--minify <...>', 'Minify bundle')
//   .action((options) => {
//     build();
//   });

cli.help();

cli.version('1.0.0');

cli.parse();
