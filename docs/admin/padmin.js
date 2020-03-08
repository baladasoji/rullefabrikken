//var players;
var playercols= [
                  {sortable:true,field:'bib', title:'Start #'},
                  {sortable:false,field:'firstname', title:'Fornavn'},
                  {sortable:false,field:'lastname', title:'Efternavn'},
                  {sortable:true,field:'agegroup', title:'Gruppe'},
                  {sortable:false,field:'age', title:'Alder'},
                  {sortable:false,field:'penaltypoints', title:'Penalty'},
                  {field: 'update', title: 'Update', align: 'center', clickToSelect: false,  formatter: updateFormatter }
               ];

var eventdata;
var racedata;
var playerdata;

function updateFormatter(value, row, index) {
  return [
    '<a class="like" href="#unknown" onClick="return false;" title="Swap">',
    '<i class="fa fa-edit"></i>',
    '</a>  '
  ].join('')
}

function getRaces()
{
    var apiXMLReq = new XMLHttpRequest();
    if (eventid == 0)
      apiXMLReq.open("GET", rr_api_url + '/races' , true );
    else
      apiXMLReq.open("GET", rr_api_url + '/races?eventid='+eventid , true );
 //   apiXMLReq.setRequestHeader("x-api-key","s8Acz0z7Ix2z8t20xyPZu5pQ4WAa2EQ13yFRpUBu");
    apiXMLReq.send(null);
    apiXMLReq.onload = function () {
        if (apiXMLReq.readyState == 4 && apiXMLReq.status == "200") {
          racedata = JSON.parse(apiXMLReq.responseText);
          $('#rrraces').bootstrapTable({columns:racecols, data:racedata , rowStyle: function rowStyle(row, index) {
                                                                          if(row.status == "finished"){
                                                                            return {classes : "text-light bg-secondary" };
                                                                           }
                                                                          else if (row.status == "in progress") {
                                                                            return {classes : "text-light bg-primary" };
                                                                          }
                                                                          return {};}
                                                                        });
          $('#rrraces').bootstrapTable('load',racedata);
          $('#rrraces').on('click-row.bs.table', function (e, row, $element) {
              raceid=row.id;
              getPlayers(true);
          });
           // alert('All players checkedout');
        } else {
            alert('Error in getRaces');
        }
    }
}

function updatePlayer(player)
{
  penarr= ['-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3', '4', '5'];
  agegrp=['mini','maxi'];
  tarr =[ `<div class="row">`,
   `<div class="col-1">${player.bib} </div>`,
   `<div class="col-2"> ${player.firstname}</div>`,
   `<div class="col-2"> ${player.lastname}  </div>`,
   `<div class="col-2"> ${player.agegroup}  </div>`,
   '<div class="col-2"> <select id="penaltypoints"></select>  </div>',
   '<div class="col-2"> <select id="newgroup"></select>  </div>',
   `<div class="col-1"> <a class="btn btn-block btn-info" href="#unknown" id="savechanges" onclick="apiSavePlayer(${player.id})"  role="button"> Save </a>  </div> `,
    '</div>'] ;
  text= tarr.join('');
  document.getElementById("playeredit").innerHTML=text;
  penpoints = document.getElementById("penaltypoints");
  newgrp = document.getElementById("newgroup");
  for (i = 0; i < penarr.length; i++) {
      var pen = new Option(penarr[i], i);
      penpoints.options.add(pen);
      if ( i == (penarr.length-1)/2){
        penpoints.selectedIndex=i;
      }
  }
  for (i = 0; i < agegrp.length; i++) {
      var a = new Option(agegrp[i], i);
      newgrp.options.add(a);
  }
  document.getElementById("playeredit").scrollIntoView({behavior: "smooth",block:"start"});
  //element1=document.getElementById("savechanges");
  //element1.setAttribute('onclick', `savePlayer(${player.id})`);
}

function apiSavePlayer(playerid)
{
  console.log(playerid, penpoints.options[penpoints.selectedIndex].text, newgrp.options[newgrp.selectedIndex].text);
  var apiXMLReq = new XMLHttpRequest();
     apiXMLReq.open("PUT", rr_api_url + '/players/change' , true );
     apiXMLReq.setRequestHeader('Content-type', 'application/json');
  var data={};
  data.id = playerid;
  data.penalty = Number(penpoints.options[penpoints.selectedIndex].text);
  data.newgroup = newgrp.options[newgrp.selectedIndex].text ;
  apiXMLReq.send(JSON.stringify(data));
  apiXMLReq.onload = function () {
      if (apiXMLReq.readyState == 4 && apiXMLReq.status == "200") {
        res = JSON.parse(apiXMLReq.responseText);
         alert('Player Saved');
         apiGetPlayers();
      } else {
          alert('Error in Changing Player');
      }
  }
}

function apiGetPlayers(scroll=false)
{
    $('#rrplayers').bootstrapTable('removeAll');
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.open("GET", rr_api_url + '/players?eventid='+eventid , true );
    apiXMLReq.send(null);
    apiXMLReq.onload = function () {
        if (apiXMLReq.readyState == 4 && apiXMLReq.status == "200") {
          playerdata = JSON.parse(apiXMLReq.responseText);
          $('#rrplayers').bootstrapTable({columns:playercols, data:playerdata});
          $('#rrplayers').bootstrapTable('load',playerdata);
          $('#rrplayers').on('click-cell.bs.table', function (evnt, field, value, row){
            //console.log(field, value, row);
            if (field=='update')
            {
                updatePlayer(row);
            }
          });
          playereditnode = document.getElementById("playeredit");
          while (playereditnode.firstChild) {
           playereditnode.removeChild(playereditnode.lastChild);
          }
          if (scroll)
            document.getElementById("eop").scrollIntoView({behavior: "smooth"});
           // alert('All players checkedout');
        } else {
            alert('Error in getPlayers');
        }
    }
}
function loadTables()
{
   apiGetPlayers();
}
