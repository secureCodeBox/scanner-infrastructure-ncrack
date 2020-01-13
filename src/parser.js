const fs = require('fs'),
    xml2js = require('xml2js');

async function parse(fileContent) {
    const { ncrackrun } = await transformXML(fileContent);
    console.log('ncrackrun');
    console.log(ncrackrun);
    const findings = transformToFindings(ncrackrun);
    console.log('findings');
    console.log(findings);
    return findings;
}

function transformToFindings(ncrackrun) {
  const portFindings = ncrackrun.service.flatMap(({ address, port, credentials = []}) => {
    if(credentials === null){
      return [];
    }

    return credentials.map(credentials => {
      return {
        name: credentials.service,
        description: `Port ${openPort.port} is ${openPort.state} using ${openPort.protocol} protocol.`,
        category: 'Open Port',
        location: `${openPort.protocol}://${hostInfo.ip}:${openPort.port}`,
        osi_layer: 'NETWORK',
        severity: 'INFORMATIONAL',
        attributes: {
          port: openPort.port,
          state: openPort.state,
          ip_address: hostInfo.ip,
          mac_address: hostInfo.mac,
          protocol: openPort.protocol,
          hostname: hostInfo.hostname,
          method: openPort.method,
          operating_system: hostInfo.osNmap,
          service: openPort.service,
          serviceProduct: openPort.serviceProduct || null,
          serviceVersion: openPort.serviceVersion || null,
          scripts: openPort.scriptOutputs || null,
        },
      };
    });
  });

  return portFindings;
}

function transformXML(fileContent) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(fileContent, (err, xmlInput) => {
      if (err) {
        reject(new Error('Error converting XML to JSON in xml2js: ' + err));
      } else {
        resolve(xmlInput);
      }
    });
  });
}

module.exports.parse = parse;
