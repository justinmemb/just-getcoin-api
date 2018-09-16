var https = require("https");
var message = require('../messages.js');

// #Market Prices and Exchanges Rates API
exports.marketPrices = function(request, response) {

    var block_chain_market_price_url = '';
    https.get('https://blockchain.info/ticker', function (result_response) {

        var buffer_response = '';

        result_response.on("data", function (chunks) {

            buffer_response += chunks;
        });

        result_response.on("end", function (error) {

            if (error) {

                response.json({

                    error: true,
                    error_description: error.message,
                    message: message.serverErrorOccurred
                });
            } else {

                response.json({

                    error: false,
                    marketPrices: JSON.parse(buffer_response),
                    message: message.marketPriceListed
                });
            }
        });
    });
};