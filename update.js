const fs = require('fs');
const file = 'D:/Proyectos/Dietetica/frontend/src/components/ventas/VentasList.tsx';
let content = fs.readFileSync(file, 'utf8');

// The file might not have the import, let's add it if missing
if (!content.includes('formatearMoneda')) {
  content = content.replace('import React, { ', 'import React, { ' + '\nimport { formatearMoneda } from "../../utils/formatters";\n');
}

content = content.replace(/\bParcial \(\\\$\\\$\{pagado\.toFixed\(\d+\)\}\)/g, 'Parcial ({formatearMoneda(pagado)})');
content = content.replace(/\\\$\{Number\(venta\.total\)\.toFixed\(\d+\)\}/g, '{formatearMoneda(venta.total)}');
content = content.replace(/\\\$\{Number\(venta\.monto_pagado\)\.toFixed\(\d+\)\}/g, '{formatearMoneda(venta.monto_pagado)}');
content = content.replace(/\\-\\\$\{([^}]+)\.toFixed\(\d+\)\}/g, '-{formatearMoneda()}');
content = content.replace(/\\\$\{([^}]+)\.toFixed\(\d+\)\}/g, '{formatearMoneda()}');
content = content.replace(/\\\$\{ventaAEliminar\?.total\}/g, '{formatearMoneda(ventaAEliminar?.total)}');
content = content.replace(/\\\$\{ventaAEliminar\.total\}/g, '{formatearMoneda(ventaAEliminar.total)}');

fs.writeFileSync(file, content);
console.log('Done replacement');
