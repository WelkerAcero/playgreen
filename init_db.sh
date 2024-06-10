# Esperar a que el servicio de base de datos esté disponible
until mysqladmin ping -hroundhouse.proxy.rlwy.net --port 16637 --silent; do
  echo "Esperando a que la base de datos esté disponible..."
  sleep 2
done

# Ejecutar migraciones
npm run migrate

# Importar datos SQL
mysql -hroundhouse.proxy.rlwy.net -uroot -pWzhtCumcySkEIfcqHLGuwdIJxIziqbEW --port 16637 --protocol=TCP railway < /app/Database/sportsbook.sql

# Iniciar la aplicación
npm run start