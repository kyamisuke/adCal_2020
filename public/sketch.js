var socket;
var dogImg, rabbitImg, rengaImg;
const imgSize = 70;
var dogPosition, rengaPosition;
var buttonNames = [
  "×", "○", "□", "△",
  "L1", "R1", "L2", "R2",
  "SH", "OP",
  "L3", "R3",
  "↑", "↓", "←", "→",
  "PS", "TP"
];

function preload() {
    dogImg = loadImage("https://2.bp.blogspot.com/-6HhC2AY0eps/XLAdB1LYatI/AAAAAAABSU8/6mvfk-9iyAA0mK8q8IKI4tNqTFt0Y1IDgCLcBGAs/s400/fantsy_haneinu.png");
    rabbitImg = loadImage("https://2.bp.blogspot.com/-gHwTBItyjQw/WhUh45bw5QI/AAAAAAABIOQ/3n3Y3FffZpMrX1Fbf8ptIMwUAN0p04amgCLcBGAs/s400/fantasy_wolpertinger.png");
    rengaImg = loadImage("https://2.bp.blogspot.com/-T5MY0mvl9Aw/UsZstBkZFoI/AAAAAAAAcpc/rnG_UJLfJIM/s600/renga_pattern.png");
}

function setup() {
    createCanvas(960, 520, WEBGL);
    background(51);
    strokeJoin(ROUND);
    textAlign(CENTER, CENTER);
    imageMode(CENTER)

    dogPosition =new p5.Vector(-100,-imgSize);
    rabbitPosition =new p5.Vector(-100,260-imgSize);
    rengaPosition = new p5.Vector(0, -25);

    socket = io.connect('http://localhost:3000');
    socket.on('pads', newOperated);
}

function controllerOperated(pads) {
    console.log(pads);

    var but = [];
    for (var i = 0; i < pads.buttons.length; i++) {
      var val = pads.buttons[i];
      var pressed = val == 1.0;
      if (typeof(val) == "object") {
        pressed = val.pressed;
        val = val.value;
      }
      but[i] = val;
    }

    var axes = pads.axes;

    // スティックの位置をマッピング
    var Lx = axes[0]*5;//map(axes[0], -1, 1, 25, 325);
    var Ly = axes[1]*5;//map(axes[1], -1, 1, 25, 325);
    var Rx = axes[2]*5;//map(axes[2], -1, 1, 375, 675);
    var Ry = axes[3]*5;//map(axes[3], -1, 1, 25, 325);

    dogPosition.add(Lx,0);
    image(dogImg,dogPosition.x,dogPosition.y,imgSize,imgSize);
    for (let i=0; i < 5; i++) {
        image(rengaImg,-width/2+i*250,height/2-25,250,50);
        image(rengaImg,-width/2+i*250,0,250,50);
    }

    socket.emit('pads', pads);
}

function newOperated(data) {
    console.log(data);

    var but = [];
    for (var i = 0; i < pads.buttons.length; i++) {
      var val = pads.buttons[i];
      var pressed = val == 1.0;
      if (typeof(val) == "object") {
        pressed = val.pressed;
        val = val.value;
      }
      but[i] = val;
    }

    var axes = pads.axes;

    // スティックの位置をマッピング
    var Lx = axes[0]*5;//map(axes[0], -1, 1, 25, 325);
    var Ly = axes[1]*5;//map(axes[1], -1, 1, 25, 325);
    var Rx = axes[2]*5;//map(axes[2], -1, 1, 375, 675);
    var Ry = axes[3]*5;//map(axes[3], -1, 1, 25, 325);

    rabbitPosition.add(Lx,0);
    image(rabbitImg,rabbitPosition.x,rabbitPosition.y,imgSize,imgSize);
    for (let i=0; i < 5; i++) {
        image(rengaImg,-width/2+i*250,height/2-25,250,50);
        image(rengaImg,-width/2+i*250,0,250,50);
    }
}

function draw() {
    background(16*15+9, 16*14, 16*10+14);

    var pads = navigator.getGamepads ? navigator.getGamepads() :
    (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);

    pads = pads[0];
    if (pads) {
        controllerOperated(pads);
    }

    // image(rengaImg,0,height/2-50,width*2,100);
    // image(rengaImg,0,-50,width*2,100);
}