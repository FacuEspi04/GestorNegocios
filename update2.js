const fs = require('fs');
const file = 'D:/Proyectos/Dietetica/frontend/src/components/ventas/VentasList.tsx';
let content = fs.readFileSync(file, 'utf8');

// The file might not have the import, let's add it if missing
if (!content.includes('formatearMoneda')) {
  content = content.replace('import React, { ', 'import React, { ' + '\nimport { formatearMoneda } from "../../utils/formatters";\n');
}

// Replace pattern like $ {something.toFixed(N)} or 
content = content.replace(/\$\s?\{Number\(([^)]+)\)\.toFixed\(\d+\)\}/g, '{formatearMoneda()}');
content = content.replace(/\$\s?\{([^}]+)\.toFixed\(\d+\)\}/g, '{formatearMoneda()}');
content = content.replace(/\-\$\s?\{([^}]+)\.toFixed\(\d+\)\}/g, '-{formatearMoneda()}');
content = content.replace(/\$\s?\{ventaAEliminar\?.total\}/g, '{formatearMoneda(ventaAEliminar?.total)}');
content = content.replace(/\$\s?\{ventaAEliminar\.total\}/g, '{formatearMoneda(ventaAEliminar.total)}');

fs.writeFileSync(file, content);
console.log('Done replacement again');
