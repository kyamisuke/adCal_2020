var socket;
var dogImg, rabbitImg, rengaImg, needleTreeImg, wideTreeimg, redTreeImg, orangeTreeImg, yellowTreeImg;
const imgSize = 70;
var dogPosition, rengaPosition;
var camPosition;
var treeArray;

function preload() {
    dogImg = loadImage("https://2.bp.blogspot.com/-6HhC2AY0eps/XLAdB1LYatI/AAAAAAABSU8/6mvfk-9iyAA0mK8q8IKI4tNqTFt0Y1IDgCLcBGAs/s400/fantsy_haneinu.png");
    rabbitImg = loadImage("https://2.bp.blogspot.com/-gHwTBItyjQw/WhUh45bw5QI/AAAAAAABIOQ/3n3Y3FffZpMrX1Fbf8ptIMwUAN0p04amgCLcBGAs/s400/fantasy_wolpertinger.png");
    rengaImg = loadImage("https://2.bp.blogspot.com/-T5MY0mvl9Aw/UsZstBkZFoI/AAAAAAAAcpc/rnG_UJLfJIM/s600/renga_pattern.png");
    needleTreeImg = loadImage("https://3.bp.blogspot.com/-8tS6vSNp37Q/V9vCuH1uwHI/AAAAAAAA9_0/SZa1qMEoVUACyw3KtRyGj2YHNOvX3ucHACLcB/s300/tree_simple1.png");
    wideTreeimg = loadImage('https://3.bp.blogspot.com/-j_iBanEUvZ8/V9vCuwf7EbI/AAAAAAAA9_8/y8B5mE1A1ygo0bbcIDZZsodllX3VDc8egCLcB/s300/tree_simple3.png');
    redTreeImg = loadImage('https://2.bp.blogspot.com/-7wtEd3NHAtc/V9vCvh0PuqI/AAAAAAAA-AE/Twoxt-oM-kcEGHLi0ht7M4RpGR1hdZMfgCLcB/s300/tree_simple5.png');
    orangeTreeImg = loadImage('https://2.bp.blogspot.com/-erVDEPQyD8s/V9vCvycBFkI/AAAAAAAA-AI/AN9Qhdv66lgInYybTTJ_U_m_gcow4t4wQCLcB/s300/tree_simple6.png');
    yellowTreeImg = loadImage('https://4.bp.blogspot.com/-IjzeeTODMe4/V9vCvAoWTUI/AAAAAAAA-AA/AEow268A8TshxTeKNZ05Prhl48qd4r8UgCLcB/s300/tree_simple4.png');
}

function setup() {
    createCanvas(960, 520, WEBGL);
    background(51);
    strokeJoin(ROUND);
    textAlign(CENTER, CENTER);
    imageMode(CENTER)

    dogPosition =new p5.Vector(-100,-imgSize);
    rabbitPosition =new p5.Vector(-100,245-imgSize);
    rengaPosition = new p5.Vector(0, -25);

    treeArray = [needleTreeImg, wideTreeimg, redTreeImg, orangeTreeImg, yellowTreeImg];

    socket = io.connect('http://192.168.0.12:3000');
    // socket = io.connect('http://localhost:3000');

    socket.on('pads', newOperated);

    camPosition = new p5.Vector(0, 0, (height / 2) / tan(PI / 6));
    camera(camPosition.x, camPosition.y, camPosition.z, 0, 0, 0, 0, 1, 0);
}

function controllerOperated(pads) {
    console.log("controllerOperated");

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
        y: dogPosition.y
    }

    socket.emit('pads', data);
}

function newOperated(data) {
    console.log("newOperated");
    console.log(data);

    rabbitPosition = data;
}

function draw() {
    background(16*15+9, 16*14, 16*10+14);

    var pads = navigator.getGamepads ? navigator.getGamepads() :
    (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);

    pads = pads[0];
    if (pads) {
        controllerOperated(pads);
    }

    image(rabbitImg,rabbitPosition.x,rabbitPosition.y,imgSize,imgSize);

    for (let i=0; i < 20; i++) {
        let n = i%treeArray.length;
        image(treeArray[n], -width/2+i*250, 130, 100, 200);
        image(treeArray[n], -width/2+i*250, -110, 100, 200);
    }
    for (let i=0; i < 10; i++) {
        image(rengaImg,-width/2+i*250,height/2-25,250,50);
        image(rengaImg,-width/2+i*250,0,250,50);
    }

}
