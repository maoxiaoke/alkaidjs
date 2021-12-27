import { dirname } from 'path';
import { ensureDirSync, writeFileSync } from 'fs-extra';
import * as ts from 'typescript';
import type { CreateLoggerReturns } from './logger';
import type { File } from '../loaders/swc';

// FIXME: should compile accord to tsconfig.json file?
const defaultTypescriptOptions = {
  allowJs: true,
  declaration: true,
  emitDeclarationOnly: true,
};

export interface DtsInputFile extends File {
  dtsPath: string;
  dtsDest: string;
}

const nomalizeDtsInput = (file: File): DtsInputFile => {
  const { dest, absolutePath, ext } = file;
  const dtsDest = dest.replace(ext, 'd.ts');
  const dtsPath = absolutePath.replace(ext, 'd.ts');
  return {
    ...file,
    dtsDest,
    dtsPath,
  };
};

export default function dtsCompile(files: File[], logger: CreateLoggerReturns) {
  logger.info('DTS', 'Compiling typescript declations...');

  if (!files.length) {
    return;
  }

  const _files = files.map(nomalizeDtsInput);

  let createdFiles = {};

  const host = ts.createCompilerHost(defaultTypescriptOptions);
  host.writeFile = (fileName, contents) => { createdFiles[fileName] = contents; };

  const program = ts.createProgram(
    _files.map(({ absolutePath }) => absolutePath),
    defaultTypescriptOptions,
    host,
  );

  const emitResult = program.emit();
  // FIXME: what this used for
  if (emitResult.diagnostics && emitResult.diagnostics.length > 0) {
    emitResult.diagnostics.forEach((diagnostic) => {
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      if (diagnostic.file) {
        const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        logger.error('DTS', `${diagnostic.file.fileName} (${line + 1}, ${character + 1}): ${message}`);
      } else {
        logger.error('DTS', message);
      }
    });
  }

  _files.forEach(({ dtsPath, dtsDest }) => {
    const content = createdFiles[
      dtsPath
    ];
    // write file
    if (content) {
      ensureDirSync(dirname(dtsDest));
      writeFileSync(dtsDest, content, 'utf-8');
    }
  });

  // release
  createdFiles = null;
}
