function checkToken() {
access_token=sessionStorage.access_token;
  if (access_token == null)
  {
          setTimeout(function(){
              window.location.href = "login.html";
          }, 1000);
  }
  else {
    apiGetConfig();
  }
}
var rr_api_url="https://rr.dasoji.net";
var eventid=1;
var apitimeout=2500;
var cooldowntimeout=2000;
var blapcounter=false;
var bliveresult=false;
var bcooldown=false;
var liverefreshinterval=2000;
var laprefreshinterval=2000;
var starttomiddelay=15000;

function setOnSession() {
  sessionStorage.eventid=eventid;
  sessionStorage.apitimeout=apitimeout;
  sessionStorage.cooldowntimeout=cooldowntimeout;
  sessionStorage.blapcounter=blapcounter;
  sessionStorage.bliveresult=bliveresult;
  sessionStorage.bcooldown=bcooldown;
  sessionStorage.liverefreshinterval=liverefreshinterval;
  sessionStorage.laprefreshinterval=laprefreshinterval;
  sessionStorage.starttomiddelay=starttomiddelay;
}

function apiGetConfig() {
  var apiXMLReq = new XMLHttpRequest();
  apiXMLReq.open("GET", rr_api_url + '/config' , true );
  apiXMLReq.send(null);
  apiXMLReq.onload = function () {
      if (apiXMLReq.readyState == 4 && apiXMLReq.status == "200") {
        configjs = JSON.parse(apiXMLReq.responseText);
        eventid=configjs.eventid;
        apitimeout=configjs.apitimeout;
        cooldowntimeout=configjs.cooldowntimeout;
        blapcounter=configjs.blapcounter;
        bliveresult=configjs.bliveresult;
        bcooldown=configjs.bcooldown;
        liveresultrefresh=configjs.liveresultrefresh;
        starttomiddelay=configjs.starttomiddelay;
        setOnSession();
         // alert('All players checkedout');
      } else {
          alert('Error in retrieving configuration');
          setOnSession();
      }
  }
}
function apiClearPlayerPoints() {
  var apiXMLReq = new XMLHttpRequest();
  apiXMLReq.open("GET", rr_api_url + '/players/clearpoints?eventid='+eventid , true );
  apiXMLReq.send(null);
  apiXMLReq.onload = function () {
      if (apiXMLReq.readyState == 4 && apiXMLReq.status == "200") {
        alert('Points Cleared for event: '+eventid)
         // alert('All players checkedout');
      } else {
          alert('Error in clearing points for event: '+eventid);
      }
  }
}



function apiRefreshPlayerPoints() {
  var apiXMLReq = new XMLHttpRequest();
  apiXMLReq.open("GET", rr_api_url + '/players/refreshpoints?eventid='+eventid , true );
  apiXMLReq.send(null);
  apiXMLReq.onload = function () {
      if (apiXMLReq.readyState == 4 && apiXMLReq.status == "200") {
        alert('Points Refreshed from results for eventid: '+eventid)
         // alert('All players checkedout');
      } else {
          alert('Error in Refreshing points for event: '+eventid);
      }
  }
}
