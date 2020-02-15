var rr_api_url="https://cqvn88ysje.execute-api.eu-west-1.amazonaws.com/test"
var raceid=1;
//var players;
var players = [];
var clicks = [];
var laps = [];
var timers = [] ;
var laptimers = [];
var playerdata = [] ;
var raceinfo = [] ;
var allraces = [];
var result = [];
var timersecs=0;
var buttonclass='btn btn-primary btn-lg btn-block';
var disabled="disabled";

class Skater {
  constructor(number, name ,laps, totallaps, starttime, totaltime, laptimes) {
    this.number = number;
    this.name = name;
    this.laps = laps;
    this.totallaps=totallaps;
    this.starttime = starttime;
    this.totaltime = totaltime;
    this.laptimes=laptimes;
    this.displayabletotaltime='';
    this.displayablelaptimes='';
    this.DNF=true;
    this.disabled="disabled";
  }

  setStarttime(starttime) {
    this.starttime = starttime ;
  }

  setLaps (laps) {
    this.laps = laps ;
  }

  incrementLap()
  {
    this.laps++ ;
    if (this.laps == this.totallaps)
    {
      this.DNF = false;
      this.disabled = "disabled" ;
    }
    //console.log("incrementing the laps" + this.laps);
    this.setTotalTime();
    this.setLapTime();
  }

  setTotalTime ()
  {
    this.totaltime=timersecs;
    this.displayabletotaltime = "<span class='badge badge-pill badge-success' style='font-size:large;'>" +  convertSecondsToTime(this.totaltime) + "</span></h3>";
  }

  setLapTime()
  {
    if (this.laps > 1)
    {
      this.laptimes[this.laps-1] = timersecs - this.laptimes[this.laps-2];
    }
    else
    {
      this.laptimes[this.laps-1]= timersecs;
    }
    this.displayablelaptimes += "<span class='badge badge-pill badge-info' style='font-size:x-small'>"+ convertSecondsToTime(this.laptimes[this.laps]) + "</span>";
  }
  display()
  {

    return  `<div class="row"> <div class="col-4"><button type="button" class='${buttonclass}' href="#" id=${this.number} ${this.disabled} > ${this.number}  <span class="badge badge-light badge-pill"> ${this.laps} </span>  </button> </div> <div class="col-4" style="text-align:center;"> ${this.displayabletotaltime}  </div> <div class="col-4"> ${this.displayablelaptimes}  </div></div>`;
  }
  getResultJson()
  {
    var jobj = {};
    jobj.totaltime = this.totaltime;
    jobj.laps = this.laps;
    jobj.name = this.name;
    jobj.number = this.number;
    jobj.displayabletime = convertSecondsToTime(this.totaltime);
    jobj.laptimes = [];
    this.laptimes.forEach(p => {jobj.laptimes.push(convertSecondsToTime(p));});
    jobj.finished = !this.DNF;
    return jobj;
  }
}

/*
function display (s)
{
var str =  `<div class="row"> <div class="col-3"><p><a class="btn btn-secondary btn-checkout" href="#unknown" role="button" id=${s.number} onClick=${s.incrementLap()};> ${s.number} </a></p></div> <div class="col-3"> <p> ${s.laps} </p> </div> <div class="col-3"> <p> ${s.totaltime} </p> </div> <div class="col-3"> <p> Is i ${s.laptimes[s.laps]} </p> </div></div>`;
//	    document.getElementById(this.number).onclick=function(){this.incrementLap();};
return str;

}
*/

function showbadges(val)
{
  return `<span class="badge badge-light">${val}</span>`;
}

function addPlayer(pinfo,raceinfo)
{
  //    pname = document.getElementById('playernumber').value;
  // Check that we dont have any player with the same name
  const duplicate = players.some(player=>player.number == pinfo.bib);
  if (duplicate)
  {
    alert ("Duplicate player: "+pinfo.bib);
  }
  else
  {
    lt = [];
    s = new Skater(pinfo.bib, pinfo.firstname, 0, raceinfo.laps, 0, 0, lt);
    players.push(s);
    //console.log("inside add player");
    //clicks.push(s.incrementLap);
    refreshPlayers();
  }
  //document.getElementById ("playernumber").value="";
  //document.getElementById ("playernumber").focus();

}

function clearResults()
{
    result=[];
    document.getElementById("results").innerHTML = "";

}
function clearRace()
{
  document.getElementById("raceinfo").innerHTML="";
}

function clearPlayerList()
{
  players=[];
  refreshPlayers();
  document.getElementById("players").innerHTML = "";
}
function saveResults()
{
  // Call API to save results;
}
function discardResults()
{
  // Cleanup stuff and start fresh
}
function prepareResults()
{
  for (var i=0; i< players.length ;i++)
  {
    result[i] = players[i].getResultJson();
  }
  resultcols = [
     {field:'position', title:'#'},
     {field:'number', title:'Start Nr.'},
  {field:'name', title:'Name'},
  {field:'displayabletime', title:'Time'},
  {field:'laptimes', title:'Laps'},
  {field:'finished', title:'Finished'} ];
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
  }
  $('#results').bootstrapTable({columns:resultcols, data:result});
  $('#results').bootstrapTable('refreshOptions', { theadClasses:'thead-dark', classes: 'table table-bordered table-hover table-striped'});
  var row = ` <div class="row"> <div class="col-6  "> <a class="btn btn-block btn-success" href="#unknown" onClick=saveResults()  role="button"> Save Results </a>  </div><div class="col-6 ">  <a class="btn btn-block btn-danger" href="#unknown" onClick='discardResults()'  role="button"> Discard Results</a>  </div></div>` ;
  document.getElementById('resultactions').innerHTML = row;


}

function callRest()
{
  //addPlayer(36);
  //addPlayer(86);
  //addPlayer(16);
  //refreshPlayers();
}


function increment(pnum)
{
  players[pnum].incrementLap();
  refreshPlayers();
}

function refreshPlayers()
{

  var row='' ;
  //console.log("inside refresh Players");
  row = '<div class="row"> <div class="col-4 table-header ">Player Bib (Laps) </div><div class="col-4 table-header">Total Time</div><div class="col-4 table-header">Lap timings</div></div>' ;
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
    element1.setAttribute('onclick', `increment(${pm})`);
  }
}

function populateRaces()
{
  var row='' ;
  console.log("races is "+ allraces);
  allraces.forEach(r => { row += buildRaceMenu(row,r);});
  console.log("row is "+ row);
  document.getElementById('racesdd').innerHTML = row;
  i=1;
  allraces.forEach(r => { (document.getElementById(`race${i}`)).setAttribute('onclick', `showRaceInfo(${i})`); i++; console.log(r) ;});

}

function buildRaceMenu(row,r)
{
  return `<a class="dropdown-item" id="race${r.id}" href="#"> ${r.id} - ${r.name} (${r.laps})</a>` ;
}

function showRaceInfo(num)
{
  clearPlayerList();
  raceinfo = allraces[num-1];
  var row='' ;
  raceinfocols=[ {field:'id', title:'ID'},
    {field:'laps', title:'Laps'},
    {field:'name', title:'Name'} ];
  var arraywrap=[];
  arraywrap[0] = raceinfo;
  $('#raceinfo').bootstrapTable({columns:raceinfocols, data:arraywrap});
  $('#raceinfo').bootstrapTable('refreshOptions', { theadClasses:'thead-dark', classes: 'table table-bordered table-hover table-striped'});
  //console.log("inside refresh Players");
//  row = `<div class="row"> <div class="col-4  "> ${raceinfo.name} </div><div class="col-4 ">${raceinfo.laps}</div><div class="col-4 ">${raceinfo.id}</div> </div>` ;
  row = ` <div class="row"><div class="col-6 ">  <a class="btn btn-block btn-success" href="#unknown" onClick='startRace()'  role="button"> Start Race</a>  </div><div class="col-6 "> <a class="btn btn-block btn-danger" href="#unknown" onClick=endRace()  role="button"> End Race </a>  </div></div>` ;
  document.getElementById('raceactions').innerHTML = row;
  document.getElementById('results').innerHTML = "";
  document.getElementById('resultactions').innerHTML = "";
  document.getElementById("waiting").style.display = "block";
  getPlayersForRace(raceinfo.id);
  var x = setInterval(function() {
  document.getElementById("waiting").style.display = "none";
}, 2500);
}
function startRace()
{
  startTime = new Date().getTime();
  players.forEach(s => { s.disabled=""; });
  disabled="";
  document.getElementById("showtimer").style.display="block";
  refreshPlayers();
}

function endRace()
{
  document.getElementById("showtimer").style.display="none";
  document.getElementById("raceactions").innerHTML="";
  prepareResults();
  clearPlayerList();
}

function getLapsedTime()
{
  return document.getElementById("spantimer").innerHTML;
}

function convertSecondsToTime(t=timersecs)
{
  var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((t % (1000 * 60)) / 1000);
  var tenths = Math.floor ((t % 1000)/100) ;
  return `${minutes}:${seconds}.${tenths}`;
}

// Set the date we're counting down to
var startTime = new Date().getTime();

// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  now = new Date().getTime();

  // Find the distance between now and the count down date
  timersecs = now - startTime;
  document.getElementById("spantimer").innerHTML = convertSecondsToTime();
}, 100);


function getRacesForEvent(eventid=1)
{
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
    }, 2500);
}


function getRaceInfo(raceid)
{
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
    }, 2500);
}
function getPlayersForRace(raceid)
{
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
    }, 2500);
}

function updatePlayers(playerinfo)
{
   console.log(playerinfo);
   playerinfo.forEach(p => { addPlayer(p,raceinfo); });
   refreshPlayers();
}
