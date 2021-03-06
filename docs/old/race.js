var rr_api_url="https://cqvn88ysje.execute-api.eu-west-1.amazonaws.com/test"
var raceid=1;
var eventid=1;
//var players;
var players = [];
var clicks = [];
var laps = [];
var timers = [] ;
var laptimers = [];
var playerdata = [] ;
var raceinfo = {} ;
var allraces = [];
var result = [];
var timersecs=0;
var api_timeout=2500;
var buttonclass='btn btn-primary btn-lg btn-block';
var disabled="disabled";

/*********** Utility Functions in the Beginning *******************/

/* Utility method to get value of a URLParameter
* works both with JS style and standard styles */
function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&|#]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

function initializeApp(){
  // Write initialization code here
  eventid = getURLParameter("eventid");
  raceid = getURLParameter("raceid");
}

function showbadges(val) {
  return `<span class="badge badge-light">${val}</span>`;
}

function getLapsedTime() {
  return document.getElementById("spantimer").innerHTML;
}

function convertSecondsToTime(t=timersecs) {
  var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((t % (1000 * 60)) / 1000);
  var tenths = Math.floor ((t % 1000)/100) ;
  return `${minutes}:${seconds}.${tenths}`;
}

/************** Main body for managing the timer ********************/
// In the main body we start timers
// Set the date we're counting down to
var startTime = new Date().getTime();
// Update the count down every .1 second
var x = setInterval(function() {
  // Get today's date and time
  now = new Date().getTime();
  // Find the distance between now and the count down date
  timersecs = now - startTime;
  document.getElementById("spantimer").innerHTML = convertSecondsToTime();
}, 100);


/*********** Cleanup  Functions  *******************/
function clearResults() {
    result=[];
    document.getElementById("results").innerHTML = "";
}

function clearRace() {
  document.getElementById("raceinfo").innerHTML="";
}

function clearPlayerList() {
  players=[];
  refreshPlayers();
  document.getElementById("players").innerHTML = "";
}


/*********** Result   Functions  *******************/
function saveResults() {
  console.log("raceinfo is"+ raceinfo);
  console.log("result is"+ result);
  apiSaveResult(raceinfo,result);
  // Call API to save results;
}

function discardResults() {
  // Cleanup stuff and start fresh
}

function prepareResults() {
  for (var i=0; i< players.length ;i++)
  {
    result[i] = players[i].getResultJson();
  }
  resultcols = [
     {field:'position', title:'#'},
     {field:'number', title:'Start Nr.'},
  {field:'name', title:'Name'},
  {field:'displayabletime', title:'Time'},
  {field:'laptimes', title:'Lap Times'},
  {field:'laps', title:'#Laps'},
  {field:'points', title:'Points'},
  {field:'lapstatus', title:'Status'} ];
  result.sort(function(a,b) {
         if ( a.laps == b.laps)
            return a.totaltime - b.totaltime;
         else
            return b.laps - a.laps;
            //return a.totaltime - b.totaltime;
          });
  // Set the position after sorting
  for (i=0 ; i<result.length; i++ )
  {
    result[i].position=i+1;
    if (result[i].lapstatus == 'DNS')
      result[i].points=result.length+1;
    else
      result[i].points=i+1;
  }
  $('#results').bootstrapTable({columns:resultcols, data:result});
  $('#results').bootstrapTable('refreshOptions', { theadClasses:'thead-dark', classes: 'table table-bordered table-hover table-striped'});
  var row = ` <div class="row"> <div class="col-6  "> <a class="btn btn-block btn-success" href="#unknown" onClick=saveResults()  role="button"> Save Results </a>  </div><div class="col-6 ">  <a class="btn btn-block btn-danger" href="#unknown" onClick='discardResults()'  role="button"> Discard Results</a>  </div></div>` ;
  document.getElementById('resultactions').innerHTML = row;
}


/*********** Player Functions  *******************/
function incrementPlayerLap(pnum) {
  players[pnum].incrementLap();
  refreshPlayers();
}
function decrementPlayerLap(pnum) {
  players[pnum].decrementLap();
  refreshPlayers();
}

function updatePlayers(playerinfo) {
   console.log(playerinfo);
   playerinfo.forEach(p => { addPlayer(p,raceinfo); });
   refreshPlayers();
}

function addPlayer(pinfo,raceinfo) {
  // Check that we dont have any player with the same name
  const duplicate = players.some(player=>player.number == pinfo.bib);
  if (duplicate) {
    alert ("Duplicate player: "+pinfo.bib);
  }
  else {
    // Empty array for lap timers
    lt = [];
    s = new Skater(pinfo.id, pinfo.bib, pinfo.firstname + " " + pinfo.lastname,raceinfo.laps);
    players.push(s);
//    refreshPlayers();
  }
}

function refreshPlayers() {

  var row='' ;
  //console.log("inside refresh Players");
  row = '<div class="row"> <div class="col-4 table-header ">Player Bib (Laps) </div><div class="col-2 table-header">Total Time</div><div class="col-4 table-header">Lap times</div> <div class="col-2 table-header">Adjust Laps</div></div>' ;
  for (var pnum in players )
  {
    row = row + players[pnum].display();
    //	    row = row + display( players[pnum]);
    //row = row + '<div class="row"> <div class="col-3"><p><a class="btn btn-secondary btn-checkout" href="#unknown"' + onClick=$players[pnum].incrementLap() + ' role="button"> ' +  $players[pnum].number + ' </a></p></div> <div class="col-3"> <p> ' +  ${players[pnum].laps}+ ' </p> </div> <div class="col-3"> <p> '+ $players[pnum].totaltime + ' </p> </div> <div class="col-3"> <p>' +$players[pnum].laptimes + ' </p> </div></div>';
  }
  document.getElementById('players').innerHTML = row;
  for (var pm in players )
  {
    //console.log("Am i here "+ players[pm].number);
    element1=document.getElementById(players[pm].number);
    element1.setAttribute('onclick', `incrementPlayerLap(${pm})`);
    element2=document.getElementById("adj"+players[pm].number);
    element2.setAttribute('onclick', `decrementPlayerLap(${pm})`);
  }
}


/*********** Race Functions  *******************/
function populateRaces() {
  var row='' ;
  console.log("races is "+ allraces);
  allraces.forEach(r => { row += buildRaceMenu(row,r);});
  console.log("row is "+ row);
  document.getElementById('racesdd').innerHTML = row;
  i=1;
  allraces.forEach(r => { (document.getElementById(`race${i}`)).setAttribute('onclick', `showRaceInfo(${i})`); i++; console.log(r) ;});

}

function buildRaceMenu(row,r) {
  return `<a class="dropdown-item" id="race${r.id}" href="#"> ${r.id} - ${r.name} (${r.laps})</a>` ;
}

function showRaceInfo(num) {
  clearPlayerList();
  raceinfo = allraces[num-1];
  var row='' ;
  raceinfocols=[ {field:'id', title:'ID'},
    {field:'laps', title:'Laps'},
    {field:'name', title:'Name'} ];
  var arraywrap=[];
  arraywrap[0] = raceinfo;
  $('#raceinfo').bootstrapTable({columns:raceinfocols, data:arraywrap});
  $('#raceinfo').bootstrapTable('load',arraywrap);
  $('#raceinfo').bootstrapTable('refreshOptions', { theadClasses:'thead-dark', classes: 'table table-bordered table-hover table-striped'});
  //console.log("inside refresh Players");
  row = ` <div class="row"><div class="col-6 ">  <a class="btn btn-block btn-success" href="#unknown" onClick='startRace()'  role="button"> Start Race</a>  </div><div class="col-6 "> <a class="btn btn-block btn-danger" href="#unknown" onClick=endRace()  role="button"> End Race </a>  </div></div>` ;
  document.getElementById('raceactions').innerHTML = row;
  document.getElementById('results').innerHTML = "";
  document.getElementById('resultactions').innerHTML = "";
  document.getElementById("waiting").style.display = "block";
  apiGetPlayersForRace(raceinfo.id);
  var x = setInterval(function() {
  document.getElementById("waiting").style.display = "none";
  }, api_timeout);
}

function startRace() {
  startTime = new Date().getTime();
  players.forEach(s => { s.disabled=""; });
  //disabled="";
  document.getElementById("showtimer").style.display="block";
  refreshPlayers();
}

function endRace() {
  document.getElementById("showtimer").style.display="none";
  document.getElementById("raceactions").innerHTML="";
  prepareResults();
  clearPlayerList();
}


/****************** functions for all remote api calls **********************/

function apiGetRacesForEvent(eventid=1) {
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.open("GET", rr_api_url + '/races?eventid='+eventid , true );

 //   apiXMLReq.setRequestHeader("x-api-key","s8Acz0z7Ix2z8t20xyPZu5pQ4WAa2EQ13yFRpUBu");
    apiXMLReq.send(null);
    apiXMLReq.onload = function () {
        if (apiXMLReq.readyState == 4 && apiXMLReq.status == "200") {
          allraces = JSON.parse(apiXMLReq.responseText);
           // alert('All players checkedout');
        } else {
            alert('Error in getEvents');
        }
    }
    setTimeout(function(){
         populateRaces(allraces);
    }, api_timeout);
}


function apiGetRaceInfo(raceid) {
    var apiXMLReq = new XMLHttpRequest();
    if (raceid == 0)
       apiXMLReq.open("GET", rr_api_url + '/races' , true );
    else
       apiXMLReq.open("GET", rr_api_url + '/races?raceid='+raceid , true );

 //   apiXMLReq.setRequestHeader("x-api-key","s8Acz0z7Ix2z8t20xyPZu5pQ4WAa2EQ13yFRpUBu");
    apiXMLReq.send(null);
    apiXMLReq.onload = function () {
        if (apiXMLReq.readyState == 4 && apiXMLReq.status == "200") {
          raceinfo = JSON.parse(apiXMLReq.responseText)[0];
           // alert('All players checkedout');
        } else {
            alert('Error in getEvents');
        }
    }
    setTimeout(function(){
         showRaceInfo(raceinfo);
    }, api_timeout);
}

function apiGetPlayersForRace(raceid) {
    var apiXMLReq = new XMLHttpRequest();
       apiXMLReq.open("GET", rr_api_url + '/players?raceid='+raceid , true );

 //   apiXMLReq.setRequestHeader("x-api-key","s8Acz0z7Ix2z8t20xyPZu5pQ4WAa2EQ13yFRpUBu");
    apiXMLReq.send(null);
    apiXMLReq.onload = function () {
        if (apiXMLReq.readyState == 4 && apiXMLReq.status == "200") {
          playerinfo = JSON.parse(apiXMLReq.responseText);
           // alert('All players checkedout');
        } else {
            alert('Error in getEvents');
        }
    }
    setTimeout(function(){
         updatePlayers(playerinfo);
    }, api_timeout);
}

function apiSaveResult(raceinfo,results)
{
  var apiXMLReq = new XMLHttpRequest();
     apiXMLReq.open("PUT", rr_api_url + '/results' , true );
     apiXMLReq.setRequestHeader('Content-type', 'application/json');
  var data={};
  data.race = raceinfo;
  data.result = results;
  console.log("Data is" + data)
  apiXMLReq.send(JSON.stringify(data));
  apiXMLReq.onload = function () {
      if (apiXMLReq.readyState == 4 && apiXMLReq.status == "200") {
        res = JSON.parse(apiXMLReq.responseText);
         // alert('All players checkedout');
      } else {
          alert('Error in Save Results');
      }
  }


}
