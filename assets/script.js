var apikey = '7f0a6ddf60b1ba51cd9d0d19';

function standardConversion(apikey) {

    var standardConversion = 'https://v6.exchangerate-api.com/v6/' + apikey + '/latest/GBP';

    fetch(standardConversion)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            // SINGLE CONVERSION LOGIC WILL GO HERE

            //Allow historicalCurrencyData function to access the currencies in the countryCodeMapping.js file
            historicalCurrencyData(currencies)
            cryptoCurrencyExchange(currencies, CryptoCurrencies)
            // Append conversion rates to select menus from the countryCodeMapping file
            for (var currency in currencies) {
                // console.log(currency + ': ' + currencies[currency]);
                $('#baseCoinSelect').append($('<option>').attr('value', currency).text(currency + ': ' + currencies[currency])),
                    $('#targetCoinSelect').append($('<option>').attr('value', currency).text(currency + ': ' + currencies[currency]));
            }


            // Clear the conversionRate card text when the reset button is clicked on the currencyAmount input field
            $('#resetExchangeAmount').on('click', function () {
                // Clear the input value
                $('#currencyAmount').val('');
            });

            // Event listener for convert button
            $('#convertButton').on('click', function () {

                //get value of the base and target coin user has selected
                var baseCoin = $('#baseCoinSelect').val();
                var targetCoin = $('#targetCoinSelect').val();

                // Pass the above values into the pairedConversion function to run paired conversion request
                pairedConversion(apikey, baseCoin, targetCoin);
            });
        });
}

standardConversion(apikey);


function pairedConversion(apikey, baseCoin, targetCoin) {

    // Retrieve Value user enters into currency amount field and trim any white space
    var currencyAmount = $('#currencyAmount').val().trim()

    // Show card
    $('.rateCard').show()

    // Removing the card header danger background colour class and adding the success colour background class 
    $('.display-header').text('Conversion rates').removeClass('text-bg-danger').addClass('text-bg-success');

    //if no currency amount or user enters currency as 0 then show card and add error message
    if (!currencyAmount || currencyAmount == 0) {

        //show the card to display the error message

        $('.rateCard').show()

        // Adding header card background colour danger when user enters no currency or `0`
        $('.display-header').text('Error').addClass('text-bg-danger')

        // Adding text to card when user enters no currency or `0`
        $('.conversionRate').css('display', 'flex').html('<strong style="color:red;">No Amount defined!</strong>');

        //exit function if no amount defined
        return
    }

    var pairedConversion = 'https://v6.exchangerate-api.com/v6/' + apikey + '/enriched/' + baseCoin + '/' + targetCoin + '';

    fetch(pairedConversion)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            // All Variables that can be accessed from response of paired conversion request
            var baseCode = data.base_code
            var currencyName = data.target_data.currency_name_short
            var flagUrl = data.target_data.flag_url
            var locale = data.target_data.locale
            var timeLastUpdateUnix = data.time_last_update_unix
            var timeLastUpdateUtc = data.time_last_update_utc
            var conversionRate = data.conversion_rate

            // Equation to get exchange amount based on conversion rate of target coin selected
            var convertedRate = currencyAmount * conversionRate

            // Add flag image from response of paired conversion request
            var flagImg = $('<img>');
            flagImg.attr('src', flagUrl);

            // Append the flag, converted rate, locale and currency name to conversion rate card
            $('.conversionRate').empty().append(flagImg).append(' ' + convertedRate + ' ' + locale + ' ' + currencyName);
        });
}

function historicalCurrencyData(currencies) {

    // For in loop to loop through currencies object in countryCodMapping.js file and append to 
    // historicalBaseCoinSelect select option setting value and text
    for (var currency in currencies) {
        $('#historicalBaseCoinSelect').append($('<option>').attr('value', currency).text(currency + ': ' + currencies[currency]));
    }
    // Event listener for historical conversions
    $('.badge').click(function () {
        var currencyCode = $(this).text(); // Get the text content of the clicked badge
        $('#historicalBaseCoinSelect').val(currencyCode) // Set the value of the drop-down menu

    });

    // Event listener for historical conversions 
    $('#getHistoryData').on('click', function () {

        $('.loading-message').show();

        // Get user input for historical coin selection
        var selectedCurrency = $('#historicalBaseCoinSelect').val();

        // Get the selected date by the user input
        var selectedDate = $('#historicalDate').val();

        // Split the user selectedDate using the hyphen in between the date 
        var dateSplit = selectedDate.split('-');

        // Number function to convert the string to a number which will remove any trailing zeros to be passed to api request
        var year = Number(dateSplit[0]);
        var month = Number(dateSplit[1]);
        var day = Number(dateSplit[2]);

        var historicalData = 'https://v6.exchangerate-api.com/v6/' + apikey + '/history/' + selectedCurrency + '/' + year + '/' + month + '/' + day;

        fetch(historicalData)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {

                $('.loading-message').hide();
                var histoicalConversionRates = data.conversion_rates;

                // Reference to the tbody element
                var tbody = $('.historyTable tbody');

                // Clear the table body before adding new rows
                tbody.empty();

                // Add table headers
                var thead = $('.historyTable thead');

                // Clear table headers
                thead.empty();

                // Create new table row
                var headersRow = $('<tr>');

                // Append currency text to table head to headers row
                headersRow.append($('<th>').text('Currency'));

                // Append Conversion Rate text to table head to headers row
                headersRow.append($('<th>').text('Conversion Rate'));

                // Append headers row with text to table head
                thead.append(headersRow);

                // Loop through conversion rates and add rows to the table
                for (const currencyCode in histoicalConversionRates) {
                    var conversionRate = histoicalConversionRates[currencyCode];

                    // Create a new table row
                    var newRow = $('<tr>');

                    // Create table data cells for currency code and conversion rate
                    var currencyCell = $('<td>').text(currencyCode);
                    var rateCell = $('<td>').text(conversionRate);

                    // Append cells to the row
                    newRow.append(currencyCell, rateCell);

                    // Append the row to the tbody
                    tbody.append(newRow);
                }

                // Show the table
                $('.historyTable').css('display', 'inline-table');

                // Add css to apply scroll to table and set height of table
                $('.table-responsive').css('overflow-y', 'scroll').css('height', '453px');

            })
    });
}



function cryptoCurrencyExchange() {

    $('.cryptoConversion').hide();
    for (const currency in cryptoApiPhysicalCoins) {
        $('#baseCryptoCoinSelect').append($('<option>').attr('value', currency).text(currency + ': ' + cryptoApiPhysicalCoins[currency]));
    }

    for (const currency in CryptoCurrencies) {
        // console.log(currency + ': ' + CryptoCurrencies[currency]);
        // $('#baseCryptoCoinSelect').append($('<option>').attr('value', currency).text(currency + ': ' + CryptoCurrencies[currency])),
        $('#targetCryptoCoinSelect').append($('<option>').attr('value', currency).text(currency + ': ' + CryptoCurrencies[currency]));

    }
    // Clear the conversionRate card text when the reset button is clicked on the currencyAmount input field
    $('#resetCryptoExchangeAmount').on('click', function () {
        // Clear the input value
        $('#cryptoCurrencyAmount').val('');
    });

    $('.display-header-crypto').text('Crypto Conversion rates').removeClass('text-bg-danger').addClass('text-bg-success');
    $('#convertCryptoButton').on('click', function () {
        var baseCryptoCoinSelect = $('#baseCryptoCoinSelect').val();
        var targetCryptoCoinSelect = $('#targetCryptoCoinSelect').val();

        console.log('Base Coin:', baseCryptoCoinSelect);
        console.log('Target Coin:', targetCryptoCoinSelect);
        // var cryptoCurrencyReq = 'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=' + baseCryptoCoinSelect + '&to_currency=' + targetCryptoCoinSelect + '&apikey=O3MFG4ZCOL7HSB5K';
        var cryptoCurrencyReq = 'https://rest.coinapi.io/v1/exchangerate/' + baseCryptoCoinSelect + '/' + targetCryptoCoinSelect + '/apikey-4EBE0F1B-AFFB-44E0-870B-292AB2330BE4/';

        fetch(cryptoCurrencyReq)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log('Crypto Currency Exchange Data:', data.rate);
                // Process the exchange rate data here
                var cryptoCurrencyAmount = $('#cryptoCurrencyAmount').val().trim()
                var exchangeRate = data.rate
                var cryptoCurrencyAmountDisplay = exchangeRate * cryptoCurrencyAmount
                $('.cryptoConversion').show();
                $('.cryptoConversionRate').empty().append('Crypto exchange rate' + ' ' + cryptoCurrencyAmountDisplay)
            })

    });

}