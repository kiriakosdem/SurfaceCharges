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
		//2D
		//fill(map(velocitymag,0,2*this.maxspeed,0,255), 0, map(velocitymag,0,2*this.maxspeed,255,0));
		//let alpha = map(this.z,0,boxdepth,0,255); 
		//fill(alpha,0,255-alpha);
		//strokeWeight(1);
		//stroke(0,0,0,0);
		//ellipse(this.x, this.y, this.diameter, this.diameter);
		
		//3D 
		translate(this.x,this.y,this.z);
		//fill(0,0,50);
		specularMaterial(0,0,100);
		noStroke();
		let conductor = sphere(this.diameter);
		translate(-this.x,-this.y,-this.z);
	}	

	spherecolission() {
		//distance from center
		let d = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
		//radial velocity
		let rv = this.x*this.speedx/d + this.y*this.speedy/d + this.z*this.speedz/d;
		
		if (d> sphereDiameter - this.radius){
			//move back into the sphere
			let exsp = d - sphereDiameter + this.radius;
			this.x -= exsp*this.x/d;
			this.y -= exsp*this.y/d;
			this.z -= exsp*this.z/d;
			
			//reverse radial velocity
			this.speedx -= 2*rv*this.x/d;
			this.speedy -= 2*rv*this.y/d;
			this.speedz -= 2*rv*this.z/d;
		}
	}

	boxcolission() {
		//bottom wall
		if (this.y > ybox + boxheight/2 - this.radius) {
			this.y = ybox + boxheight/2 - this.radius;
			this.speedy *= -1;
		}
		//top wall
		if (this.y < ybox - boxheight/2 + this.radius) {
			this.y = ybox - boxheight/2 + this.radius;
			this.speedy *= -1;
		}
		//right wall
		if (this.x > xbox + boxwidth/2 - this.radius) {
			this.x = xbox + boxwidth/2 - this.radius;
			this.speedx *= -1;
		}
		//left wall
		if (this.x < xbox - boxwidth/2 + this.radius) {
			this.x = xbox - boxwidth/2 + this.radius;
			this.speedx *= -1;
		}
		//front wall
		if (this.z > zbox + boxdepth/2 - this.radius) {
			this.z = zbox + boxdepth/2 - this.radius;
			this.speedz *= -1;
		}
		//back wall
		if (this.z < zbox - boxdepth/2 + this.radius) {
			this.z = zbox - boxdepth/2 + this.radius;
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
		let smallspeed = 0.99;
		let bigspeed = 0.95;

		if (totalspeed < 0.1) {
			this.speedx *= smallspeed;
			this.speedy *= smallspeed;
			this.speedz *= smallspeed;
		} else {
			this.speedx *= bigspeed;
			this.speedy *= bigspeed;
			this.speedz *= bigspeed;
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
			this.speedx += this.charge*forceStrength*dx/pow(d,3);
			this.speedy += this.charge*forceStrength*dy/pow(d,3);
			this.speedz += this.charge*forceStrength*dz/pow(d,3);
		}
	}

}