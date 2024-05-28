document.addEventListener("DOMContentLoaded", function() {
    var countdownMinutes = {{ countdown_minutes | default: 0 }};
    var countdownDuration = countdownMinutes * 60 * 1000; 

    var endTime = localStorage.getItem('countdown_end_time_' + {{ product.id }});
    var now = new Date().getTime();

    if (endTime && now < endTime) {
      endTime = parseInt(endTime, 10);
    } else {
      endTime = now + countdownDuration;
      localStorage.setItem('countdown_end_time_' + {{ product.id }}, endTime);
    }
    
    var countdownInterval = setInterval(function() {
      now = new Date().getTime();
      var countdown_begain = endTime - now;

      var days = Math.floor(countdown_begain / (1000 * 60 * 60 * 24));
      var hours = Math.floor((countdown_begain % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((countdown_begain % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((countdown_begain % (1000 * 60)) / 1000);

      document.getElementById("countdown").innerHTML =
        days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

      if (countdown_begain < 0) {
        clearInterval(countdownInterval);
        // document.getElementById("countdown").style.display = 'none';
        document.getElementById("countdown").innerHTML = "Count Down is expired";
        localStorage.removeItem('countdown_end_time_' + {{ product.id }}); 
      }
    }, 1000);
  });