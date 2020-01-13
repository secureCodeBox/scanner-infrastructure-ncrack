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

it('should return no findings when ncrack has not found credentials', async () => {
    const ncrackXML = fs.readFileSync(__dirname + '/__testFiles__/ncrack_no_results.xml', {
        encoding: 'utf8',
    });
    const findings = await parse(ncrackXML);

    expect(findings.length).toBe(0);
});

it('should return findings when ncrack found credentials', async () => {
    const ncrackXML = fs.readFileSync(__dirname + '/__testFiles__/ncrack_with_results.xml', {
        encoding: 'utf8',
    });
    const [finding, ...otherFindings] = await parse(ncrackXML);

    expect(finding).toMatchInlineSnapshot(`
        Object {
          "attributes": Object {
            "ip_address": "192.168.0.1",
            "password": "aaf076d4fe7cfb63fd1628df91",
            "port": "22",
            "protocol": "tcp",
            "service": "ssh",
            "username": "root",
          },
          "category": "Discovered Credentials",
          "description": "",
          "location": "ssh://192.168.0.1:22",
          "name": "Credentials for Service ssh://192.168.0.1:22 discovered via bruteforce.",
          "osi_layer": "APPLICATION",
          "severity": "HIGH",
        }
    `);
    expect(otherFindings.length).toBe(0);
});
