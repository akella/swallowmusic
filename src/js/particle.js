export default class Particle {
  constructor(x,y,vx,vy) {
    this.x = x;
    this.y = y;
    this.vx = vx || 0;
    this.vy = vy || 0;
    this.ax = 0;
    this.ay = 0;

    this.oldx = 0;
    this.oldy = 0;
    this.friction = 0.3 + 0.5*Math.random();
    this.scale = 1 - 0.5*Math.random();
  }

  wind(flowfield,opts) {
  	let coordx = Math.floor(this.x/opts.gwidth);
  	let coordy = Math.floor(this.y/opts.gheight);

  	if(coordx === opts.cols) coordx = opts.cols - 1;
  	if(coordy === opts.rows) coordy = opts.rows - 1;
  	console.log(coordx,coordy);
  	this.ax = 0.03*flowfield[coordx][coordy][0];
  	this.ay = 0.03*flowfield[coordx][coordy][1];
  }
  clamp(a,b,c) {
  	return Math.max(b,Math.min(c,a));
  }
  move(opts) {
  	this.oldx = this.x;
  	this.oldy = this.y;

  	this.vx += this.ax;
  	this.vy += this.ay;

  	this.x += this.vx;
  	this.y += this.vy;

  	this.ax = 0;
  	this.ay = 0;

  	

  	if(this.x>opts.width) { this.x = 0;}
  	if(this.x<0) { this.x = opts.width;}

  	if(this.y>opts.height) { this.y = 0;}
  	if(this.y<0) { this.y = opts.height;}

  	this.vx = this.clamp(this.vx,-4,4);
  	this.vy = this.clamp(this.vy,-4,4);

  	this.vx *= this.friction;
  	this.vy *= this.friction;
  }

  draw(ctx,swallow) {
  	ctx.save();
  	ctx.translate(this.x,this.y);
  	let angle = Math.atan2(this.y - this.oldy,this.x-this.oldx);
  	ctx.rotate(angle);
  	ctx.translate(-7,-7);
  	ctx.drawImage(swallow,0,0,12*this.scale,12*this.scale);
  	ctx.restore();
  }
}
