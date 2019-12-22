let fullscreenwidth = document.getElementById("jscode").clientWidth;//myscreen:1366;
let fullscreenheight = document.getElementById('jscode').clientHeight;//myscreen:657;
let animationwidth = fullscreenwidth;
let animationheight = fullscreenheight*0.75;

let boxwidth = 300;
let boxheight = 300;
let boxdepth = 300;
let xbox = 0;
let ybox = 0;
let zbox = 0;

let balls = [];
let Nparticles = 100;
let pi = 3.1415;
let angle = 0;
let elforce = 100000/Nparticles;

let mycanvas;
let sliderScale;
let sliderRotateX;
let sliderRotateY;
let sliderRotateZ;

function setup() {
	//create html elements
	p1 = createP('Το φορτία σε έναν αγωγό καταλήγουν όλα στην επιφάνειά του!');
	p1.style('padding','20px');
	p1.parent("jscode");

	mycanvas = createCanvas(animationwidth, animationheight, WEBGL);
	mycanvas.parent("jscode");

	sliderScale = createSlider(0.2, 0.8, 0.7, 0.01);
	sliderScale.parent('jscode');
	sliderScale.style('width', '200px');
	sliderScale.style('margin','20px');
	sliderScale.class('slider sliderScale');

	sliderRotateX = createSlider(-pi, pi, -0.4, 0.01);
	sliderRotateX.parent('jscode');
	sliderRotateX.style('width', '200px');
	sliderRotateX.style('margin','20px');
	sliderRotateX.class('slider sliderRotate');

	sliderRotateY = createSlider(-pi, pi, 0.5, 0.01);
	sliderRotateY.parent('jscode');
	sliderRotateY.style('width', '200px');
	sliderRotateY.style('margin','20px');
	sliderRotateY.class('slider sliderRotate');

	sliderRotateZ = createSlider(-pi, pi, 0, 0.01);
	sliderRotateZ.parent('jscode');
	sliderRotateZ.style('width', '200px');
	sliderRotateZ.style('margin','20px');
	sliderRotateZ.class('slider sliderRotate');
	
	sliderParticles = createSlider(1, 200);
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
	
	resetSketch();
}


function draw() {
	background(40, 40, 40);

	scale(sliderScale.value());
	rotateX(angle + sliderRotateX.value());
	rotateY(angle + sliderRotateY.value());
	rotateZ(angle + sliderRotateZ.value());

	for (var ind = 0; ind < balls.length; ind++) {
		// draw shapes
		balls[ind].show();

		// motion
		balls[ind].move();

		// check for colissions
		balls[ind].wallcolission();
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

		// interactivity
		//balls[ind].rollover(mouseX,mouseY);
	}


	fill(72,45,20,200);
	stroke(0,0,0);
	box(boxwidth,boxheight,boxdepth);


	angle += 0.001;
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

//function mousePressed() {
//	let selection = false;
//	let selectionindex = 0;
//
//	if (mouseX>=0 && mouseX<=fullscreenwidth && mouseY>=0 && mouseY<=fullscreenheight){
//		//check where the click was
//		for (ind = 0; ind < balls.length; ind++) {
//			if (balls[ind].selected(mouseX, mouseY)) {
//				selection = true;
//				selectionindex = ind;
//			}
//		}
//
//		//if you click on ball remove it, otherwise create new
//		if (selection == true) {
//			balls.splice(selectionindex, 1);
//		}else {
//			balls.push(new BouncingBall(mouseX, mouseY,1,10));
//		}
//	}
//
//}


//function mouseDragged() {
//    balls.push(new BilliardBall(mouseX, mouseY));
//}
