//screen dimensions
let fullscreenwidth = document.getElementById("jscode").clientWidth;//myscreen:1366;
let fullscreenheight = document.getElementById('jscode').clientHeight;//myscreen:657;
let animationwidth = fullscreenwidth;
let animationheight = fullscreenheight*0.72;
let sensitivityZoom = 0.06;
let perspectiveScale = 0.8;

//animation parameters (change at your own risk)
let pi = 3.1415;
let forceStrength;
let forceCoefficient = 100000;
let frictionCoefficient = 1;
let voltageStrength = 0.8;
let voltageActive = false;
let colissionElasticity = 0.9;

//electrons
let particles = [];
let atoms = [];
let particlesNumber;
let atomsNumber;
let particleRadius = animationheight/100;
let particleDiameter = particleRadius*2;
let atomRadius = particleRadius*1;
let atomDiameter = atomRadius*2;
let velocity = 20;
let speedlimit = 20;
	
//conductor 
let boxwidth = 700;
let boxheight = 400;
let boxdepth = 300;
let sphereDiameter = 300;
let cylinderHeight = 800;
let cylinderDiameter = 150;
let x0 = 0;
let y0 = 0;
let z0 = 0;
let shape = 1;

//html elements
let mycanvas;
let sliderScale;
let sliderRotateX;
let sliderRotateY;
let sliderRotateZ;



function setup() {
	//create html elements
	header = createElement('h2',"Φορτία σε Αγωγό");
	header.style('text-align','center');
	header.style('padding','10px');
	header.style('padding-bottom','0px');
	header.parent('jscode');

	par = createP('Τα επιπλέον φορτία σε έναν αγωγό καταλήγουν όλα στην επιφάνειά του κι αν βρεθούν σε κάποιο ηλεκτρικό πεδίο ανακατανέμονται ώστε να το εξουδετερώσουν!');
	par.style('padding-left','10px');
	par.parent('jscode');

	setAttributes('antialias', true);
	mycanvas = createCanvas(animationwidth, animationheight, WEBGL);
	mycanvas.parent("jscode");

	sliderParticles = createSlider(1, 300, 50);
	sliderParticles.parent('jscode');
	sliderParticles.style('width', '250px');
	sliderParticles.style('margin','20px');
	sliderParticles.class('slider sliderNumber');
	
	labelParticles = createElement('label','Αριθμός Φορτίων: ');
	labelParticles.parent('jscode');
	labelParticles.position(sliderParticles.position().x,sliderParticles.position().y+1.5*sliderParticles.height);
//	
//	sliderAtoms = createSlider(0, 300,0);
//	sliderAtoms.parent('jscode');
//	sliderAtoms.style('width', '250px');
//	sliderAtoms.style('margin','20px');
//	sliderAtoms.class('slider sliderNumber');
//	
//	labelAtoms = createElement('label','Αριθμός Ατόμων: ');
//	labelAtoms.parent('jscode');
//	labelAtoms.position(sliderAtoms.position().x,sliderAtoms.position().y+1.5*sliderAtoms.height);

	buttonReset = createButton("Επαναφορά Φορτίων");
	buttonReset.parent("jscode");
	buttonReset.style('width', '150px');
	buttonReset.style('margin','20px');
	buttonReset.class('mybutton');
	buttonReset.mousePressed(resetSketch);

	buttonResetCam = createButton("Επαναφορά Κάμερας");
	buttonResetCam.parent("jscode");
	buttonResetCam.style('width', '150px');
	buttonResetCam.style('margin','20px');
	buttonResetCam.class('mybutton');
	buttonResetCam.mousePressed(resetCamera);

	buttonChangeShape = createButton("Άλλαξε Σχήμα");
	buttonChangeShape.parent("jscode");
	buttonChangeShape.style('width', '120px');
	buttonChangeShape.style('margin','20px');
	buttonChangeShape.class('mybutton');
	buttonChangeShape.mousePressed(nextShape);
	
	buttonPotential = createButton("Εφαρμογή Τάσης");
	buttonPotential.parent("jscode");
	buttonPotential.style('width', '130px');
	buttonPotential.style('margin','20px');
	buttonPotential.class('mybutton');
	buttonPotential.mousePressed(toggleVoltage);


	camera(0,0,2*(height/2.0)/tan(PI*30.0/180.0),  0,0,0,  0,1,0);
	perspective(perspectiveScale);
	resetSketch();
}


function draw() {
	//set the scene
	background(0, 60, 70);
	ambientLight(255, 255, 255);
	pointLight(255,255,255, 0,0,0);	
	orbitControl();
	//debugMode();
	//sphere(10,10);
	
	//create particles if needed
	if (sliderParticles.value()!=particles.length){
		resetSketch();
	}
//	if (sliderAtoms.value()!=atoms.length){
//		resetSketch();
//	}
	
	//show and move 
	for (var ind = 0; ind < particles.length; ind++) {
		particles[ind].show();
		particles[ind].move();
	}
	for (var ind = 0; ind < atoms.length; ind++){
		atoms[ind].show();
		atoms[ind].move();
	}
	
	//calculate forces
	for (var ind = 0; ind < particles.length; ind++) {
		
		//colissions with conductor walls
		if (shape == 1){
			particles[ind].boxcolission();
		} else if (shape == 2){
			particles[ind].spherecolission();
		} else if (shape >= 3){
			particles[ind].cylinderColission();
		}
		
		
		//first, repulsion between balls
		for (let indother = 0; indother <particles.length; indother++) {
			if (indother!=ind){
				particles[ind].repulsion(particles[indother]);
			}	
		}
		//next, attraction between balls and atoms
		for (let indother = 0; indother < atoms.length; indother++) {	
			particles[ind].repulsion(atoms[indother]);
		}
		
		
		//next, colission between balls
		for (let indother = 0; indother < ind; indother++) {
			particles[ind].ballcolission(particles[indother]);
		}
		//colission between balls and atoms
		for (let indother = 0; indother < atoms.length; indother++) {
			particles[ind].staticcolission(atoms[indother]);
		}
		
		
		//other forces
		particles[ind].friction();
		if (voltageActive){
			particles[ind].potential();
		}	
		
		//last, speed check
		particles[ind].speedCheck();
	}

	//draw conductor
	fill(72,45,20,100);
	stroke(18,11,5);
	strokeWeight(1);
	
	translate(x0,y0,z0);
	if (shape == 1){	
		box(boxwidth,boxheight,boxdepth);
	} else if (shape == 2){
		sphere(sphereDiameter);
	} else if (shape == 3){
		push();
		rotateZ(PI/2);
		cylinder(cylinderDiameter,cylinderHeight);
		pop();
	}
	translate(-x0,-y0,-z0);

}

function nextShape() {
	shape += 1;
	if (shape > 3){
		shape = 1;
	}
	if (shape==1){
		buttonChangeShape.html('Κουτί');
	}else if (shape == 2){
		buttonChangeShape.html('Σφαίρα');
	}else if (shape ==3){
		buttonChangeShape.html('Κύλινδρος');
	}
}

function toggleVoltage(){
	voltageActive = !voltageActive;
	if (voltageActive){
		buttonPotential.html("Τάση: On");
	} else {
		buttonPotential.html("Τάση: Off");
	}
}


function resetCamera(){
	camera(0,0,2*(height/2.0)/tan(PI*30.0/180.0),  0,0,0,  0,1,0);
}


function resetSketch() {
	//delete previous particles
	particles = [];
	atoms = [];
	particlesNumber = sliderParticles.value();
	//atomsNumber = sliderAtoms.value();;
	atomsNumber = 0 ;
	labelParticles.html("Αριθμός Φορτίων: " + particlesNumber);
	//labelAtoms.html("Αριθμός Ατόμων: " + atomsNumber);
	
	forceStrength = forceCoefficient/particlesNumber;

	//create new particles
	for (let ip=0; ip<particlesNumber; ip++){	
		let x = x0 + random(-boxwidth/2 + particleRadius, boxwidth/2-particleRadius);
		let y = y0 + random(-boxheight/2 + particleRadius, boxheight/2-particleRadius);
		let z = z0 + random(-boxdepth/2 + particleRadius, boxdepth/2-particleRadius);	
		let vx = random(-velocity, velocity)/Math.sqrt(3);
		let vy = random(-velocity, velocity)/Math.sqrt(3);
		let vz = random(-velocity, velocity)/Math.sqrt(3);
		particles.push(new BouncingBall(x,y,z,vx,vy,vz,particleDiameter));
	}
	
	//create atoms
	for (let ip=0; ip<atomsNumber; ip++){	
		let x = x0 + random(-cylinderHeight/2 + atomRadius, cylinderHeight/2-atomRadius);
		let y = y0 + random(-cylinderDiameter + atomRadius, cylinderDiameter-atomRadius);
		let z = z0 + random(-cylinderDiameter + atomRadius, cylinderDiameter-atomRadius);	
		let vx = 0;
		let vy = 0;
		let vz = 0;
		atoms.push(new BouncingBall(x,y,z,vx,vy,vz,atomDiameter));
	}
}


