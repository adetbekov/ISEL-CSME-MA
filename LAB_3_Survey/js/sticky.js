let h = document.getElementById("header");
let placeholder = document.getElementById("placeholder");
let stuck = false;
let stickPoint = getDistance() + 40;

function getDistance() {
  let topDist = h.offsetTop;
  return topDist;
}

window.onscroll = function(e) {
  let distance = getDistance() - window.pageYOffset + 40;
  let offset = window.pageYOffset;
  if ( (distance <= 0) && !stuck && (document.body.clientWidth > 576) ) {
    h.style.position = 'fixed';
    h.style.top = '0px';
    placeholder.style.display = 'block'; 
    stuck = true;
  } else if (stuck && (offset <= stickPoint)){
    placeholder.style.display = 'none';
    h.style.position = 'static';
    stuck = false;
  }
}