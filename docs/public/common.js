var rr_api_url="https://rr.dasoji.net";
var eventid=sessionStorage.eventid!=null ? sessionStorage.eventid : 1;
var apitimeout=sessionStorage.apitimeout!=null ? sessionStorage.apitimeout : 2500;
var cooldowntimeout=sessionStorage.cooldowntimeout!=null ? sessionStorage.cooldowntimeout : 5000;
var blapcounter=sessionStorage.blapcounter!=null ? JSON.parse(sessionStorage.blapcounter) : false;
var bliveresult=sessionStorage.bliveresult!=null ? JSON.parse(sessionStorage.bliveresult) : false;
var bcooldown=sessionStorage.bcooldown!=null ? JSON.parse(sessionStorage.bcooldown) : false;
var liverefreshinterval=sessionStorage.liverefreshinterval!=null ? sessionStorage.liverefreshinterval : 4000;
var laprefreshinterval=sessionStorage.laprefreshinterval!=null ? sessionStorage.laprefreshinterval : 4000;
var starttomiddelay=sessionStorage.starttomiddelay!=null ? sessionStorage.starttomiddelay : 15000;
var access_token=sessionStorage.access_token;