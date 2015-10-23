# 線上客服(for slack)
- 用slack等你常用的聊天方式即時的和你的訪客線上溝通
- 以NodeJs,react,socketio開發

# 使用情境
用戶可以發送訊息到slack

一般用戶連上了server會分配一個id,去識別它是這個人。

然後當用戶寫了自已的識別Email,就可以綁定Email和id來傳訊息給它。

# react部分開發筆記
## 拆分用户界面为一个组件树

從Root出發
MainContainer
MessageBoxComponent
  MessageHeader
  MessageTextarea
  MessageInput

## 利用 React ，创建应用的一个静态版本
把html做出來
然後把render填一填

## 识别出最小的（但是完整的）代表 UI 的 state
用户输入的，會隨時間改變的

## 确认 state 的生命周期
放在所有需要它的組件的最上一層

## 添加反向数据流
用redux來處理

#Todo
set Cookie


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

