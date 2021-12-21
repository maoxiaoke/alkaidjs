#!/usr/bin/env node

import { cac } from 'cac';
import { build } from '..';

const cli = cac('alkaid');

cli
  .command('build', 'desc')
  .action(options => {
    build();
  })

cli.help();

cli.parse();