/* Separated out implementation of Skater class into a separate js file
*/

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

  convertSecondsToTime(t=timersecs)
  {
    var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((t % (1000 * 60)) / 1000);
    var tenths = Math.floor ((t % 1000)/100) ;
    return `${minutes}:${seconds}.${tenths}`;
  }
}
