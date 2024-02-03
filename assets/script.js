var apikey = '7f0a6ddf60b1ba51cd9d0d19';

function standardConversion(apikey) {
  var standardConversion = 'https://v6.exchangerate-api.com/v6/' + apikey + '/latest/GBP';

  fetch(standardConversion)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var conversionRates = data.conversion_rates;
      // Append conversion rates to select menus
      for (var currency in currencies) {
        // console.log(currency + ': ' + currencies[currency]);
        $('#baseCoinSelect').append($('<option>').attr('value', currency).text(currency + ': ' + currencies[currency])),
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
  var currencyAmount = $('#currencyAmount').val().trim()
  $('.conversionRate').text('')
  if(!currencyAmount){
    // alert('no amount defined')
    $('.conversionRate').html('<strong style="color:red;">No Amount defined!</strong>');
    return //exit function if no amount defined
  }
var pairedConversion = 'https://v6.exchangerate-api.com/v6/' + apikey + '/enriched/'+baseCoin+'/'+targetCoin+'';

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
    $('.conversionRate').empty().append(flagImg).append(' ' + convertedRate.toFixed(2) + ' ' + locale + ' ' + currencyName);
  });
}