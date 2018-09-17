/**
 * Created by Saku Rautio on 17.9.2018 while losing his mind in the army.
 */

var Discord = require('discord.io');
var auth = require('./auth.json');
var debug = require('./debug.js');

var LeijonaCatering = require('./LeijonaCatering/api.js');

var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

bot.on('ready', function(evt) {
    debug.log('Connected');
    debug.log('Logged in as: ');
    debug.log(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function(user, userID, channelID, message, evt) {
    if (message.substring(0, 1) === '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch (cmd) {
            case 'info':
                bot.sendMessage({
                    to: channelID,
                    message: 'Possible commands: `!info` and `!menu`. \n' +
                    '!menu usage: `!menu [restaurant\'s name]` \n' +
                    'For example: `!menu Somero` \n'
                });
                break;
            case 'test':
                LeijonaCatering.getRestaurantData("Varuskuntaravintola Hilma", function(restaurantData) {
                    if (restaurantData.error) {
                        debug.log("Error: " + restaurantData.errorMsg);
                    } else {
                        debug.log("Restaurant data: " + JSON.stringify(restaurantData));
                    }
                });
                break;
            case 'menu':
                LeijonaCatering.getRestaurantData("Varuskuntaravintola " + args[0], function(restaurantData) {
                    if (restaurantData.error) {
                        bot.sendMessage({
                            to: channelID,
                            message: "Error: " + restaurantData.errorMsg
                        });
                    } else {
                        bot.sendMessage({
                            to: channelID,
                            message:
                                "Restaurant: **" + args[0] + "**" +
                                "```" +
                                "Breakfast: " + restaurantData.breakfast + "\n\n" +
                                "Lunch: " + restaurantData.lunch + "\n\n" +
                                "Dinner: " + restaurantData.dinner + "\n\n" +
                                "Supper: " + restaurantData.supper + "\n\n" +
                                "```" +
                                "*Bon Appetit!*"
                        });
                    }
                });
                break;
            default:
                debug.log('Unrecognized command: ' + cmd);
                break;
        }
    }
});