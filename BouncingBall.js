class BouncingBall {


	constructor(x, y, z, vx, vy, vz, d) {
		this.diameter = d;
		this.radius = d/2;
		this.x = x;
		this.y = y;
		this.z = z;
		this.speedx = vx;
		this.speedy = vy;
		this.speedz = vz;
		this.charge = 1;
	}


	move() {
		
		this.x += this.speedx;
		this.y += this.speedy;
		this.z += this.speedz;
		
		
	}


	show() {
		//fill(map(velocitymag,0,2*this.maxspeed,0,255), 0, map(velocitymag,0,2*this.maxspeed,255,0));
		//let alpha = map(this.z,0,boxdepth,0,255); 
		//fill(alpha,0,255-alpha);
		//strokeWeight(1);
		//stroke(0,0,0,0);
		//ellipse(this.x, this.y, this.diameter, this.diameter);

		translate(-boxwidth/2,-boxheight/2,-boxdepth/2);
		translate(this.x,this.y,this.z);
		fill(0,0,50);
		noStroke();
		sphere(this.diameter);
		translate(-this.x,-this.y,-this.z);
		translate(boxwidth/2,boxheight/2,boxdepth/2);
	}	



	wallcolission() {
		//bottom wall
		if (this.y > ybox + boxheight - this.radius) {
			this.y = ybox + boxheight - this.radius;
			this.speedy *= -1;
		}
		//top wall
		if (this.y < ybox + this.radius) {
			this.y = ybox + this.radius;
			this.speedy *= -1;
		}
		//right wall
		if (this.x > xbox + boxwidth - this.radius) {
			this.x = xbox + boxwidth - this.radius;
			this.speedx *= -1;
		}
		//left wall
		if (this.x < xbox + this.radius) {
			this.x = xbox + this.radius;
			this.speedx *= -1;
		}
		//front wall
		if (this.z > zbox + boxdepth - this.radius) {
			this.z = zbox + boxdepth - this.radius;
			this.speedz *= -1;
		}
		//back wall
		if (this.z < zbox + this.radius) {
			this.z = zbox + this.radius;
			this.speedz *= -1;
		}
	}


	ballcolission(otherball) {
		// calculate distance vector
		let dx = this.x - otherball.x;
		let dy = this.y - otherball.y;
		let dz = this.z - otherball.z;
		let d = Math.sqrt(dx*dx + dy*dy + dz*dz);

		if (d <= (this.radius + otherball.radius)){
			// speed on the line of colission 
			let vx1 = (dx*this.speedx+dy*this.speedy+dz*this.speedz)/pow(d,2)*dx;
			let vy1 = (dx*this.speedx+dy*this.speedy+dz*this.speedz)/pow(d,2)*dy;
			let vz1 = (dx*this.speedx+dy*this.speedy+dz*this.speedz)/pow(d,2)*dz
			let vx2 = (dx*otherball.speedx+dy*otherball.speedy+dz*otherball.speedz)/pow(d,2)*dx;
			let vy2 = (dx*otherball.speedx+dy*otherball.speedy+dz*otherball.speedz)/pow(d,2)*dy;
			let vz2 = (dx*otherball.speedx+dy*otherball.speedy+dz*otherball.speedz)/pow(d,2)*dz;

			// space them out, so they don't overlap
			let exsp = (this.radius+otherball.radius)-d;
			this.x += exsp/2*dx/d;
			this.y += exsp/2*dy/d; 
			this.z += exsp/2*dz/d;
			otherball.x -= exsp/2*dx/d;
			otherball.y -= exsp/2*dy/d;
			otherball.z -= exsp/2*dz/d;

			// swap speeds
			this.speedx += - vx1 + vx2;
			this.speedy += - vy1 + vy2;
			this.speedz += - vz1 + vz2;
			otherball.speedx += - vx2 + vx1;
			otherball.speedy += - vy2 + vy1;
			otherball.speedz += - vz2 + vz1;
		}
		// return (d < (this.radius + otherball.radius));
	}


	gravity() {
		this.speedy += 0.10;
	}


	friction() {
		let totalspeed = Math.sqrt(pow(this.speedx,2) + pow(this.speedy,2) + pow(this.speedy,2));
		let smallpercent = 0.8;
		let bigpercent = 0.8;

		if (totalspeed < 0.1) {
			this.speedx *= smallpercent;
			this.speedy *= smallpercent;
			this.speedz *= smallpercent;
		} else {
			this.speedx *= smallpercent;
			this.speedy *= smallpercent;
			this.speedz *= smallpercent;
		}
	}


	repulsion(otherball) {
		// calculate distance vector
		let dx = this.x - otherball.x;
		let dy = this.y - otherball.y;
		let dz = this.z - otherball.z;
		let d = Math.sqrt(dx*dx + dy*dy + dz*dz);

		//calculate force
		if (d>3*this.radius){
			this.speedx += this.charge*elforce*dx/pow(d,3);
			this.speedy += this.charge*elforce*dy/pow(d,3);
			this.speedz += this.charge*elforce*dz/pow(d,3);
		}
	}


	//selected(mx, my) {
	//	let distance = dist(mx, my, this.x, this.y);
	//	return (distance < this.diameter / 2);
	//}


	//rollover(mx, my) {
	//	let selectedball = false;
	//	let distance = dist(mx, my, this.x, this.y);
	//	if (distance < this.diameter / 2) {
	//  		this.green = 0;
	// 		this.blue = 255;
	//	}else{
	//  		this.green = 255;
	// 		this.blue = 255;
	//	}
	//}


}