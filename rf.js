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
    constructor(number, name ,laps, starttime, totaltime, laptimes) {
        this.number = number;
        this.name = name;
	this.laps = laps;
	this.starttime = starttime;
        this.totaltime = totaltime;
	this.laptimes=laptimes;
	this.displayabletotaltime='';
	this.displayablelaptimes=[];
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
	console.log("incrementing the laps" + this.laps);
	this.setTotalTime();
	this.setLapTime();
    }
    
    setTotalTime ()
    {
	this.totaltime=timersecs;
	this.displayabletotaltime = convertSecondsToTime(this.totaltime);
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
	this.displayablelaptimes[this.laps]= convertSecondsToTime(this.laptimes[this.laps]);
    }

    // Adding a method to the constructor
    greet() {
        return `${this.name} says hello.`;
    }
    display()
    {
	
	    return  `<div class="row"> <div class="col-3"><button type="button" class='${buttonclass}' href="#" id=${this.number} ${disabled} > ${this.number} </button></div> <div class="col-3">  <h1> <span class="badge badge-primary badge-pill"> ${this.laps} </span> </h1> </div> <div class="col-3"> ${this.displayabletotaltime}  </div> <div class="col-3"> ${this.displayablelaptimes}  </div></div>`;
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
function addPlayer(pname)
{
//    pname = document.getElementById('playernumber').value;
    lt = [];
    s = new Skater(pname, pname, 0, 0, 0, lt);
    players.push(s);
    clicks.push(s.incrementLap);
    refreshPlayers();
}

function clearPlayerList()
{
    players=[];
    refreshPlayers();
}
    

function callRest()
{

	addPlayer(36);
	addPlayer(86);
	addPlayer(16);
        refreshPlayers();
}


function increment(pnum)
{

    players[pnum].incrementLap();
    refreshPlayers();
}

function refreshPlayers()
{
    
        var row='<div class="container"> <div class="row"> <div class="col-12 table-header"> Players  </div></div>' ;
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
    disabled="";
    refreshPlayers();
}

function getLapsedTime()
{
    return document.getElementById("demo").innerHTML;
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
    
}, 100);



