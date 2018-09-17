/**
 * Created by Saku Rautio on 17.9.2018 while losing his mind in the army.
 */

 var request = require('request');

const conscript_restaurant_category_id = "726b67e0-e310-e511-892b-78e3b50298fc";

const menusDataUrl = "http://ruokalistat.leijonacatering.fi/AromiStorage/blob/main/AromiMenusJsonData";

async function getRestaurantData (restaurant, callback) {
    var restaurantData = {
        error: false,
        errorMsg: "",

        breakfast: "",
        lunch: "",
        dinner: "",
        supper: ""
    }
    var restaurantMenuDataURL = "";

    /// Retreiving the restaurant
    request.get({
        url: menusDataUrl,
        json: true
    }, function(error, response, body) {
        if (error || response.statusCode !== 200) {
            restaurantData.error = true;
            restaurantData.errorMsg = "Error retreiving restaurant list";
            return;
        }
    
        var restaurants = body.Restaurants;
        var conscriptRestaurants = [];
        restaurants.forEach(function(element) {
            if (element.CategoryId === conscript_restaurant_category_id) {
                conscriptRestaurants.push(element);
            }
        });
        if (conscriptRestaurants.length === 0) {
            restaurantData.error = true;
            restaurantData.errorMsg = "Could not find conscript restaurants";
            return;
        }

        var chosenRestaurant = {};
        for (var i = 0; i < conscriptRestaurants.length; i++) {
            var element = conscriptRestaurants[i];
            if (element.Name === restaurant) {
                chosenRestaurant = element;
                break;
            }
        };
        if (Object.keys(chosenRestaurant).length === 0) {
            restaurantData.error = true;
            restaurantData.errorMsg = "Could not find the restaurant";
            return;
        }

        restaurantMenuDataURL = chosenRestaurant.JMenus[1].LinkUrl;
        // The link is of the form: //leijona.catering.... so change it to http://leijona.catering....
        restaurantMenuDataURL = "http://" + restaurantMenuDataURL.slice(2);

        /// Retreiving the menu
        request.get({
            url: restaurantMenuDataURL,
            json: true
        }, function(error, response, body) {
            if (error || response.statusCode !== 200) {
                restaurantData.error = true;
                restaurantData.errorMsg = "Error retreiving menu list";
                return;
            }

            var days = body.Days;
            if (days.length === 0) {
                restaurantData.error = true;
                restaurantData.errorMsg = "Could not find the menu of the day";
                return;
            }

            var mealsOfTheDay = days[0].Meals;
            restaurantData.breakfast = mealsOfTheDay[0].Name;
            restaurantData.lunch = mealsOfTheDay[1].Name;
            restaurantData.dinner = mealsOfTheDay[2].Name;
            restaurantData.supper = mealsOfTheDay[3].Name;

            callback(restaurantData);
        });
    });
}

module.exports.getRestaurantData = getRestaurantData;