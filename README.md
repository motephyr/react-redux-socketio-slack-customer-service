#script:
action                              |command
------------------------------------|-------
開production的server                |npm start
開development的server               |npm dev
build production的client (產生檔案) |npm build
開development的client (不產生檔案)  |npm build:dev
佈署                                |npm deploy
server debug mode                   |npm debug
砍掉client                          |npm clean
測試                                |npm test
砍掉client build production的client 並開development的server |npm webpack
砍掉client 開development的client 並開development的server    |npm webpack:dev

