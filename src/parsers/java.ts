/*
 *  Copyright 2018 TWO SIGMA OPEN SOURCE, LLC
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import * as path from 'path';

import {
  exec as execSync
} from 'child_process';

import {
  promisify
} from 'util';

import {
  JsonParser
} from './json';

import {
  IDefinition
} from './formatTypes';

const exec = promisify(execSync);

// Path to python implementation of the parser
const PYTHON_HELPER = path.resolve(__dirname, 'python_parser.py');


/**
 * Parser for generating widgets from Widget definitions in python.
 */
export
class JavaParser extends JsonParser {

  start(): Promise<void> {
    // This calls out to an implementation in python, that pipes back JSON
    // in our custom format, see JsonParser.
    const cmd = `python "${PYTHON_HELPER}" "${this.input}"`;
    return exec(cmd, {windowsHide: true} as any).then(({stdout, stderr}) => {
      const data = JSON.parse(stdout as any as string) as IDefinition;
      return this.processDefinition(data);
    });
  }
}
