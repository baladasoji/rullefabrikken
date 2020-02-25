//var players;
var timersecs=0;
var played=false;
var audio = new Audio('bell.mp3');

function populateResults(liveresult)
{
  lapdisplay=liveresult.raceinfo.laps;
  livedata=liveresult.liveresult;
  livedata.sort(function(a,b) {
         if ( a.laps == b.laps)
            return a.totaltime - b.totaltime;
         else
            return b.laps - a.laps;
          });
  // Set the position after sorting
  if (liveresult.juststarted) {
        played=false;
        document.getElementById("livelap").innerHTML = '<p style="font-size:600px; margin:-15rem; text-align:center;">'+ lapdisplay+'</p>';
  }
  else{
      lapdisplay-= (livedata[0].laps+1);
      if (lapdisplay == -1) lapdisplay++;
      if (lapdisplay == 0 ) {
        if (!played) {
          audio.play()
          played=true;
        }
      }
      else {
        played=false
      }

      document.getElementById("livelap").innerHTML = '<p style="font-size:600px; margin:-15rem; text-align:center;">'+ lapdisplay+'</p>';
  }
}


function apiGetLiveResults()
{
  var apiXMLReq = new XMLHttpRequest();
     apiXMLReq.open("GET", rr_api_url + '/live-results' , true );
  apiXMLReq.send(null);
  apiXMLReq.onload = function () {
      if (apiXMLReq.readyState == 4 && apiXMLReq.status == "200") {
        liveresult = JSON.parse(apiXMLReq.responseText);
        if (liveresult.raceinfo != null)
          populateResults(liveresult);
         // alert('All players checkedout');
      } else {
          console.log('Error in getting live results');
      }
  }
}

var x = setInterval(function() {
  // Get today's date and time
  apiGetLiveResults();
}, laprefreshinterval);
