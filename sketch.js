let fullscreenwidth = document.getElementById("jscode").clientWidth;//myscreen:1366;
let fullscreenheight = document.getElementById('jscode').clientHeight;//myscreen:657;
let animationwidth = fullscreenwidth;
let animationheight = fullscreenheight*0.72;

let boxwidth =500;
let boxheight = 500;
let boxdepth = 500;
let xbox = 0;
let ybox = 0;
let zbox = 0;

let balls = [];
let Nparticles = 100;
let pi = 3.1415;
let angle = 0;
let anglerl = 0;
let angletb = 0;
let elforce = 10000/Nparticles;
let zoom = 1;
let sensitivityZoom = 0.06;

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

	par = createP('Τα φορτία σε έναν αγωγό καταλήγουν όλα στην επιφάνειά του!');
	par.style('padding-left','10px');
	par.parent('jscode');

	mycanvas = createCanvas(animationwidth, animationheight, WEBGL);
	mycanvas.parent("jscode");

//	sliderScale = createSlider(0, 0.99, 0, 0.01);
//	sliderScale.parent('jscode');
//	sliderScale.style('width', '200px');
//	sliderScale.style('margin','20px');
//	sliderScale.class('slider sliderScale');
//
//	sliderRotateX = createSlider(-pi/2, pi/2, -0.4, 0.01);
//	sliderRotateX.parent('jscode');
//	sliderRotateX.style('width', '200px');
//	sliderRotateX.style('margin','20px');
//	sliderRotateX.class('slider sliderRotate');
//
//	sliderRotateY = createSlider(-pi/2, pi/2, 0.5, 0.01);
//	sliderRotateY.parent('jscode');
//	sliderRotateY.style('width', '200px');
//	sliderRotateY.style('margin','20px');
//	sliderRotateY.class('slider sliderRotate');
//
//	sliderRotateZ = createSlider(-pi/2, pi/2, 0, 0.01);
//	sliderRotateZ.parent('jscode');
//	sliderRotateZ.style('width', '200px');
//	sliderRotateZ.style('margin','20px');
//	sliderRotateZ.class('slider sliderRotate');

	sliderParticles = createSlider(1, 300);
	sliderParticles.parent('jscode');
	sliderParticles.style('width', '200px');
	sliderParticles.style('margin','20px');
	sliderParticles.class('slider sliderNumber');

	buttonReset = createButton("Επαναφορά");
	buttonReset.parent("jscode");
	buttonReset.style('width', '100px');
	buttonReset.style('margin','20px');
	buttonReset.class('mybutton');
	buttonReset.mousePressed(resetSketch);
	
	buttonResetCam = createButton("Επαναφορά Κάμερας");
	buttonResetCam.parent("jscode");
	buttonResetCam.style('width', '150px');
	buttonResetCam.style('margin','20px');
	buttonResetCam.class('mybutton');
	buttonResetCam.mousePressed(resetCamera);
	
	camera(0,0,2*(height/2.0)/tan(PI*30.0/180.0),  0,0,0,  0,1,0);
	resetSketch();
}


function draw() {
	
	//set the scene
	background(0, 60, 70);
	lights();
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
		balls[ind].boxcolission();
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
	box(boxwidth,boxheight,boxdepth);


	angle += 0.0005;
}

function resetCamera(){
	camera(0,0,2*(height/2.0)/tan(PI*30.0/180.0),  0,0,0,  0,1,0);
	angle = 0;
}


function resetSketch() {
	//delete previous particles
	balls = [];
	Nparticles = sliderParticles.value();
	elforce = 100000/Nparticles;

	//create new particles
	let ip;
	let ip2;
	for (ip=0; ip<Nparticles; ip++){

		let diameter = boxwidth/50;
		let radius = diameter/2;
		let x = random(radius,boxwidth-radius);
		let y = random(radius,boxheight-radius);
		let z = random(radius,boxdepth-radius);

		if (ip>0){
			valid = false;
			while (valid==false){
				x = random(radius,boxwidth-radius);
				y = random(radius,boxheight-radius);
				z = random(radius,boxdepth-radius);
				overlap = false;
				for (ip2=0; ip2<balls.length; ip2++){
					dist = Math.sqrt(pow((x-balls[ip2].x),2)+pow((y-balls[ip2].y),2)+pow((z-balls[ip2].z),2))
					if (dist<=diameter){
						overlap = true;
					}
				}
				if (overlap == false){
					valid = true;
				}
			}
		}

		let velocity = 10;
		let vx = random(-velocity, velocity)/Math.sqrt(3);
		let vy = random(-velocity, velocity)/Math.sqrt(3);
		let vz = random(-velocity, velocity)/Math.sqrt(3);

		balls.push(new BouncingBall(x,y,z,vx,vy,vz,diameter));
	}
}


