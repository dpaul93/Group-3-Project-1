var apikey = '7f0a6ddf60b1ba51cd9d0d19';

function standardConversion(apikey) {
  var standardConversion = 'https://v6.exchangerate-api.com/v6/' + apikey + '/latest/GBP';

  fetch(standardConversion)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log('standard conversion', data);
      var conversionRates = data.conversion_rates;

      // Log array for countrycodemapping
      // console.log(currencies);

      // Append conversion rates to select menus
      for (var currency in currencies) {
        // console.log(currency + ': ' + currencies[currency]);
        $('#baseCoinSelect').append($('<option>').attr('value', currency).text(currency + ': ' + currencies[currency]));
        $('#targetCoinSelect').append($('<option>').attr('value', currency).text(currency + ': ' + currencies[currency]));
      }

      // Event listener for convert button
      $('#convertButton').on('click', function() {
        var baseCoin = $('#baseCoinSelect').val();
        var targetCoin = $('#targetCoinSelect').val();
        pairedConversion(apikey, baseCoin, targetCoin);
      });
    });
}

// Call the function with the provided apikey
standardConversion(apikey);


function pairedConversion(apikey, baseCoin, targetCoin){
var pairedConversion = 'https://v6.exchangerate-api.com/v6/' + apikey + '/pair/'+baseCoin+'/'+targetCoin+'';

fetch(pairedConversion)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log('paird converstion',data)
    var baseCode = data.base_code
    var timeLastUpdateUnix = data.time_last_update_unix
    var timeLastUpdateUtc = data.time_last_update_utc
    var conversionRates = data.conversion_rate
    var currencyAmount = $('#currencyAmount').val().trim()
    console.log(conversionRates)
    $('.conversionRate').text(conversionRates)


  });
}
