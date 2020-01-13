const { parse } = require('./parser');
const uuid = require('uuid/v4');
const fs = require('fs');

beforeAll(() => {
    jest.mock('uuid/v4');
});

beforeEach(() => {
    uuid.mockClear();
});

afterAll(() => {
    jest.unmock('uuid/v4');
});

it('should transform a empty host array into an empty port array', async () => {
    const ncrackXML = fs.readFileSync(__dirname + '/__testFiles__/ncrack_no_results.xml', { encoding: 'utf8' })
    const findings = await parse(ncrackXML);

    console.log(ncrackXML);

    expect(findings.length).toBe(0);
});
