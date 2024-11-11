const { exec } = require('child_process');

// Ejecutar rollback para MariaDB
exec('node ace migration:rollback --connection=mysql', (err, stdout, stderr) => {
  if (err) {
    console.error(`Error al hacer rollback de migraciones de MariaDB: ${stderr}`);
    return;
  }
  console.log('Rollback de migraciones de MariaDB completado.');

  // Una vez el rollback de MariaDB se complete, ejecutar el rollback para PostgreSQL
  exec('node ace migration:rollback --connection=postgresql', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error al hacer rollback de migraciones de PostgreSQL: ${stderr}`);
      return;
    }
    console.log('Rollback de migraciones de PostgreSQL completado.');
  });
});
