var player_url = "https://939b5fzk1j.execute-api.eu-west-1.amazonaws.com/Testing/players";
var schedule_url = "https://939b5fzk1j.execute-api.eu-west-1.amazonaws.com/Testing/schedule";
//var players;
var players = [];
var laps = [];
var timers = [] ;
var laptimers = [];
function callPlayersApi(element, url)
{
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.onreadystatechange = function() {
        if (this.readyState == 4)
        {
            allplayers = JSON.parse(apiXMLReq.responseText);
            var i = 1;
            var row='<div class="container"> <div class="row"> <div class="col-12 table-header"> Players  </div></div>' ;
            for ( var s in allplayers)
            {
                var id = allplayers[s].id;
                var name = allplayers[s].name;
                var checkedin = allplayers[s].CheckedIn;
                if (checkedin == 'True')
                {
                    row = row + `<div class="row"> <div class="col-6 checkedin-player-name" id=${name}> ${name} </div> <div class="col-6"><p><a class="btn btn-secondary btn-checkout" href="#unknown" onClick=checkout(${id},"${allplayers[s].name}") role="button">Checkout &raquo;</a></p></div> </div>`;
                }
                else
                {
                    row = row + `<div class="row"> <div class="col-6 checkedout-player-name" id=${name}> ${name} </div> <div class="col-6"><p><a class="btn btn-secondary btn-checkin" href="#unknown" onClick=checkin(${id},"${allplayers[s].name}") role="button">Checkin &raquo;</a></p></div></div>`;
                }
                i++;
                // Do something
            }
            document.getElementById(element).innerHTML = row;

        }
      };
    apiXMLReq.open("GET", player_url + url , true );
    apiXMLReq.setRequestHeader("x-api-key","s8Acz0z7Ix2z8t20xyPZu5pQ4WAa2EQ13yFRpUBu");
    apiXMLReq.send(null);

}

class Skater {
    constructor(number, name ,laps, starttime, totaltime, laptimes) {
        this.number = number;
        this.name = name;
	this.starttime = starttime;
        this.totaltime = totaltime;
	this.laptimes=laptimes;
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
    }
    
    setTotalTime (totaltime)
    {
	this.totaltime=totaltime;
    }

    setLaptime(curlaptime)
    {
	this.laptimes[this.laps] = curlaptime;
    }

    // Adding a method to the constructor
    greet() {
        return `${this.name} says hello.`;
    }
    display ()
    {
	    return  `<div class="row"> <div class="col-3"><p><a class="btn btn-secondary btn-checkout" href="#unknown" onClick=this.incrementLap() role="button"> ${this.number} </a></p></div> <div class="col-3"> <p> ${this.laps} </p> </div> <div class="col-3"> <p> ${this.totaltime} </p> </div> <div class="col-3"> <p> ${this.laptimes[this.laps]} </p> </div></div>`;
	
    }
}

function addPlayer(pname)
{
//    pname = document.getElementById('playernumber').value;
    players.push(pname);
    laps.push(0);
    timers.push(0);
    laptimers.push(0);
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

function incrementLap(pnum)
{
    laps[pnum]++;
    timers[pnum] = document.getElementById("demo").innerHTML + "<BR>" ;
    laptimers[pnum] += document.getElementById("demo").innerHTML + "<BR>" ;
    console.log(laps[pnum]);
    refreshPlayers();
}
function refreshPlayers()
{
    
        var row='<div class="container"> <div class="row"> <div class="col-12 table-header"> Players  </div></div>' ;
	for (var pnum in players )
	{
	    row = row + `<div class="row"> <div class="col-3"><p><a class="btn btn-secondary btn-checkout" href="#unknown" onClick=incrementLap(${pnum}) role="button"> ${players[pnum]} </a></p></div> <div class="col-3"> <p> ${laps[pnum]} </p> </div> <div class="col-3"> <p> ${timers[pnum]} </p> </div> <div class="col-3"> <p> ${laptimers[pnum]} </p> </div></div>`;
	}
        document.getElementById('players').innerHTML = row;
}

function startRace()
{
    startTime = new Date().getTime();
}

// Set the date we're counting down to
var startTime = new Date().getTime();

// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();
    
  // Find the distance between now and the count down date
  var distance = now - startTime;
    
  // Time calculations for days, hours, minutes and seconds
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  var tenths = Math.floor ((distance % 1000)/100) ;

    
  // Output the result in an element with id="demo"
  document.getElementById("demo").innerHTML =  minutes + " : " + seconds + "." +tenths;
    
  // If the count down is over, write some text 
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("demo").innerHTML = "EXPIRED";
  }
}, 100);


function showSchedule()
{
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.onreadystatechange = function() {
        if (this.readyState == 4)
        {
            plan = JSON.parse(apiXMLReq.responseText);
            ts = plan['timestamp']*1000;
            var date = new Date(ts).toLocaleString("da-DK");
            var i = 1;
            var row=`<div class="container"> <div class="row"> <div class="col-6 table-header"> Schedule prepared at </div> <div class="col-6 table-header"> ${date}</div> </div>` ;
            for ( var s in plan['plan'])
            {
                var curcourt = plan['plan'][s]['court'];
                var curplayers = plan['plan'][s]['players'];
                row = row + `<div class="row newcourt">  <div class="col-12"> Court ${curcourt} </div> </div> `;
                row = row + `<div class="row playerincourt">`;
                for (var curplayer in curplayers)
                {
                    row = row + `<div class="col-6">  ${plan['plan'][s]['players'][curplayer]} </div>`;
                }
                row = row + `</div>`;
            }
            row = row + `</div>`;
            document.getElementById('schedule').innerHTML = row;

        }
      };
    apiXMLReq.open("GET", schedule_url , true );
    apiXMLReq.setRequestHeader("x-api-key","s8Acz0z7Ix2z8t20xyPZu5pQ4WAa2EQ13yFRpUBu");
    apiXMLReq.send(null);

}
function makeSchedule(type)
{
    var body = `{ "type":\"${type}\" }`;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", schedule_url+'/create', true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.setRequestHeader("x-api-key","s8Acz0z7Ix2z8t20xyPZu5pQ4WAa2EQ13yFRpUBu");
    //xhr.setRequestHeader('Content-Length',body.length);
    xhr.send(body);
    xhr.onload = function () {
        var users = JSON.parse(xhr.responseText);
        //alert(users);
        if (xhr.readyState == 4 && xhr.status == "200") {
                alert('Ok');
        } else {
                alert('Error in making schedule');
        }
    }
}

function checkoutAll()
{
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.open("GET", player_url + '/clearall' , true );
    apiXMLReq.setRequestHeader("x-api-key","s8Acz0z7Ix2z8t20xyPZu5pQ4WAa2EQ13yFRpUBu");
    apiXMLReq.send(null);
    apiXMLReq.onload = function () {
        if (apiXMLReq.readyState == 4 && apiXMLReq.status == "200") {
           // alert('All players checkedout');
        } else {
            alert('Error in checkout All');
        }
    }
    setTimeout(function(){
        makeSchedule('doubles');
    }, 2500);
}

function checkin(id,name)
{
    var body = `{ "id": ${id}, "name":\"${name}\"}`;
//    alert(body);

    var xhr = new XMLHttpRequest();
    xhr.open("PUT", player_url+'/checkin', true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    //xhr.setRequestHeader('Content-Length',body.length);
    xhr.send(body);
    xhr.onload = function () {
        var users = JSON.parse(xhr.responseText);
        //alert(users);
        if (xhr.readyState == 4 && xhr.status == "200") {
          //      alert('ok');
        } else {
            //    alert('not ok');
        }
    }
    setTimeout(function(){
        callRest();
    }, 1500);
}



function checkout(id,name)
{
    var body = `{ "id": ${id}, "name":\"${name}\"}`;
//    alert(body);

    var xhr = new XMLHttpRequest();
    xhr.open("PUT", player_url+'/checkout', true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.setRequestHeader('Content-Length',body.length);
    xhr.send(body);
    xhr.onload = function () {
        var users = JSON.parse(xhr.responseText);
        //alert(users);
        if (xhr.readyState == 4 && xhr.status == "200") {
          //      alert('ok');
        } else {
            //    alert('not ok');
        }
    }
    setTimeout(function(){
        callRest();
    }, 1500);
}
