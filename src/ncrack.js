/*
 *
 *  SecureCodeBox (SCB)
 *  Copyright 2015-2018 iteratec GmbH
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  	http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 * /
 */

const execa = require('execa');
const fs = require('fs');
const util = require('util');
// eslint-disable-next-line security/detect-non-literal-fs-filename
const readFile = util.promisify(fs.readFile);
const { parse } = require('./parser');

async function worker(targets) {
    console.log('Starting ncrack scan for target');
    console.log(targets);

    const [target] = targets;

    const params = target.attributes.NCRACK_PARAMETER
        ? target.attributes.NCRACK_PARAMETER.split(' ')
        : [];

    console.log(
        'Executing: ' + ['ncrack', ...params, '-oX', '/tmp/ncrack.xml', target.location].join(' ')
    );

    const { stdout } = await execa('ncrack', [
        ...params,
        '-oX',
        '/tmp/ncrack.xml',
        target.location,
    ]);
    console.log(stdout);

    const ncrackXml = await readFile('/tmp/ncrack.xml', { encoding: 'utf8' });
    const findings = await parse(ncrackXml);

    return {
        result: findings,
        raw: [ncrackXml],
    };
}

async function testRun(){
    const { stdout } = await execa('ncrack', ['--version']);
    const groups = /.*Ncrack version (\d+\.\d+).*/i.exec(stdout);
    return groups[1];
}

module.exports.worker = worker;
module.exports.testRun = testRun;
