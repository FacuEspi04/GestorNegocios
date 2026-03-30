const fs = require('fs');
const file = 'D:/Proyectos/Dietetica/frontend/src/components/ventas/CuentasCorrientes.tsx';
let content = fs.readFileSync(file, 'utf8');

// The file might not have the import, let's add it if missing
if (!content.includes('formatearMoneda')) {
  content = content.replace('import React, { ', 'import React, { ' + '\nimport { formatearMoneda } from "../../utils/formatters";\n');
}

// Replace pattern like $ {something.toFixed(N)} or 
content = content.replace(/\$\s?\{calcularDeudaCliente\(cliente\)\.toFixed\(\d+\)\}/g, '{formatearMoneda(calcularDeudaCliente(cliente))}');
content = content.replace(/\$\s?\{deudaTotalCliente\.toFixed\(\d+\)\}/g, '{formatearMoneda(deudaTotalCliente)}');
content = content.replace(/\$\s?\{Math\.max\(0, deudaTotalCliente \- parseFloat\(montoPago\)\)\.toFixed\(\d+\)\}/g, '{formatearMoneda(Math.max(0, deudaTotalCliente - parseFloat(montoPago)))}');

fs.writeFileSync(file, content);
console.log('Done replacement third');
