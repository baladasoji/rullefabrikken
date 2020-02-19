async function logSha1( str ) {
  const buffer = new TextEncoder( 'utf-8' ).encode( str );
  const digest = await crypto.subtle.digest('SHA-1', buffer);

  // Convert digest to hex string
  const result = Array.from(new Uint8Array(digest)).map( x => x.toString(16).padStart(2,'0') ).join('');
  sessionStorage.access_token = result;
          setTimeout(function(){
              window.location.href = "index.html";
          }, 1000);
}

function saveToken()
{
  pass= document.getElementById('rrcode').value;
  eventid = document.getElementById('rrevent').value;
  sessionStorage.eventid = eventid;
  logSha1(pass);
}
