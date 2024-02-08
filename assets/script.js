
var apikey = '7f0a6ddf60b1ba51cd9d0d19';

$(document).ready(function () {
    // Load search history when the page is ready

    loadHistory();
    $('.currency-nav').click(function(e) {
        e.preventDefault(); // Prevent default link behavior
        var targetTab = $(this).attr('href'); // Get target tab ID
        var otherTab = targetTab === '#tab1' ? '#tab2' : '#tab1'; // Determine ID of the other tab content
        $('.currency-nav').removeClass('active'); // Remove active class from all tab links
        $(this).addClass('active'); // Add active class to clicked tab link
        $(otherTab).removeClass('active'); // Remove active class from other tab content
        $(otherTab).hide(); // Hide other tab content
        $(targetTab).addClass('active'); // Add active class to target tab content
        $(targetTab).show(); // Show target tab content
    });
    
    // standardConversion(apikey);
});

function loadHistory() {
    var coinSelectionsLocalStorageKey = JSON.parse(localStorage.getItem('coinSelections')) || [];
    $('#searchHistory').empty();

    coinSelectionsLocalStorageKey.forEach(entry => {
        let baseCoin = entry[0];
        let targetCoin = entry[1];

        var historyEntry = $('<div>').addClass('input-group mb-2');
        var searchHistoryButton = $("<button>").addClass("btn btn-primary form-control").text(baseCoin + ' ' + targetCoin);
        historyEntry.append(searchHistoryButton);
        $('#searchHistory').append(historyEntry);

        // Add event listener to the search history button
        searchHistoryButton.on('click', function () {
            $('#baseCoinSelect').val(baseCoin);
            $('#targetCoinSelect').val(targetCoin);
            pairedConversion(apikey, baseCoin, targetCoin);
        });
    });
}

function standardConversion(apikey) {
    var coinSelectionsLocalStorageKey = 'coinSelections'; // Define the key for storing user selections

    var standardConversion = 'https://v6.exchangerate-api.com/v6/' + apikey + '/latest/GBP';

    fetch(standardConversion)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            console.log(data)
            var SinglebaseCode = data.base_code
            var singleconversionRates = data.conversion_rates
            // Add the base code to the first row
            $('.baseCodeSingle').text('Base Code: ' + SinglebaseCode)
            // Iterate over the conversion rates and add rows to the table
            $.each(singleconversionRates, function(currency, rate) {
                var row = '<tr><td>' + currency + '</td><td>' + rate;
                $('#conversionTableBody').append(row);
            });


            //Allow historicalCurrencyData function to access the currencies in the countryCodeMapping.js file
            historicalCurrencyData(currencies)
            cryptoCurrencyExchange(currencies, CryptoCurrencies)
            // Append conversion rates to select menus from the countryCodeMapping file
            for (var currency in currencies) {
                $('#baseCoinSelect').append($('<option>').attr('value', currency).text(currency + ': ' + currencies[currency]));
                $('#targetCoinSelect').append($('<option>').attr('value', currency).text(currency + ': ' + currencies[currency]));
            }


            // Clear the conversionRate card text when the reset button is clicked on the currencyAmount input field
            $('#resetExchangeAmount').on('click', function () {
                // Clear the input value
                $('#currencyAmount').val('');
            });

            $('#convertButton').on('click', function () {
                // Get value of the base and target coin user has selected
                var baseCoin = $('#baseCoinSelect').val();
                var targetCoin = $('#targetCoinSelect').val();

                // Retrieve existing user selections from local storage
                var existingSelections = JSON.parse(localStorage.getItem(coinSelectionsLocalStorageKey)) || [];

                // Check if the new entry already exists in the stored data
                var isNewEntry = existingSelections.some(function (entry) {
                    return entry[0] === baseCoin && entry[1] === targetCoin;
                });

                if (!isNewEntry) {
                    // Add the new search word to the array
                    existingSelections.push([baseCoin, targetCoin]);

                    // Store the updated array back to localStorage
                    localStorage.setItem(coinSelectionsLocalStorageKey, JSON.stringify(existingSelections));

                    // Create and append the button for the new search word
                    var historyEntry = $('<div>').addClass('input-group mb-2');
                    // var deleteButton = $('<button>').addClass('btn btn-danger').text('Delete');
                    var searchHistoryButton = $("<button>").addClass("btn btn-primary form-control").text(baseCoin + ' ' + targetCoin);
                    historyEntry.append(searchHistoryButton);
                    $('#searchHistory').append(historyEntry);
                }

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
        $('.display-header').html('<i class="bi bi-exclamation-diamond-fill"></i> Error').addClass('text-bg-danger')

        // Adding text to card when user enters no currency or `0`
        $('.conversionRate').css('display', 'flex').html('<strong style="color:red;">No Amount Defined!</strong>');

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
            $('.conversionRate').empty().append(flagImg).append(' ' + convertedRate.toFixed(2) + ' ' + locale + ' ' + currencyName);
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
                console.log('error data', data['error-type'])
                if ('error-type' in data) {
                    // Show modal if there's an error
                    $('.historyTable').css('display', 'none');
                    $('#errorModal').modal('show');
                    
                } else {
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

                }

            })
    });
}



function cryptoCurrencyExchange() {
    $('.cryptoConversion').hide();

    // Clear the conversionRate card text when the reset button is clicked on the currencyAmount input field
    $('#resetCryptoExchangeAmount').on('click', function () {
        // Clear the input value
        $('#cryptoCurrencyAmount').val('');
    });
    for (const currency in cryptoApiPhysicalCoins) {
        $('#baseCryptoCoinSelect').append($('<option>').attr('value', currency).text(currency + ': ' + cryptoApiPhysicalCoins[currency]));
    }

    for (const currency in CryptoCurrencies) {
        $('#targetCryptoCoinSelect').append($('<option>').attr('value', currency).text(currency + ': ' + CryptoCurrencies[currency]));
    }
    $('#convertCryptoButton').on('click', function () {

        var cryptoCurrencyAmount = $('#cryptoCurrencyAmount').val().trim();

        // $('.display-header-crypto').text(').removeClass('text-bg-danger').addClass('text-bg-success');
        // Check if no amount is entered or if it's 0
        if (!cryptoCurrencyAmount || cryptoCurrencyAmount == 0) {
            // Show the card to display the error message
            $('.cryptoConversion').show();

            // Adding header card background colour danger when user enters no currency or `0`
            $('.display-header-crypto').html('<i class="bi bi-exclamation-diamond-fill"></i> Error').addClass('text-bg-danger');

            // Adding text to card when user enters no currency or `0`
            $('.cryptoConversionRate').css('display', 'flex').html('<strong style="color:red;">No Amount Defined!</strong>');

            // Exit function if no amount defined
            return;
        }

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
                if ('error' in data) {
                    // Show modal if there's an error
                    $('.cryptoConversion').show();

                    // Adding header card background colour danger when user enters no currency or `0`
                    $('.display-header-crypto').html('<i class="bi bi-exclamation-diamond-fill"></i> Error').addClass('text-bg-danger');

                    // Adding text to card when user enters no currency or `0`
                    $('.cryptoConversionRate').css('display', 'flex').html('<strong style="color:red;">'+data['error']+'</strong>');
                } else {
                    
                
                console.log('Crypto Currency Exchange Data:', data.rate);
                // Process the exchange rate data here
                var exchangeRate = data.rate;
                var assetIdQuote = data.asset_id_quote
                var cryptoCurrencyAmountDisplay = exchangeRate * cryptoCurrencyAmount;
                $('.cryptoConversion').show();
                $('.display-header-crypto').html('<i class="bi bi-currency-bitcoin"></i>').removeClass('text-bg-danger').addClass('text-bg-success');
                $('.cryptoConversionRate').empty().html('<p class="fw-bold text-start">Crypto '+assetIdQuote+' rate : ' + cryptoCurrencyAmountDisplay.toFixed(2)+'</p>');
            }
            });
    });
}

// WIDGETS
document.addEventListener('DOMContentLoaded', function() {
    // WEATHER
    const fetchWeatherData = (city) => {
        const currentDate = dayjs().format('DD-MMM-YYYY');   
        const apiKey = '2fb2e898d56792b6d47cffb5c77a6d47';
        const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        fetch(queryURL)
            .then(response => {        
                if (!response.ok) {
                    throw new Error(`Error! Status: ${response.status}`);
                }       
                return response.json();
            })
            .then(data => {                
                const weatherToday = document.getElementById('today');    
                let icon = data.list[0].weather[0].icon;
                let iconUrl =  `https://openweathermap.org/img/wn/${icon}.png`;       

                // Show weather for the current day
                weatherToday.innerHTML = `
                    <h4>${data.city.name} <img src="${iconUrl}" width="70px"></h4>  
                    <h6>${currentDate}"</h6> 
                    <p>Temp: ${data.list[0].main.temp} &degC </p>
                    <p>Wind: ${data.list[0].wind.speed} KPH</p>
                    <p>Humidity: ${data.list[0].main.humidity}%</p>
                `;   
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);                
            });
    };

    fetchWeatherData('London');    
    document.getElementById('search-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const city = document.getElementById('search-input').value.trim();
        if (!city) {            
            fetchWeatherData('London');
        } else {
            fetchWeatherData(city);
        }
    });

    // BITCOIN
    function fetchBitcoin() {
        fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
            .then(response => response.json())
            .then(data => {                           
                document.getElementById('bitcoin').innerHTML = `
                    <p>
                        <img src= "./assets/img/bitcoin_body.png" width="28px"> BTC 
                         = 
                        <img src= "./assets/img/gbp.png" width="28px">
                        ${data.bpi.GBP.symbol}
                        ${data.bpi.GBP.rate}
                    </p>
                    <p>
                        <img src= "./assets/img/bitcoin_body.png" width="28px"> BTC 
                        =      
                        <img src= "./assets/img/usd.png" width="28px">                                         
                        ${data.bpi.USD.symbol}
                        ${data.bpi.USD.rate}
                    </p>
                    <p>
                        <img src= "./assets/img/bitcoin_body.png" width="28px"> BTC 
                        =      
                        <img src= "./assets/img/euro.png" width="28px">                                               
                        ${data.bpi.EUR.symbol}
                        ${data.bpi.EUR.rate}
                    </p>
                    
                `;
            })
            .catch(error => {
                console.error('Error fetching Bitcoin:', error);
            });
    }
    fetchBitcoin();    

    // ETHEREUM
    function fetchEthereum() {
        const apiKeyETH = '9fcf5c55d40c91ff543fa9b240c6e9f8952e951e15fd85031e9861fd449133d6';
        fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,DASH&tsyms=BTC,USD,EUR&api_key=INSERT-${apiKeyETH}`)
            .then(response => response.json())
            .then(data => {                                           
                document.getElementById('ethereum').innerHTML = `
                    <p>
                        <img src= "./assets/img/eth.png" width="28px"> ETH 
                         = 
                        <img src= "./assets/img/bitcoin_body.png" width="28px">
                        ${data.ETH.BTC}                        
                    </p>
                    <p>
                        <img src= "./assets/img/eth.png" width="28px"> ETH 
                        =      
                        <img src= "./assets/img/usd.png" width="28px">                                         
                        ${data.ETH.USD}
                    </p>
                    <p>
                        <img src= "./assets/img/eth.png" width="28px"> ETH 
                        =      
                        <img src= "./assets/img/euro.png" width="28px">                                               
                        ${data.ETH.EUR}
                    </p>
                    
                `;
            })
            .catch(error => {
                console.error('Error fetching Bitcoin:', error);
            });
    }
    fetchEthereum();


    // CALENDAR
    const weekDay = dayjs().format('dddd');
    const month = dayjs().format('MMMM');
    const date = dayjs().format('DD');
    const year = dayjs().format('YYYY');

    function updateCurrentTime() {
        const currentTimeElement = document.getElementById('current-time');    
        const currentTime = dayjs().format('HH:mm:ss');
        currentTimeElement.textContent = currentTime;
    }  
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000); 

    const currentDay = document.getElementById('current-day');
    currentDay.textContent = weekDay;

    const currentMonth = document.getElementById('current-month');
    currentMonth.textContent = month;

    const currentDate = document.getElementById('current-date');
    currentDate.textContent = date;

    const currentYear = document.getElementById('current-year');
    currentYear.textContent = year;
});
