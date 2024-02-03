var apikey = '7f0a6ddf60b1ba51cd9d0d19';

function standardConversion(apikey) {
  var standardConversion = 'https://v6.exchangerate-api.com/v6/' + apikey + '/latest/GBP';

  fetch(standardConversion)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var conversionRates = data.conversion_rates;
      // Append conversion rates to select menus
      historicalCurrencyData(currencies)
      for (var currency in currencies) {
        // console.log(currency + ': ' + currencies[currency]);
        $('#baseCoinSelect').append($('<option>').attr('value', currency).text(currency + ': ' + currencies[currency])),
          $('#targetCoinSelect').append($('<option>').attr('value', currency).text(currency + ': ' + currencies[currency]));
      }

      // Event listener for convert button
      $('#convertButton').on('click', function () {
        var baseCoin = $('#baseCoinSelect').val();
        var targetCoin = $('#targetCoinSelect').val();
        pairedConversion(apikey, baseCoin, targetCoin);
      });
    });
}

// Call the function with the provided apikey
standardConversion(apikey);


function pairedConversion(apikey, baseCoin, targetCoin) {
  var currencyAmount = $('#currencyAmount').val().trim()
  
  $('.conversionRate').text('')
  //add class to border of conversion rates card
  $('.rateCard').addClass('border-success');
  $('.rateCard').show()
  if (!currencyAmount) {
    
    $('.rateCard').show()
    //remove class to border of conversion rates card
    $('.rateCard').addClass('border-danger');
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
      var baseCode = data.base_code
      var currencyName = data.target_data.currency_name_short
      var flagUrl = data.target_data.flag_url
      var locale = data.target_data.locale
      var timeLastUpdateUnix = data.time_last_update_unix
      var timeLastUpdateUtc = data.time_last_update_utc
      var conversionRate = data.conversion_rate
      var convertedRate = currencyAmount * conversionRate
      var flagImg = $('<img>');
      flagImg.attr('src', flagUrl);
      
      $('.conversionRate').empty().append(flagImg).append(' ' + convertedRate + ' ' + locale + ' ' + currencyName);


    });
}

function historicalCurrencyData(currencies) {
  for (var currency in currencies) {
      $('#historicalBaseCoinSelect').append($('<option>').attr('value', currency).text(currency + ': ' + currencies[currency]));
  }
  $('#getHistoryData').on('click', function () {
      var selectedCurrency = $('#historicalBaseCoinSelect').val();
      //get the selected date by the user using `this`
      var selectedDate = $('#historicalDate').val();
      //split the user selectedDate using the hyphen in between the date 
      var parts = selectedDate.split('-');
      //number function to convert the string to a number which will remove any trailing zeros to be passed to api request
      var year = Number(parts[0]);
      var month = Number(parts[1]);
      var day = Number(parts[2]);

      var historicalData = 'https://v6.exchangerate-api.com/v6/' + apikey + '/history/' + selectedCurrency + '/' + year + '/' + month + '/' + day;
      
      fetch(historicalData)
          .then(function (response) {
              return response.json();
          })
          .then(function (data) {
            var histoicalConversionRates = data.conversion_rates;

            // Reference to the tbody element
            var tbody = $('.historyTable tbody');
        
            // Clear the tbody before adding new rows
            tbody.empty();
        
            // Add table headers
            var thead = $('.historyTable thead');
            thead.empty();
            var headersRow = $('<tr>');
            headersRow.append($('<th>').text('Currency'));
            headersRow.append($('<th>').text('Conversion Rate'));
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
            $('.table-responsive').css('overflow-y', 'scroll').css('height', '200px');
            $('#base-coin').text(selectedCurrency);
        });
  });
}
