//var players;
var timersecs=0;
var resultcols =[
                  {sortable:true,field:'raceid', title:'ID'},
                  {sortable:true,field:'agegroup', title:'Age Group'},
                  {sortable:true,field:'eventid', title:'Event ID'},
                  {sortable:true,field:'laps', title:'Laps'},
                  {sortable:true,field:'racename', title:'Name'}
               ];
var ircols = [
                  {field:'position', title:'#'},
                  {field:'number', title:'Start Nr'},
                  {field:'name', title:'Name'},
                  {field:'displayabletime', title:'Total time'},
                  {field: 'laps', title:'Laps'},
                  {field:'points', title:'Points'},
                  {field:'laptimes', title:'Lap time'},
                  {field:'lapstatus', title:'Status '},
                  { field: 'operate', title: 'Swap', align: 'center', clickToSelect: false,  formatter: operateFormatter }
              ];
var allresults=[];
var currace={};
/*********** Utility Functions in the Beginning *******************/

/* Utility method to get value of a URLParameter
* works both with JS style and standard styles */
function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&|#]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

function initializeApp() {

}

function operateFormatter(value, row, index) {
  return [
    '<a class="like" href="#unknown" onClick="return false;" title="Swap">',
    '<i class="fa fa-arrow-down fa-2x"></i>',
    '</a>  '
  ].join('')
}

function populateResults(allresults)
{
  $('#index').bootstrapTable({columns:resultcols, data:allresults});
  $('#index').bootstrapTable('load',allresults);
  $('#index').bootstrapTable('refreshOptions',{"theadClasses": "thead-light"});
  $('#index').on('click-row.bs.table', function (e, row, $element) { showResultForRace(row.raceid);
});
  allresnode = document.getElementById("allresults");
  while (allresnode.firstChild) {
   allresnode.removeChild(allresnode.lastChild);
  }
}

function showResultForRace(raceid)
{
  allresnode = document.getElementById("allresults");
  while (allresnode.firstChild) {
   allresnode.removeChild(allresnode.lastChild);
  }
  allresults.forEach(r => {
    if (r.raceid == raceid)
    {
      currace=r;
      tab = document.createElement("table");
      div = document.createElement("div");
      divsave = document.createElement("div");
      //text = '<table class="table table-dark"> <thead> <tr> <th scope="col">#</th> <th scope="col">Race Name</th> <th scope="col">Laps</th> </tr> </thead>';
      text = `<table class="table bg-info text-white h4"><tdata><tr> <td> # ${r.raceid}</td> <td>${r.racename} </td> <td> Omg : ${r.laps} </td> </tr></tdata></table>` ;
      div.innerHTML = text;
      saverow = ` <div class="row"> <div class="col-6"> <a class="btn btn-block btn-success" href="#unknown" onclick="apiSaveChanges()"  role="button"> Save Changes </a>  </div><div class="col-6 ">  <a class="btn btn-block btn-danger" href="#unknown" onclick="apiGetResults()"  role="button"> Discard Changes</a>  </div></div>` ;
      divsave.innerHTML = saverow;
      id=r.raceid;
      tab.id = "res"+id;
      document.getElementById("allresults").appendChild(div);
      document.getElementById("allresults").appendChild(tab);
      document.getElementById("allresults").appendChild(divsave);
      $('#'+'res'+id).bootstrapTable({columns:ircols, data:r.result});
      $('#'+'res'+id).on('click-cell.bs.table', function (evnt, field, value, row){
        console.log(field, value, row);
        if (field=='operate')
        {
            swapPositions(r, raceid, row.position, row.position+1)
        }
      });
      $('#res'+id).bootstrapTable('refreshOptions',{"theadClasses": "thead-light", "sortName": "position", "sortOrder":"asc"});
    }

  } )
  document.getElementById("res"+raceid).scrollIntoView({behavior: "smooth",block:"start"});
}

function swapPositions(r, raceid, pos1, pos2)
{
  var bib1points, bib2points, bib1pos, bib2pos;
      r.result.forEach( res => {
        if (res.position==pos1)  {
          bib1points = res.points;
          bib1pos = res.position;
        }
        else if (res.position==pos2) {
          bib2points= res.points;
          bib2pos = res.position;
        }
      });
  console.log(bib1pos, bib1points, bib2pos, bib2points);
      r.result.forEach( res => {
        if (res.position==pos1)  {
          res.points = bib2points;
          res.position = bib2pos;
        }
        else if (res.position==pos2) {
          res.points = bib1points;
          res.position = bib1pos;
        }
      });
      console.log(r.result);
  showResultForRace(raceid);
}
function apiSaveChanges()
{
    singleresult=currace;
    var apiXMLReq = new XMLHttpRequest();
       apiXMLReq.open("PUT", rr_api_url + '/results/change' , true );
       apiXMLReq.setRequestHeader('Content-type', 'application/json');
    var data={};
    data.result = singleresult;
    apiXMLReq.send(JSON.stringify(data));
    apiXMLReq.onload = function () {
        if (apiXMLReq.readyState == 4 && apiXMLReq.status == "200") {
          res = JSON.parse(apiXMLReq.responseText);
           alert('Result Changed');
           apiGetResults();
        } else {
            alert('Error in Changing Results');
        }
    }
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
