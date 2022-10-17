


var form = document.getElementById("form");
form.onsubmit = function () {
  function allowed(position) {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    var latitude = document.getElementById("latitude");
    latitude.setAttribute("value", lat);
    var longitude = document.getElementById("longitude");
    longitude.setAttribute("value", long);
    this.setAttribute("action", "/result");
  }
  function notallowed() {
    console.log("refused");
  }
  navigator.geolocation.getCurrentPosition(allowed, notallowed);
};

