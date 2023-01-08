const express = require('express');
const path = require('path');
const app = express();
const https = require('https');
const fs = require('fs');

const publicPath = path.join(__dirname, 'build');

app.use(express.static(publicPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

https
  .createServer(
    {
      cert: fs.readFileSync('STAR_etechfocusltd_com.crt'),
      key: fs.readFileSync('star.etechfocusltd.com.key'),
    },
    app
  )
  .listen(4200, () => {
    console.log('Https Server running on ', 4100);
  });

app.listen(4100, () => {
  console.log('Http Server running on ', 4100);
});
