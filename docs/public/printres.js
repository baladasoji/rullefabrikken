//var players;
var ircols = [
                  {field:'position', title:'#'},
                  {field:'number', title:'Start Nr'},
                  {field:'name', title:'Name'},
                  {field:'displayabletime', title:'Total time'},
                  {field: 'laps', title:'Laps'},
                  {field:'points', title:'Points'},
                  {field:'laptimes', title:'Lap time'},
                  {field:'lapstatus', title:'Status '}
              ];
/*********** Utility Functions in the Beginning *******************/

/* Utility method to get value of a URLParameter
* works both with JS style and standard styles */
function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&|#]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

function populateResults(allresults)
{
  allresults.forEach(r => { displayResultTable(r);});
}

function displayResultTable(r)
{
  tab = document.createElement("table");
  div = document.createElement("div");
  //text = '<table class="table table-dark"> <thead> <tr> <th scope="col">#</th> <th scope="col">Race Name</th> <th scope="col">Laps</th> </tr> </thead>';
  text = `<table class="table table-bordered table-info h3"><tdata><tr> <td> # ${r.raceid}</td> <td>${r.racename} </td> <td> Omg : ${r.laps} </td> <td> <a onclick="window.print()"> <i class="fas fa-print"></i> </a> </td> </tr></tdata></table>` ;
  div.innerHTML = text;
  id=r.raceid;
  tab.id = "res"+id;
  document.getElementById("result").appendChild(div);
  document.getElementById("result").appendChild(tab);
  console.log(r.result);
  $('#'+'res'+id).bootstrapTable({columns:ircols, data:r.result});
  $('#res'+id).bootstrapTable('refreshOptions',{"theadClasses": "thead-light"});
  $('#'+'res'+id).bootstrapTable('load',r.result);
}

function apiGetResults()
{
  var raceid= getURLParameter('raceid');
  var eventid= getURLParameter('eventid');
  if (raceid == null || eventid == null)
  {
    alert("RaceID and EventID not provided");
  }
  else
  {
      var apiXMLReq = new XMLHttpRequest();
         apiXMLReq.open("GET", rr_api_url + '/results?raceid='+ raceid+'&eventid='+eventid , true );
      apiXMLReq.send(null);
      apiXMLReq.onload = function () {
          if (apiXMLReq.readyState == 4 && apiXMLReq.status == "200") {
            allresults = JSON.parse(apiXMLReq.responseText);
            populateResults(allresults);
             // alert('All players checkedout');
          } else {
              alert('Error in Get Results');
          }
      }
  }
}
