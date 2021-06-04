var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js'); // predict
const cls_model = require('./sdk/cls_model.js'); // cls

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '1735227915:AAHFFTF2xI_P0iGvQBgxYHFbmOFC5pLKY-0'
const bot = new TelegramBot(token, {polling: true});


state = 0;
// Main Menu Bot
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        `hello $(msg.chat.fist_name), welcome...\n
        click /predict`
    );
    state = 0;
});

// input requires i and r 
bot.onText(/\/predict/, (msg) => {
    bot.sendMessage(
        msg.chat.id
        `masukan nilai i|v contohnya 13|13`
    );
    state = 1;
});

bot.on('message', (msg) => {
    if(state == 1){
        s = msg.text.split("|");
        i = parseFloat(s[0])
        r = parseFloat(s[1])
        
        model.predict(
            [
               i, // string to float
               r,      
            ]
         ).then((jres1)=>{
            v = parseFloat(jres1[0])
            p = parseFloat(jres1[1])
            
            cls_model.classify([i, r, v, p]).then((jres2)=>{
                 bot.sendMessage(
                         msg.chat.id,
                         `nilai v yang diprediksi adalah ${v} volt`
                 );
                 bot.sendMessage(
                          msg.chat.id,
                         `nilai p yang diprediksi adalah ${p} watt`
                 );
                 bot.sendMessage(
                         msg.chat.id
                         `klasifikasi Tegangan ${jres2}`
                 );
                 state = 0;
             })
         })
   }else{
         state = 0
  }
})

// routers 
r.get(`/predict/:i/:r`, function(req, res, next) {
   model.predict(
       [
           parseFloat(req.params.i), // string to float
           parseFloat(req.params.r)
       ]
   ).then((jres_)=>{
       res.json(jres);
    })
});

// routers 
r.get(`/classify/:i/:r`, function(req, res, next) {
   model.predict(
       [
           parseFloat(req.params.i), // string to float
           parseFloat(req.params.r)
       ]
   ).then((jres)=>{
       cls_model.classify(
            [
                parseFloat(req.params.i), // string to float
                parseFloat(req.params.r),
                parseFloat(jres[0]),
                parseFloat(jres[1])
            ]
        ).then((jres_)=>{
           res.json({jres, jres_})
        })
     })
});

module.exports = r;
