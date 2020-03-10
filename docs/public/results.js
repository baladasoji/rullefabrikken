//var players;
var timersecs=0;
var resultcols =[
                  {sortable:true,field:'raceid', title:'ID'},
                  {sortable:true,field:'agegroup', title:'Age Group'},
                  {sortable:true,field:'eventid', title:'Event ID'},
                  {sortable:true,field:'laps', title:'Laps'},
                  {sortable:true,field:'racename', title:'Name'},
                  {field: 'operate', title: 'print', align: 'center', clickToSelect: false,  formatter: operateFormatter }
               ];
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

function initializeApp() {
  
}

function operateFormatter(value, row, index) {
  console.log(row);
  return [
    `<a class="like" href=printres.html?eventid=${row.eventid}&raceid=${row.raceid} target="_blank" title="Print">`,
    '<i class="fa fa-print fa-2x"></i>',
    '</a>  '
  ].join('')
}

function populateResults(allresults)
{
  $('#index').bootstrapTable({columns:resultcols, data:allresults});
  $('#index').bootstrapTable('load',allresults);
  $('#index').bootstrapTable('refreshOptions',{"theadClasses": "thead-light"});
  $('#index').on('click-row.bs.table', function (e, row, $element) {
  document.getElementById("res"+row.raceid).scrollIntoView({behavior: "smooth",block:"start"});
});
  allresults.forEach(r => { displayResultTable(r);});
}

function displayResultTable(r)
{
  tab = document.createElement("table");
  div = document.createElement("div");
  //text = '<table class="table table-dark"> <thead> <tr> <th scope="col">#</th> <th scope="col">Race Name</th> <th scope="col">Laps</th> </tr> </thead>';
  text = `<table class="table bg-info text-white h4"><tdata><tr> <td> # ${r.raceid}</td> <td>${r.racename} </td> <td> Omg : ${r.laps} </td> </tr></tdata></table>` ;
  div.innerHTML = text;
  id=r.raceid;
  tab.id = "res"+id;
  document.getElementById("allresults").appendChild(div);
  document.getElementById("allresults").appendChild(tab);
  console.log(r.result);
  $('#'+'res'+id).bootstrapTable({columns:ircols, data:r.result});
  $('#res'+id).bootstrapTable('refreshOptions',{"theadClasses": "thead-light"});
  $('#'+'res'+id).bootstrapTable('load',r.result);
}

function apiGetResults()
{
  var apiXMLReq = new XMLHttpRequest();
     apiXMLReq.open("GET", rr_api_url + '/results?eventid='+ eventid , true );
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
