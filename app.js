const express = require('express');
const redirectList = require('./redirect-config.json');
const fs = require('fs')
const morgan = require('morgan');
const path = require('path');

const app = express();
const listenPort = 6599;

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(morgan('combined', { stream: accessLogStream }))

app.get(/.*/, function (req, res) {
  try{
    const redirectName = req.originalUrl.split('?')[0].slice(1);
    const redirectUrl = redirectList[redirectName];
    const ticket = req.query.ticket;
    if (redirectUrl) {
      console.log('重定向到:' + redirectUrl + '?ticket=' + ticket);
      res.redirect(redirectUrl + '?ticket=' + ticket);
    }else{
      console.log('没有重定向目标');
      res.status(404).send('没有重定向目标')
    }
  }catch(e){
    console.log('重定向错误，请检查')
    res.status(404).send('重定向错误，请检查')
  }
  
});

app.listen(listenPort, function () {
  console.log(`重定向程序正在运行，运行在${listenPort}端口!`);
});