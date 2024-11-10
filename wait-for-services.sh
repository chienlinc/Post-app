until nc -z -v -w30 post-mongo 27017
do
  echo "Waiting for MongoDB..."
  sleep 5
done

until nc -z -v -w30 post-oracle 1521
do
  echo "Waiting for Oracle..."
  sleep 5
done

echo "Both MongoDB and Oracle are up and running. Starting server..."
npm start