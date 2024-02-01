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

      // Clear existing dropdown items
      $('.dropdown-menu').empty();

      // Log the array here for countrycodemapping
      console.log(currencies);
      // Append conversion rates to dropdown menu
      for (var currency in conversionRates) {
        var rate = conversionRates[currency];
        $('.form-select').append(
          $('<option>').attr('option', currency).text(currency)
        );
      }
    });
}

// Call the function with the provided apikey
standardConversion(apikey);


function pairedConversion(apikey){
var pairedConversion = 'https://v6.exchangerate-api.com/v6/' + apikey + '/pair/EUR/GBP';

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

    console.log(timeLastUpdateUnix)


  });
}
pairedConversion(apikey)
