const express = require('express');
const request = require('request');
const hasher = require('./sha1');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'public','index.html'));
});
app.post('/api/sendotp',(req,res) => {
    if (!req.body.phone) {
        return res.send(GetISOTime());
    }
    var accountSId = process.env.ACCOUNT_SID;
    var authToken = process.env.AUTH_TOKEN;
    let baseUrl = '';
    if (baseUrl == undefined || (baseUrl.length) > 0 == false) {
        baseUrl = "https://api-sbox.dnlsrv.com/cigateway/id/v1/sendOtp"
    }



    var options = {
        'method': 'POST',
        'url': baseUrl,
        'headers': {
            'Content-Type': 'application/json',
            'Accept': "application/json",
            'RequestTime': GetISOTime(),
            'Authorization': process.env.AUTH_TOKEN
        },
        body: JSON.stringify({
            "merchantId":process.env.MERCHANT_ID,
            "subMerchantId":process.env.SUB_MERCHANT_ID,
            "correlationId":getRandomString(),
            "consumerMdn":req.body.phone
        })
      
      };
     request(options, function (error, response) { 
        if (error) throw new Error(error);
        res.send(response.body);
      });
});

const PORT = process.env.PORT||3000;

app.listen(PORT, () => console.log('Server started',PORT));


var _UnreservedChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.~";
var getRandomString = function (length) {
    length = length || 10;
    var str = "";

    while (length-- > 0) {
        str += _UnreservedChars[Math.floor(Math.random() * _UnreservedChars.length)];
    }
    return str;
};

function GetISOTime() {
    const data= new Date();
    const zeroPad = (num, places) => String(num).padStart(places, '0')
    return data.getFullYear() + '-' + zeroPad((data.getMonth()+1),2) + '-' + 
                zeroPad(data.getDate()) + 'T'+ zeroPad(data.getHours())+':'+
                zeroPad(data.getMinutes()) + ':' + zeroPad(data.getSeconds()) + msToTime(data.getTimezoneOffset());
}
function msToTime(minutes) {
    const duration  = Math.abs(minutes);
    const zeroPad = (num, places) => String(num).padStart(places, '0');
    const time  = zeroPad(Math.floor(duration/60),2).toString()+':'+Math.floor(duration%60).toString();
    console.log(time);
    if (Math.sign(minutes) > 0) {
        return  `-${time}`;
    }
    return `+${time}`;
  }
