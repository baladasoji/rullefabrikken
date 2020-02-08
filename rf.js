var player_url = "https://939b5fzk1j.execute-api.eu-west-1.amazonaws.com/Testing/players";
var schedule_url = "https://939b5fzk1j.execute-api.eu-west-1.amazonaws.com/Testing/schedule";
//var players;
var players = [];
var clicks = [];
var laps = [];
var timers = [] ;
var laptimers = [];
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
	this.displayabletotaltime = "<h3 align='center'> <span class='badge badge-pill badge-success'>" +  convertSecondsToTime(this.totaltime) + "</span></h3>";
    }

    setLapTime()
    {
	if (this.laps > 1)
	{
	    this.laptimes[this.laps] = timersecs - this.laptimes[this.laps-1];
	}
	else
	{
	    this.laptimes[this.laps]= timersecs;
	}
	this.displayablelaptimes += "<span class='badge badge-pill badge-info'>"+ convertSecondsToTime(this.laptimes[this.laps]) + "</span>";
    }

    // Adding a method to the constructor
    greet() {
        return `${this.name} says hello.`;
    }
    display()
    {
	
	    return  `<div class="row"> <div class="col-4"><button type="button" class='${buttonclass}' href="#" id=${this.number} ${this.disabled} > ${this.number}  <span class="badge badge-light badge-pill"> ${this.laps} </span>  </button> </div> <div class="col-4"> ${this.displayabletotaltime}  </div> <div class="col-4"> ${this.displayablelaptimes}  </div></div>`;
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

function addPlayer(pname)
{
//    pname = document.getElementById('playernumber').value;
    lt = [];
    s = new Skater(pname, pname, 0, 5, 0, 0, lt);
    players.push(s);
    document.getElementById ("playernumber").value="";
    //console.log("inside add player");
    //clicks.push(s.incrementLap);
    refreshPlayers();
}

function clearPlayerList()
{
    players=[];
    refreshPlayers();
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
    
        var row='<div class="container"> ' ;
	//console.log("inside refresh Players");
	row = row + '<div class="row"> <div class="col-4 table-header ">Player Bib (Laps) </div><div class="col-4 table-header">Total Time</div><div class="col-4 table-header">Lap timings</div></div>' ;
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
}

function getLapsedTime()
{
    return document.getElementById("spantimer").innerHTML;
}

function convertSecondsToTime()
{
  var minutes = Math.floor((timersecs % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((timersecs % (1000 * 60)) / 1000);
  var tenths = Math.floor ((timersecs % 1000)/100) ;
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



