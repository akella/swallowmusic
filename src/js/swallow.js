import Perlin from './lib/perlin';
import Particle from './particle';
function createArray(length) {
  var arr = new Array(length || 0),
    i = length;

  if (arguments.length > 1) {
    var args = Array.prototype.slice.call(arguments, 1);
    while(i--) arr[length-1 - i] = createArray.apply(this, args);
  }

  return arr;
}


// Create audo
let audio = new Audio();
audio.controls = true;
audio.autoplay = true;
audio.src = 'img/blue.mp3';
document.body.appendChild(audio);

// end of it

// audio context
var context = new AudioContext();
var analyser = context.createAnalyser();
analyser.fftSize = 128;
var frequencyData = new Uint8Array(analyser.frequencyBinCount);


// connecting analyze to mp3
window.onload = function() {
  var source = context.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(context.destination);
};
// end











let width = 1200;
let height = 600;
let cols = 60;
let rows = 30;
let swallowNumber = 7;
let debug = false;

let gwidth = width/cols;
let gheight = height/rows;
let particles = [];

let opts = {
  width: width,
  height: height,
  gwidth: gwidth,
  gheight: gheight,
  rows: rows,
  cols: cols
};

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);
ctx.font = '10px Arial';

let sky = document.getElementById('sky');
let swallow = document.getElementById('swallow');

let flowfield = createArray(cols,rows);

document.getElementById('debug').addEventListener('click',() => {
  debug = !debug;
});



for (var i = 0; i < swallowNumber; i++) {
  particles.push(
    new Particle(Math.random()*width,Math.random()*height)
  );
}





function render() {
  ctx.clearRect(0,0,width,height);
  ctx.drawImage(sky,0,0,width,height);

  analyser.getByteFrequencyData(frequencyData);

  console.log(frequencyData);

  let avg = frequencyData.reduce(function(accumulator, currentValue) {
    return accumulator + currentValue;
  });
  avg = avg/64;

  ctx.fillStyle = '#ff0000';
  ctx.fillRect(0,0,2,avg);



  for (var i = 0; i < cols; i++) {
  	for (var j = 0; j < rows; j++) {
  		ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  		// ctx.fillRect(i*gwidth,j*gheight,gwidth-1,gheight-1);
  		let flow = Perlin(i/400,j/400,time/400);
  		let alpha = 4*Math.PI * flow;
  		let posx = Math.cos(alpha)*gwidth;
  		let posy = Math.sin(alpha)*gheight;

  		flowfield[i][j] = [posx*avg/30,posy*avg/30];

  		if(debug) {
  			ctx.beginPath();
  			ctx.moveTo(i*gwidth,j*gheight);
  			ctx.lineTo(i*gwidth + posx ,j*gheight + posy);
  			ctx.closePath();
  			ctx.stroke();
  		}
  		

  		// ctx.fillColor = '#ffffff';
  		// ctx.fillText(flow,i*gwidth,j*gheight);
  	}
  }
  // console.log(flowfield);


  particles.forEach(p => {
  	p.wind(flowfield,opts);
  	p.move(opts);
  	p.draw(ctx,swallow);
  });
}


let time = 0;
function draw() {
  render();
  time++;
  window.requestAnimationFrame(draw);
}

draw();
