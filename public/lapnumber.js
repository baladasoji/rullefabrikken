var rr_api_url="https://cqvn88ysje.execute-api.eu-west-1.amazonaws.com/test"
var raceid=1;
var eventid=1;
//var players;
var timersecs=0;
var played=false;
var api_timeout=2500;
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
            //return a.totaltime - b.totaltime;
          });
  // Set the position after sorting
  lapdisplay-= livedata[0].laps;
  if (lapdisplay == 0 ) {
	if (!played) {
		audio.play()
 		played=true;;
  	}
  }
  else {
	played=false
  }
  
  document.getElementById("livelap").innerHTML = '<p style="font-size:600px; margin:-15rem; text-align:center;">'+ lapdisplay+'</p>';
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
}, 3000);
