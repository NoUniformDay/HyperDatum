docker rm -f $(docker ps -aq)
docker network rm $(docker network ls -q)

