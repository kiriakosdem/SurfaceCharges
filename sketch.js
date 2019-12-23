//screen dimensions
let fullscreenwidth = document.getElementById("jscode").clientWidth;//myscreen:1366;
let fullscreenheight = document.getElementById('jscode').clientHeight;//myscreen:657;
let animationwidth = fullscreenwidth;
let animationheight = fullscreenheight*0.72;

//
let boxwidth = 500;
let boxheight = 500;
let boxdepth = 500;
let xbox = 0;
let ybox = 0;
let zbox = 0;
let sphereDiameter = 300;
let conductor;

//animation variables
let pi = 3.1415;
let balls = [];
let Nparticles;
let forceStrength;
let forceCoefficient = 100*100*10;
let angle = 0;
let sensitivityZoom = 0.06;
let img;

//html elements
let mycanvas;
let sliderScale;
let sliderRotateX;
let sliderRotateY;
let sliderRotateZ;


function preload(){
	img = loadImage('images/lightning.png');
}


function setup() {
	//create html elements
	header = createElement('h2',"Φορτία σε Αγωγό");
	header.style('text-align','center');
	header.style('padding','10px');
	header.style('padding-bottom','0px');
	header.parent('jscode');

	par = createP('Τα φορτία σε έναν αγωγό καταλήγουν όλα στην επιφάνειά του!');
	par.style('padding-left','10px');
	par.parent('jscode');
	
	setAttributes('antialias', true);
	mycanvas = createCanvas(animationwidth, animationheight, WEBGL);
	mycanvas.parent("jscode");

	sliderParticles = createSlider(1, 300);
	sliderParticles.parent('jscode');
	sliderParticles.style('width', '200px');
	sliderParticles.style('margin','20px');
	sliderParticles.class('slider sliderNumber');

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
	
	
	camera(0,0,2.7*(height/2.0)/tan(PI*30.0/180.0),  0,0,0,  0,1,0);
	perspective(0.6);
	resetSketch();
}


function draw() {
	//set the scene
	background(0, 60, 70);
	ambientLight(255, 255, 255);
	//pointLight(255,255,255, 0,0,0);	
	orbitControl();
	//debugMode();
	rotateX(angle);
	rotateY(angle);
	rotateZ(angle);

	//create particles
	if (sliderParticles.value()!=balls.length){
		resetSketch();
	}

	for (var ind = 0; ind < balls.length; ind++) {
		// draw shapes
		balls[ind].show();

		// motion
		balls[ind].move();

		// check for colissions
		//balls[ind].boxcolission();
		balls[ind].spherecolission();
		for (let indother = 0; indother < ind; indother++) {
			balls[ind].ballcolission(balls[indother]);
		}

		// other forces
		//balls[ind].gravity();
		balls[ind].friction();
		for (let indother = 0; indother < balls.length; indother++) {
			if (indother!=ind){
				balls[ind].repulsion(balls[indother]);
			}	
		}
	}

	//draw box
	fill(72,45,20,100);
	stroke(18,11,5);
	strokeWeight(1);
	rectMode(CENTER);
	translate(xbox,ybox,zbox);
	//box(boxwidth,boxheight,boxdepth);
	translate(-xbox,-ybox,-zbox);
	//noStroke();
	conductor  = sphere(sphereDiameter);
	//torus(300,30,4,12);

	//angle += 0.0005;
}

function resetCamera(){
	camera(0,0,2.7*(height/2.0)/tan(PI*30.0/180.0),  0,0,0,  0,1,0);
	angle = 0;
}


function resetSketch() {
	//delete previous particles
	balls = [];
	Nparticles = sliderParticles.value();
	forceStrength = forceCoefficient/Nparticles;

	//create new particles
	let ip;
	let ip2;
	for (ip=0; ip<Nparticles; ip++){

		let diameter = boxwidth/50;
		let radius = diameter/2;
		let x = xbox + random(-boxwidth/2 + radius, boxwidth/2-radius);
		let y = ybox + random(-boxheight/2 + radius, boxheight/2-radius);
		let z = zbox + random(-boxdepth/2 + radius, boxdepth/2-radius);

//		if (ip>0){
//			valid = false;
//			while (valid==false){
//				x = random(radius,boxwidth-radius);
//				y = random(radius,boxwidth-radius);
//				z = random(radius,boxwidth-radius);
//				overlap = false;
//				for (ip2=0; ip2<balls.length; ip2++){
//					dist = Math.sqrt(pow((x-balls[ip2].x),2)+pow((y-balls[ip2].y),2)+pow((z-balls[ip2].z),2))
//					if (dist<=diameter){
//						overlap = true;
//					}
//				}
//				if (overlap == false){
//					valid = true;
//				}
//			}
//		}

		let velocity = 10;
		let vx = random(-velocity, velocity)/Math.sqrt(3);
		let vy = random(-velocity, velocity)/Math.sqrt(3);
		let vz = random(-velocity, velocity)/Math.sqrt(3);

		balls.push(new BouncingBall(x,y,z,vx,vy,vz,diameter));
	}
}


