var socket;
var dogImg, rabbitImg, rengaImg, needleTreeImg, wideTreeimg, redTreeImg, orangeTreeImg, yellowTreeImg, beeImg;
const imgSize = 70;
var dogPosition, rengaPosition;
var camPosition;
var treeArray;
var gravity = 1;
var velocity = 0;
var lift = -2;
var topBeePosition = [], bottomBeePostion = [];
var winImg, loseImg;
var isLose = false;
var isWin = false;

function preload() {
    dogImg = loadImage("https://2.bp.blogspot.com/-6HhC2AY0eps/XLAdB1LYatI/AAAAAAABSU8/6mvfk-9iyAA0mK8q8IKI4tNqTFt0Y1IDgCLcBGAs/s400/fantsy_haneinu.png");
    rabbitImg = loadImage("https://2.bp.blogspot.com/-gHwTBItyjQw/WhUh45bw5QI/AAAAAAABIOQ/3n3Y3FffZpMrX1Fbf8ptIMwUAN0p04amgCLcBGAs/s400/fantasy_wolpertinger.png");
    rengaImg = loadImage("https://2.bp.blogspot.com/-T5MY0mvl9Aw/UsZstBkZFoI/AAAAAAAAcpc/rnG_UJLfJIM/s600/renga_pattern.png");
    needleTreeImg = loadImage("https://3.bp.blogspot.com/-8tS6vSNp37Q/V9vCuH1uwHI/AAAAAAAA9_0/SZa1qMEoVUACyw3KtRyGj2YHNOvX3ucHACLcB/s300/tree_simple1.png");
    wideTreeimg = loadImage('https://3.bp.blogspot.com/-j_iBanEUvZ8/V9vCuwf7EbI/AAAAAAAA9_8/y8B5mE1A1ygo0bbcIDZZsodllX3VDc8egCLcB/s300/tree_simple3.png');
    redTreeImg = loadImage('https://2.bp.blogspot.com/-7wtEd3NHAtc/V9vCvh0PuqI/AAAAAAAA-AE/Twoxt-oM-kcEGHLi0ht7M4RpGR1hdZMfgCLcB/s300/tree_simple5.png');
    orangeTreeImg = loadImage('https://2.bp.blogspot.com/-erVDEPQyD8s/V9vCvycBFkI/AAAAAAAA-AI/AN9Qhdv66lgInYybTTJ_U_m_gcow4t4wQCLcB/s300/tree_simple6.png');
    yellowTreeImg = loadImage('https://4.bp.blogspot.com/-IjzeeTODMe4/V9vCvAoWTUI/AAAAAAAA-AA/AEow268A8TshxTeKNZ05Prhl48qd4r8UgCLcB/s300/tree_simple4.png');
    beeImg = loadImage('https://1.bp.blogspot.com/-YoKsv_evnNM/WaPvcNrj5zI/AAAAAAABGMs/8mlxQhZyRuU_CoPJiSzJ67ir1CNfAulvQCLcBGAs/s400/bug_hachi_doku.png');
    loseImg = loadImage('https://4.bp.blogspot.com/-ghnZ3is3Kuw/VcMlbOZ1C-I/AAAAAAAAwbs/AYCFlOMb1T4/s400/pose_lose_boy.png');
    winImg = loadImage('https://1.bp.blogspot.com/-h0QG-0JLyF8/VcMlcb5dEYI/AAAAAAAAwcQ/Rfaj8u-VDsE/s400/pose_win_girl.png');
}

function setup() {
    createCanvas(960, 520, WEBGL);
    imageMode(CENTER)

    dogPosition =new p5.Vector(-100,-imgSize);
    rabbitPosition =new p5.Vector(-100,245-imgSize);
    rengaPosition = new p5.Vector(0, -25);

    treeArray = [needleTreeImg, wideTreeimg, redTreeImg, orangeTreeImg, yellowTreeImg];

    socket = io.connect('http://192.168.0.12:3000');
    // socket = io.connect('http://localhost:3000');

    socket.on('pads', newOperated);
    socket.on('match', result);

    camPosition = new p5.Vector(0, 0, (height / 2) / tan(PI / 6));
    camera(camPosition.x, camPosition.y, camPosition.z, 0, 0, 0, 0, 1, 0);

    for (let i=0; i < 20; i++) {
        if (random(100) < 30) {
            let p = new p5.Vector(-width/2+i*250, -100);
            topBeePosition.push(p);
        }
        if (random(100) < 30) {
            let p = new p5.Vector(-width/2+i*250, 140+sin(frameCount*0.05)*30);
            bottomBeePostion.push(p);
        }
    }
}

function controllerOperated(pads) {
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

    if (but[1] == 1) {
        velocity += lift;
    }
    velocity += gravity;
    velocity *= 0.9;
    dogPosition.y += velocity;

    var axes = pads.axes;

    // スティックの位置をマッピング
    var Lx = axes[0]*5;//map(axes[0], -1, 1, 25, 325);
    var Ly = axes[1]*5;//map(axes[1], -1, 1, 25, 325);
    var Rx = axes[2]*5;//map(axes[2], -1, 1, 375, 675);
    var Ry = axes[3]*5;//map(axes[3], -1, 1, 25, 325);

    dogPosition.add(Lx,0);
    if (dogPosition.x < -width/2) {
        dogPosition.x = -width/2;
    }
    if (dogPosition.y > -imgSize) {
        dogPosition.y = -imgSize;
    }
    if (dogPosition.y < -200) {
        dogPosition.y = -200
    }
    camPosition.add(Lx,0,0);
    if (camPosition.x < 0) {
        camPosition.x = 0;
    } else if (dogPosition.x < -100) {
        camPosition.x = 0;
    }
    camera(camPosition.x, camPosition.y, camPosition.z, camPosition.x, 0, 0, 0, 1, 0);

    image(dogImg,dogPosition.x ,dogPosition.y,imgSize,imgSize);

    let data = {
        x: dogPosition.x,
        y: dogPosition.y,
    }

    socket.emit('pads', data);
}

function newOperated(data) {
    rabbitPosition = data;
}

function youLose() {
    isLose = true;

    let data = {
        match: "is Lose"
    };

    socket.emit('match', data);
}

function result(data) {
    if (data.match == "is Lose") {
        isWin = true;
    }
}

function draw() {
    randomSeed(39);
    background(16*15+9, 16*14, 16*10+14);

    var pads = navigator.getGamepads ? navigator.getGamepads() :
    (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);

    pads = pads[0];
    if (pads) {
        controllerOperated(pads);
    }

    image(rabbitImg,rabbitPosition.x,rabbitPosition.y,imgSize,imgSize);

    for (let i=0; i < 20; i++) {
        let n = int(random(treeArray.length));
        image(treeArray[n], -width/2+i*250, 130, 100, 200);
        n = int(random(treeArray.length));
        image(treeArray[n], -width/2+i*250, -110, 100, 200);
    }
    for (let i=0; i<topBeePosition.length; i++) {
        image(beeImg,topBeePosition[i].x,topBeePosition[i].y+sin(frameCount*0.05)*30,imgSize,imgSize);
    }
    // for (let i=0; i<bottomBeePostion.length; i++) {
    //     image(beeImg,bottomBeePostion[i].x,bottomBeePostion[i].y+sin(frameCount*0.05)*30,imgSize,imgSize);
    // }
    for (let i=0; i<topBeePosition.length; i++) {
        let d = p5.Vector.dist(topBeePosition[i], dogPosition);
        if (d < 50) {
            youLose();
        }
    }
    for (let i=0; i < 20; i++) {
        image(rengaImg,-width/2+i*250,height/2-25,250,50);
        image(rengaImg,-width/2+i*250,0,250,50);
    }

    if (isLose == true) {
        fill(0, 100);
        noStroke();
        rectMode(CENTER);
        rect(dogPosition.x+100,0,width,height);
        image(loseImg,dogPosition.x+100,0,height,height);
    }
    if (isWin == true) {
        fill(0, 100);
        noStroke();
        rectMode(CENTER);
        rect(dogPosition.x+100,0,width,height);
        image(winImg,dogPosition.x+100,0,height,height);
    }
}
