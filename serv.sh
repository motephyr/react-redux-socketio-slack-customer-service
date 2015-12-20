#!/bin/sh

case "$1" in
  pack)
    npm run clean
    npm run build &
    npm run dev
    ;;
  pack:dev)
    npm run clean
    npm run build:dev & 
    npm run dev
    ;;
  stop)
    kill $(ps aux | grep 'npm'  | awk '{print $2}')
    kill $(ps aux | grep 'rails s'  | awk '{print $2}')
    #kill $(ps aux | grep 'ssh -ND 3128'  | awk '{print $2}')
    ;;
esac
