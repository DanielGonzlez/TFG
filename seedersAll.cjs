const { exec } = require('child_process');

// Ejecutar migraciones para MariaDB
exec('node ace db:seed --connection=mysql', (err, stdout, stderr) => {
  if (err) {
    console.error(`Error al ejecutar seeders de MariaDB: ${stderr}`);
    return;
  }
  console.log('Seeders de MariaDB ejecutados exitosamente.');
  
  // Una vez las de MariaDB se completen, ejecutar migraciones para PostgreSQL
  exec('node ace db:seed --connection=postgresql', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error al ejecutar seeders de PostgreSQL: ${stderr}`);
      return;
    }
    console.log('Seeders de PostgreSQL ejecutados exitosamente.');
  });
});
