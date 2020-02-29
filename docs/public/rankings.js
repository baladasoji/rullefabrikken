//var players;
var timersecs=0;
var resultcols =[
                  {sortable:true,field:'position', title:'#'},
                  {sortable:true,field:'points', title:'Points'},
                  {sortable:true,field:'bib', title:'Start Nr'},
                  {sortable:true,field:'firstname', title:'FirstName'},
                  {sortable:true,field:'lastname', title:'Last Name'}
               ];
/*********** Utility Functions in the Beginning *******************/

/* Utility method to get value of a URLParameter
* works both with JS style and standard styles */

function populateRankings(allrankings)
{
  console.log(allrankings);
  allplayers.Items.forEach(ranking => displayRankingTable(ranking))
}

function displayRankingTable(ranking)
{
  tab = document.createElement("table");
  div = document.createElement("div");
  //text = '<table class="table table-dark"> <thead> <tr> <th scope="col">#</th> <th scope="col">Race Name</th> <th scope="col">Laps</th> </tr> </thead>';
  groupname = ranking.agegroup;
  div.className="mx-auto";
  div.style.width="200px";
  div.innerHTML = `<h1>${groupname}</h1>`;
  id=groupname;
  tab.id = "ran"+id;
  for (var i=0; i< ranking.players.length;i++){
    ranking.players[i].position = i+1;
  }
  document.getElementById("allrankings").appendChild(div);
  document.getElementById("allrankings").appendChild(tab);
  $('#'+'ran'+id).bootstrapTable({columns:resultcols, data:ranking.players});
  $('#ran'+id).bootstrapTable('refreshOptions',{"theadClasses": "thead-light"});
  $('#'+'ran'+id).bootstrapTable('load',ranking.players);
}

function apiGetPlayers()
{
  var apiXMLReq = new XMLHttpRequest();
     apiXMLReq.open("GET", rr_api_url + '/players/bygroup?eventid='+eventid , true );
  apiXMLReq.send(null);
  apiXMLReq.onload = function () {
      if (apiXMLReq.readyState == 4 && apiXMLReq.status == "200") {
        allplayers = JSON.parse(apiXMLReq.responseText);
        populateRankings(allrankings);
         // alert('All players checkedout');
      } else {
          alert('Error in Get players by group');
      }
  }
}
