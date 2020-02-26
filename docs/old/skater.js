/* Separated out implementation of Skater class into a separate js file
*/

class Skater {
  constructor(id,number, name , totallaps ) {
    this.id = id;
    this.number = number;
    this.name = name;
    this.laps = 0;
    this.totallaps=totallaps;
    this.starttime = 0;
    this.totaltime = 0;
    this.prevtotaltime = 0;
    this.laptimes=[];
    this.displayabletotaltime='';
    this.displayablelaptimes='';
    this.DNF=true;
    this.DNS=true;
    this.disabled="disabled";
    this.buttonclass='btn btn-primary btn-md btn-block';
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
      this.buttonclass='btn btn-secondary btn-md btn-block';
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
    this.buttonclass='btn btn-primary btn-md btn-block';
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
    var result = {};
    result.totaltime = this.totaltime;
    result.laps = this.laps;
    result.playerid = this.id;
    result.name = this.name;
    result.number = this.number;
    result.displayabletime = this.convertSecondsToTime(this.totaltime);
    result.laptimes = [];
    for (i=0; i< this.laps; i++)    {
      if (i==0)
        result.laptimes.push("  "+this.convertSecondsToTime(this.laptimes[i]));
      else
        result.laptimes.push("  "+this.convertSecondsToTime(this.laptimes[i] - this.laptimes[i-1]));
    }
//    this.laptimes.forEach(p => {result.laptimes.push(convertSecondsToTime(p));});
    if (this.DNS)
      result.lapstatus = "DNS";
    else if (this.DNF)
      result.lapstatus = "DNF"
    else
      result.lapstatus = "Finished";
    return result;
  }

  convertSecondsToTime(t=timersecs)
  {
    var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((t % (1000 * 60)) / 1000);
    var tenths = Math.floor ((t % 1000)/100) ;
    console.log("minutes is"+minutes)
    if (minutes == 0)
      return `${seconds}.${tenths}`;
    else
      return `${minutes}:${seconds}.${tenths}`;
  }
}
