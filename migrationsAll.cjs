const { exec } = require('child_process');

// Ejecutar migraciones para MariaDB
exec('node ace migration:run --connection=mysql', (err, stdout, stderr) => {
  if (err) {
    console.error(`Error al ejecutar migraciones de MariaDB: ${stderr}`);
    return;
  }
  console.log('Migraciones de MariaDB ejecutadas exitosamente.');
  
  // Una vez las de MariaDB se completen, ejecutar migraciones para PostgreSQL
  exec('node ace migration:run --connection=postgresql', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error al ejecutar migraciones de PostgreSQL: ${stderr}`);
      return;
    }
    console.log('Migraciones de PostgreSQL ejecutadas exitosamente.');
  });
});
