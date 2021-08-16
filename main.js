// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

let score = 0;
var starttime = Date.now();

// function to generate random number

function ScoreCounter(score) {
    document.getElementById('score').innerHTML = "Balls Destroyed = " + score;
}

function Timer() {
    document.getElementById('timetaken').innerHTML = "Time Taken = " + (Date.now() - starttime);
}

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

function Shape(x,y,velX,velY,exists){
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}

function Ball(x,y,velX,velY,exists,color,size){
    Shape.call(this,x,y,velX,velY,exists);
    // object.defineProperty(Ball.prototype,'constructor',{
    //     value:Ball,
    //     enumerable:false,
    //     writable:true,
    // });
    this.color = color;
    this.size = size;
    Ball.prototype.Draw = function() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
        ctx.fill();
    }

    Ball.prototype.update = function() {
        if((this.x + this.size) >= width) {
            this.velX = -(this.velX);
        }

        if((this.x-this.size) <= 0) {
            this.velX = -(this.velX);
        }

        if((this.y-this.size) <= 0) {
            this.velY = -(this.velY);
        }

        if((this.y + this.size) >= height) {
            this.velY = -(this.velY);
        }

        this.x += this.velX;
        this.y += this.velY;
    }

    Ball.prototype.collisionDetect = function(){
        for(let j=0;j<balls.length;j++){
            if(!(this === balls[j]) && this.exists && balls[j].exists){
                const dx = this.x - balls[j].x;
                const dy = this.y - balls[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <this.size + balls[j].size) {
                    balls[j].color = this.color = 'rgb(' + random(0,255) + ',' +random(0,255) + ',' + random(0,255) + ')';
                }
            }
        }
    }
}

function EvilCircle(x,y,exists){
    Shape.call(this,x,y,20,20,exists);

    EvilCircle.prototype.Draw = function(){
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.arc(this.x,this.y,10,0,2*Math.PI);
        ctx.stroke();
    }
    EvilCircle.prototype.Checkbounds = function(){
        if((this.x + this.velX) >= width){
            this.x = this.x - this.velX;
        }
        if((this.y + this.velY) >= height){
            this.y -= (this.velY);
        }
        if((this.x - this.velX) < 0){
            this.x += (this.velX);
        }
        if((this.y - this.velY) < 0){
            this.y += (this.velY);
        }
    }

    EvilCircle.prototype.SetControls = function() {
        let _this = this;
        window.onkeydown = function(e){
            if(e.key == 'a'){
                _this.x -= _this.velX;
            }
            if(e.key == 'd'){
                _this.x += _this.velX;
            }
            if(e.key == 'w'){
                _this.y -= _this.velY;
            }
            if(e.key == 's'){
                _this.y += _this.velY;
            }
        }
    }

    EvilCircle.prototype.CollisionDetect = function() {
        for(let j = 0; j < balls.length;j++){
            if(balls[j].exists){
                const dx = this.x - balls[j].x;
                const dy = this.y - balls[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if(distance <= 10 + balls[j].size){
                    balls[j].exists = false;
                    score = score + 1;
                    ScoreCounter(score);
                }
            }
        }
    }

}


let testBall = new Ball(50,100,4,4,true,'blue',10);
let evilcircle = new EvilCircle(20,20,true);
evilcircle.SetControls();

let balls = [];

while(balls.length<25){
    let size = random(10,20);
    let ball = new Ball(
        random(0+size,width - size),
        random(0+size,height - size),
        random(-7,7),
        random(-7,7),
        true,
        'rgb('+ random(0,255) + ',' + random(0,255) + ',' + random(0,255) + ')',
        size,
    );

    balls.push(ball);
}

function reloadpage(){
    document.getElementById('Gameover').style.display = 'block';
    addEventListener('keydown', function(e) {
        if(e.key == 'r'|| e.key == 'R'){
            location.reload();
        }
    });
}

function loop() {
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(0,0,width,height);
    evilcircle.Draw();
    evilcircle.Checkbounds();
    evilcircle.CollisionDetect();
    if(score < 25)
    Timer();

    for (let i=0;i<balls.length;i++){
        if(balls[i].exists === true){
            balls[i].Draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
    }

    requestAnimationFrame(loop);
}

loop();

setInterval(() => {
    if(score==25)
    reloadpage();
}, 1200);

