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
		if ((vx*vx + vy*vy + vz*vz)==0){
			this.charge = 1;
		} else {
			this.charge = -1;
		}
	}


	move() {
		this.x += this.speedx;
		this.y += this.speedy;
		this.z += this.speedz;
	}


	show() {
		let speed=Math.sqrt(this.speedx*this.speedx+this.speedy*this.speedy+this.speedz*this.speedz); 
		translate(this.x,this.y,this.z);
		//fill(0,0,50);
		if (this.charge==-1){
			specularMaterial(0,0,100);
		}else{
			specularMaterial(100,0,0);
		}

		noStroke();
		sphere(this.radius);
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

			this.speedx *=  colissionElasticity;
			this.speedy *=  colissionElasticity;
			this.speedz *=  colissionElasticity;
		}
	}

	cylinderColission(){
		//distance from center in yz plane
		let d = Math.sqrt(this.y*this.y + this.z*this.z);
		//radial velocity in yz plane
		let rv = this.y*this.speedy/d + this.z*this.speedz/d;
		//side of cylinder
		if (d> cylinderDiameter - this.radius){
			//move back into the cylinder
			let exsp = d - cylinderDiameter + this.radius;
			this.y -= exsp*this.y/d;
			this.z -= exsp*this.z/d;

			//reverse radial velocity
			this.speedy -= 2*rv*this.y/d;
			this.speedz -= 2*rv*this.z/d;

			this.speedx *=  colissionElasticity;
			this.speedy *=  colissionElasticity;
			this.speedz *=  colissionElasticity;
		}
		//bottom cap
		if (this.x > x0 + cylinderHeight/2 - this.radius) {
			this.x = x0 + cylinderHeight/2 - this.radius;
			this.speedx *= -1;

			this.speedx *=  colissionElasticity;
			this.speedy *=  colissionElasticity;
			this.speedz *=  colissionElasticity;
		}
		//top cap
		if (this.x < x0 - cylinderHeight/2 + this.radius) {
			this.x = x0 - cylinderHeight/2 + this.radius;
			this.speedx *= -1;

			this.speedx *=  colissionElasticity;
			this.speedy *=  colissionElasticity;
			this.speedz *=  colissionElasticity;
		}


	}


	boxcolission() {
		//bottom wall
		if (this.y > y0 + boxheight/2 - this.radius) {
			this.y = y0 + boxheight/2 - this.radius;
			this.speedy *= -1;
			this.speedx *=  colissionElasticity;
			this.speedy *=  colissionElasticity;
			this.speedz *=  colissionElasticity;
		}
		//top wall
		if (this.y < y0 - boxheight/2 + this.radius) {
			this.y = y0 - boxheight/2 + this.radius;
			this.speedy *= -1;
			this.speedx *=  colissionElasticity;
			this.speedy *=  colissionElasticity;
			this.speedz *=  colissionElasticity;
		}
		//right wall
		if (this.x > x0 + boxwidth/2 - this.radius) {
			this.x = x0 + boxwidth/2 - this.radius;
			this.speedx *= -1;
			this.speedx *=  colissionElasticity;
			this.speedy *=  colissionElasticity;
			this.speedz *=  colissionElasticity;
		}
		//left wall
		if (this.x < x0 - boxwidth/2 + this.radius) {
			this.x = x0 - boxwidth/2 + this.radius;
			this.speedx *= -1;
			this.speedx *=  colissionElasticity;
			this.speedy *=  colissionElasticity;
			this.speedz *=  colissionElasticity;
		}
		//front wall
		if (this.z > z0 + boxdepth/2 - this.radius) {
			this.z = z0 + boxdepth/2 - this.radius;
			this.speedz *= -1;
			this.speedx *=  colissionElasticity;
			this.speedy *=  colissionElasticity;
			this.speedz *=  colissionElasticity;
		}
		//back wall
		if (this.z < z0 - boxdepth/2 + this.radius) {
			this.z = z0 - boxdepth/2 + this.radius;
			this.speedz *= -1;
			this.speedx *=  colissionElasticity;
			this.speedy *=  colissionElasticity;
			this.speedz *=  colissionElasticity;
		}


	}


	staticcolission(otherball) {
		// calculate distance vector
		let dx = this.x - otherball.x;
		let dy = this.y - otherball.y;
		let dz = this.z - otherball.z;
		let d = Math.sqrt(dx*dx + dy*dy + dz*dz);

		if (d <= (this.radius + otherball.radius)){
			// speed on the line of colission 
			let vx1 = (dx*this.speedx+dy*this.speedy+dz*this.speedz)/pow(d,2)*dx;
			let vy1 = (dx*this.speedx+dy*this.speedy+dz*this.speedz)/pow(d,2)*dy;
			let vz1 = (dx*this.speedx+dy*this.speedy+dz*this.speedz)/pow(d,2)*dz;


			// space them out, so they don't overlap
			let exsp = (this.radius+otherball.radius)-d;
			//print(d);
			this.x += exsp/2*dx/d;
			this.y += exsp/2*dy/d; 
			this.z += exsp/2*dz/d;

			// invert speed
			this.speedx +=  -2*vx1;
			this.speedy +=  -2*vy1;
			this.speedz +=  -2*vz1;

			this.speedx *= colissionElasticity/10;
			this.speedy *= colissionElasticity/10;
			this.speedz *= colissionElasticity/10;

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
			let vz1 = (dx*this.speedx+dy*this.speedy+dz*this.speedz)/pow(d,2)*dz;
			let vx2 = (dx*otherball.speedx+dy*otherball.speedy+dz*otherball.speedz)/pow(d,2)*dx;
			let vy2 = (dx*otherball.speedx+dy*otherball.speedy+dz*otherball.speedz)/pow(d,2)*dy;
			let vz2 = (dx*otherball.speedx+dy*otherball.speedy+dz*otherball.speedz)/pow(d,2)*dz;

			// space them out, so they don't overlap
			let exsp = (this.radius+otherball.radius)-d;
			this.x += exsp*dx/d;
			this.y += exsp*dy/d; 
			this.z += exsp*dz/d;
			otherball.x -= exsp*dx/d;
			otherball.y -= exsp*dy/d;
			otherball.z -= exsp*dz/d;

			// swap speeds
			this.speedx += - vx1 + vx2;
			this.speedy += - vy1 + vy2;
			this.speedz += - vz1 + vz2;
			otherball.speedx += - vx2 + vx1;
			otherball.speedy += - vy2 + vy1;
			otherball.speedz += - vz2 + vz1;

			this.speedx *=  colissionElasticity;
			this.speedy *=  colissionElasticity;
			this.speedz *=  colissionElasticity;
		}
		// return (d < (this.radius + otherball.radius));
	}


	potential() {
		this.speedx += voltageStrength;
	}


	friction() {
		this.speedx *= frictionCoefficient;
		this.speedy *= frictionCoefficient;
		this.speedz *= frictionCoefficient;
	}

	speedCheck(){
		let speed=Math.sqrt(this.speedx*this.speedx+this.speedy*this.speedy+this.speedz*this.speedz);
		if (speed>speedlimit){
			this.speedx *= speedlimit/speed;
			this.speedy *= speedlimit/speed;
			this.speedz *= speedlimit/speed;
		}
	}


	repulsion(otherball) {
		// calculate distance vector
		let dx = this.x - otherball.x;
		let dy = this.y - otherball.y;
		let dz = this.z - otherball.z;
		let d = Math.sqrt(dx*dx + dy*dy + dz*dz);

		//calculate force
		if (d>=(this.radius+otherball.radius)){
			this.speedx += forceStrength*this.charge*otherball.charge*dx/pow(d,3);
			this.speedy += forceStrength*this.charge*otherball.charge*dy/pow(d,3);
			this.speedz += forceStrength*this.charge*otherball.charge*dz/pow(d,3);
		}
	}

}