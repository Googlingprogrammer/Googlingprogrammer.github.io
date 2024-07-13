//code referenced Platformer | p5play by Quinton Ashley: 
//https://openprocessing.org/sketch/1869796
//assets by Quinton Ashley

let player,enemy,heart,floor,platform;
let floorImg,brickImg,spikeImg,dspikeImg,doorImg,charactersImg,mailImg,backgroundImg;

let paused = false;
let died = false;

let spawnx = 350;
let spawny = 300;
let pltmove = 5;
let cameraY = 0;
let dampening =0.1;

function preload(){
	floorImg = loadImage('assets/grass.png');
	brickImg = loadImage('assets/brick.png');
	spikeImg = loadImage('assets/spike.png');
	dspikeImg = loadImage('assets/d_spike.png');
	doorImg = loadImage('assets/door.png');
	mailImg= loadImage('assets/mailbox.png');
	charactersImg = loadImage('assets/characters.png');
	backgroundImg = loadImage('assets/background.jpg');
}

function setup() {
  var canvas = createCanvas(600, 320, 'pixelated');
  canvas.parent('game-wrapper');
	world.gravity.y = 10;
	allSprites.pixelPerfect = true;
	
	floor = new Group();
	floor.layer = 0; //background
	floor.collider = 's';//static collider
	floor.img = floorImg;
	floor.tile = 'f';
	
	brick = new Group();
	brick.layer = 1;
	brick.collider = 's';
	brick.img = brickImg;
	brick.tile = 'b';
	
	platform = new Group();
	platform.layer = -1;
	platform.collider = 'k';
	platform.color = 'green';
	platform.tile = 'p';
	platform.h = 8;
	platform.w = 16;
	
	spike = new Group();
	spike.layer = 1;
	spike.collider = 's';
	spikeImg.resize(16,16);
	spike.img = spikeImg;
	spike.tile = 's';
	spike.h = 8;
	spike.w = 7;
	
	dspike = new Group();
	dspike.layer = 1;
	dspike.collider = 's';
	dspikeImg.resize(16,16);
	dspike.img = dspikeImg;
	dspike.tile = 'd';
	dspike.h = 14;
	dspike.w = 7;
	
	dspikemov = new Group();
	dspikemov.layer = 1;
	dspikemov.collider = 's';
	dspikemov.img = dspikeImg;
	dspikemov.tile = 'D';
    dspikemov.h = 8;
	dspikemov.w = 7;
	dspikemov.collider ='k';
	dspikemov.x = -99999;
	dspikemov.tile = 'D';
	
	mailbox = new Sprite();
	mailbox.x = -99999;
	mailbox.collider = 's';
	mailbox.w = 16;
	mailbox.h = 32;
	mailImg.resize(16,32);
	mailbox.img = mailImg;
	mailbox.tile = 'm';
	mailbox.overlaps(allSprites);
	mailbox.layer = -1;
	
	door = new Group();
	door.layer = -1;
	door.collider='s';
	doorImg.resize(16,32);
	door.img = doorImg;
	door.h = 32;
	door.w = 16;
	door.overlaps(allSprites);
	
	door1 = new door.Sprite();
	door1.x = -99999;
	door1.tile = '1';
	
	door2 = new door.Sprite();
	door2.x = -99999;
	door2.tile = '2';
	
	textbox = new Group();
	textbox.layer = 1;
	textbox.w = 16;
	textbox.h = 16;
	textbox.collider = 's';
	textbox.overlaps(allSprites);
	textbox.color = color(0,0,0,0);
	textbox.textColor = 'rgb(255,141,48)';
	textbox.textSize = 15;
	
	text_a = new textbox.Sprite();
	text_a.x = -99999;
	text_a.text = 'A';
	text_a.tile = '!';
	
	text_w = new textbox.Sprite();
	text_w.x = -99999;
	text_w.text = 'W';
	text_w.tile = '@';
	
	text_s = new textbox.Sprite();
	text_s.x = -99999;
	text_s.text = 'S';
	text_s.tile = '#';
	
	text_d = new textbox.Sprite();
	text_d.x = -99999;
	text_d.text = 'D';
	text_d.tile = '$';
	
	text_AM = new textbox.Sprite();
	text_AM.text ="< ABOUT ME";
	text_AM.tile ='<';
	
	text_W = new textbox.Sprite();
	text_W.text =" WORKS >";
	text_W.tile ='>';
	
	text_j = new Group();
	text_j.layer = 1;
	text_j.w = 16;
	text_j.h = 16;
	text_j.collider = 's';
	text_j.overlaps(allSprites);
	text_j.color = color(0,0,0,0);
	text_j.textColor = 'rgb(255,141,48)';
	text_j.textSize = 15;
	text_j.text = 'J';
	text_j.tile = 'j';
	
	text_v = new Group();
	text_v.layer = 1;
	text_v.w = 16;
	text_v.h = 16;
	text_v.overlaps(allSprites);
	text_v.color = color(0,0,0,0);
	text_v.textColor = 'rgb(255,141,48)';
	text_v.collider = 'k';
	text_v.text = 'V';
	text_v.tile = 'v';
	text_v.textSize = 10;
	
	pauseicon = new Sprite(15,15,30);
	pauseicon.color = color(0,0,0,0);//transparent
	pauseicon.textColor = 'white';
	pauseicon.textSize = 40;
	pauseicon.text = '>';
	pauseicon.collider = 's';
	pauseicon.overlaps(allSprites);
	
	pausemsg = new Sprite(0,0,0);
	pausemsg.color = color(0,0,0,0);
	pausemsg.textColor = 'white';
	pausemsg.textSize = 15;
	pausemsg.text = "Press p to unpause";
	pausemsg.collider = 's' ;
	pausemsg.overlaps(allSprites);
	
	new Tiles( //level tile sheet
		['....................................................',
		 '....................................................',
		 '............................................j.......',
		 '............................................v.......',
		 '............................................2.......',
		 'bbbbbbbbbbbbbbbbbbbbbb.....................fff..b...',
		 'b.....DDDDDDDDD......b..........................b...',
		 'b..................j.b..........................b...',
		 'b..................v.b................fff.......b...',
		 'b..................1.b.................d........b...',
		 'b....bfffffffffffffffb..........................b...',
		 'b.............b............................fff..b...',
		 'b.f...........b.......................fff.......b...',
		 'b.............b.................................b...',
		 'b.............b.................................b...',
		 'bbbbssff......b.................................b...',
		 '...bddfffff...b.................................b...',
		 '...b..........b.................................b...',
		 '...b..........b............>....................b...',
		 '...b..fffffffff................ffffpp...........b...',
		 '...b..............@...j.........................b...',
		 '...b........<....!#$..v....b....................b...',
		 '...bpp................m....bssssssssssssssssssssb...',
		 '...fffffffffffffffffffffffffffffffffffffffffffffb...',
		 '....................................................'
			],
		8,
		8,
		16,
		16
	);
	player = new Sprite(spawnx, spawny, 12, 12);
	player.layer = 1;
	player.anis.w = 16;
	player.anis.h = 16;
	player.anis.offset.y = 1;
	player.anis.frameDelay = 8;
	player.spriteSheet = charactersImg;
	player.addAnis({
		idle: { row: 0, frames: 4 },
		knockback: { row: 0, frames: 1 },
		run: { row: 1, frames: 3 },
		jump: { row: 1, col: 3, frames: 2 }
	});
	player.ani = 'idle';
	player.rotationLock = true;
	
	player.friction = 1; //wallsliding
	
	groundSensor = new Sprite(spawnx, spawny+3, 14, 13);
	groundSensor.visible = false;
	groundSensor.mass = 0.01;
	groundSensor.overlaps(allSprites);
	
	new GlueJoint(player, groundSensor);
	
	//misc settings
	
	camera.zoom =1;	
	
	platformSqnc();
	vfloatSqnc();
	spikedrop();
	
	backgroundImg.resize(width,height);
}

async function vfloatSqnc(){
	await text_v.move(5,'up',0.2);
	await text_v.move(5,'down',0.2);
	vfloatSqnc();
}

async function platformSqnc(){
	await delay(500);
	await platform.move(16*pltmove+4,'up',0.7);
	await delay(500);
	await platform.move(16*pltmove+4,'down',0.7);
	
	platformSqnc();
}

async function spikedrop(){
	await delay(2500);
	await dspikemov.move(16*3,'down',1.5);
	await dspikemov.move(16*3,'up',0.5);
	spikedrop();
}

function draw() {
	background(backgroundImg);//skybox
	stroke(0,0,0,0);
	
	if(paused){//pause logic
		pauseicon.text = '||';
		pausemsg.text = "Press p to unpause";
		world.autoStep = false;
		return;
	} else {
		world.autoStep = true;
		pauseicon.text='>';
		pausemsg.text = "Press p to pause";
	}
	
	if(groundSensor.overlapping(door1)){ //works landing
		 if (key === 'j' || key === 'J'){
				window.open("about.html","_blank");
				paused = true;
		 }
	}
	
	if(groundSensor.overlapping(door2)){//about me landing8
		 if (key === 'j' || key === 'J'){
				window.open("works.html","_blank");
				paused = true;
		 }
	}
	
	if(groundSensor.overlapping(mailbox)){ //mailbox
		if (key === 'j' || key === 'J'){
			window.open("mailto:minh.nguyen@ocadu.ca","_blank");
			paused = true;
		}
	}
		
	
	if(groundSensor.overlapping(spike)||groundSensor.overlapping(dspike)||groundSensor.overlapping(dspikemov)||player.y>400){
		died = true;
		 }
	
	if (groundSensor.overlapping(floor)||groundSensor.overlapping(brick)||groundSensor.overlapping(platform)) {//only allow jump if the player is on the ground or touching the wall
		if (kb.presses('up') || kb.presses('space')) {
			player.ani = 'jump';
			player.vel.y = -4.5;
		}
	}	
	if (kb.pressing('left')) {
		player.ani = 'run';
		player.vel.x = -1.5;
		player.mirror.x = true;
	} else if (kb.pressing('right')) {
		player.ani = 'run';
		player.vel.x = 1.5;
		player.mirror.x = false;
	} else {
		player.ani = 'idle';
		player.vel.x = 0;
	}
	
	if (died) { //reset player position on spike touch
		died=!died;
		player.speed = 0;
		player.x = spawnx;
		player.y = spawny;
	}
	
	//y dampening feature
	let targetY = player.y - height / 2;
	cameraY = lerp(cameraY, targetY, dampening) -5;
  
  // Set the camera position
  camera.y = (cameraY + height / 2);
	camera.x = player.x + 52;
	
	//UIelements, sticking to the camera
	pauseicon.x = camera.x-280;
	pauseicon.y = camera.y-140;
	pausemsg.x = camera.x - 235;
	pausemsg.y = camera.y-110;
}

function keyPressed(){
	if (key === 'p' || key === 'P') {
    paused = !paused;
  }
}
