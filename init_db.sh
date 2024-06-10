# Esperar a que el servicio de base de datos esté disponible
until mysqladmin ping -h roundhouse.proxy.rlwy.net -P 53007 --silent; do
  echo "Esperando a que la base de datos esté disponible..."
  sleep 2
done

# Ejecutar migraciones
npm run migrate

# Importar datos SQL
mysql -h roundhouse.proxy.rlwy.net -P 53007 -u root -p fTgxaNxXNWwArAMqWhpAeFkUjiTSWJJY railway < /app/Database/sportsbook.sql

# Iniciar la aplicación
npm run build
npm run start