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
    this.prevtotaltime = totaltime;
    this.laptimes=laptimes;
    this.displayabletotaltime='';
    this.displayablelaptimes='';
    this.DNF=true;
    this.DNS=true;
    this.disabled="disabled";
    this.buttonclass='btn btn-primary btn-lg btn-block';
  }

  setStarttime(starttime) {
    this.starttime = starttime ;
  }

  setLaps (laps) {
    this.laps = laps ;
  }

  incrementLap()  {
    this.setTotalTime();
    this.setLapTime();
    // Increment the laps after setting the totaltime and laptimes
    // Remember that arrays start with zero index.
    this.laps++ ;
    // If they complete atleast one lap then DNS should be false
    this.DNS=false;
    if (this.laps == this.totallaps)    {
      // If they complete all the laps then set DNF to false
      this.DNF = false;
      this.disabled = "disabled" ;
      this.buttonclass='btn btn-secondary btn-lg btn-block';
    }
    //console.log("incrementing the laps" + this.laps);
  }

  decrementLap()  {
    // Increment the laps after setting the totaltime and laptimes
    // Remember that arrays start with zero index.
    this.laps-- ;
    // If they complete atleast one lap then DNS should be false
    if (this.laps == 0)
    this.DNS=true;
    this.DNF=true;
    this.disabled="";
    this.buttonclass='btn btn-primary btn-lg btn-block';
  }

  setTotalTime ()  {
    this.prevtotaltime = this.totaltime;
    this.totaltime=timersecs;
    this.displayabletotaltime = "<span class='badge badge-pill badge-success' style='font-size:large;'>" +  convertSecondsToTime(this.totaltime) + "</span></h3>";
  }

  setLapTime()  {
    this.laptimes[this.laps] = timersecs; // - this.prevtotaltime;

    this.displayablelaptimes = "<span class='badge badge-pill badge-info' style='font-size:x-small'>"+ convertSecondsToTime(this.laptimes[0]) + "</span>";
    for (i = 1; i <= this.laps; i++) {
      this.displayablelaptimes += "<span class='badge badge-pill badge-info' style='font-size:x-small'>"+ convertSecondsToTime(this.laptimes[i] - this.laptimes[i-1]) + "</span>";
    }
  }

  display()  {
    return  `<div class="row"> <div class="col-4"><button type="button" class="${this.buttonclass}" href="#" id=${this.number} ${this.disabled} > ${this.number}  <span class="badge badge-light badge-pill"> ${this.laps} </span>  </button> </div> <div class="col-2" style="text-align:center;"> ${this.displayabletotaltime}  </div> <div class="col-4"> ${this.displayablelaptimes}  </div> <div class="col-2"><button type="button" class="btn-danger ${this.buttonclass}" href="#" id=adj${this.number} ${this.disabled}> &#8595; </button> </div></div>`;
  }

  getResultJson()  {
    var jobj = {};
    jobj.totaltime = this.totaltime;
    jobj.laps = this.laps;
    jobj.name = this.name;
    jobj.number = this.number;
    jobj.displayabletime = convertSecondsToTime(this.totaltime);
    jobj.laptimes = [];
    for (i=0; i< this.laps; i++)    {
      if (i==0) {
        jobj.laptimes.push(convertSecondsToTime(this.laptimes[i]));
      }
      else {
        jobj.laptimes.push(convertSecondsToTime(this.laptimes[i] - this.laptimes[i-1]));
      }
    }
//    this.laptimes.forEach(p => {jobj.laptimes.push(convertSecondsToTime(p));});
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
