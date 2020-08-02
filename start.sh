#! /bin/bash
case $1 in
    local)
        echo "Running application in local development mode"
        eval "docker-compose -f docker-compose.local.yml up --build"
        ;;
    prod)
        echo "Running application in production mode"
        eval "docker-compose -f docker-compose.prod.yml up --build"
        ;;
    *)
        echo "Invalid environment. Choose from local or prod"
        ;;
esac
