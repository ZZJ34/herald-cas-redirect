const express = require('express');
const redirectList = require('./redirect-config.json');

const app = express();
const listenPort = 6599;

app.get(/.*/, function (req, res) {
  try {
    const redirectName = req.originalUrl.split('?')[0].split('/').slice(1)[0];
    const params = req.originalUrl.split('?')[0].split('/').slice(2);
    if (redirectList[redirectName]) {
      // http://auth.myseu.cn/<redirectName>/param1/param2...... (最后不以/结尾)
      // <redirectUrl>/param1/param2/......?ticket=<ST-XXXXXXXXXXXXXX>
      let redirectUrl = redirectList[redirectName];
      params.forEach(param => {
        redirectUrl = redirectUrl + '/' + param
      })
      const ticket = req.query.ticket;
      console.log('重定向到:' + redirectUrl + '?ticket=' + ticket);
      res.redirect(redirectUrl + '?ticket=' + ticket);
    } else {
      console.log('没有重定向目标');
      res.status(404).send('没有重定向目标')
    }
  } catch (e) {
    console.log(e)
    console.log('重定向错误，请检查')
    res.status(404).send('重定向错误，请检查')
  }

});

app.listen(listenPort, function () {
  console.log(`重定向程序正在运行，运行在${listenPort}端口!`);
});