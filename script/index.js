const canvas = document.getElementById("backgroundCanvas");
const ctx = canvas.getContext("2d");

const density = 40/500000;

const pointRadius = 2;
const distance = 200;
const maxSpeed = 50
const minSpeed = 20


const points = [];

function ResizeCanvas(){;
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    let expCount = canvas.width * canvas.height * density;
    if(points.length < expCount){
        points.push(...Array(Math.floor(expCount - points.length)).fill(null).map(_=>RandPoint()));
    }
}

ResizeCanvas();

window.onresize = ResizeCanvas;


function RandSign(){
    return Math.floor(Math.random()*2)*2 - 1;
}

function RandPoint(){
    return {
        w: 1,
        x: Math.random() * canvas.width, 
        y: Math.random() * canvas.height,
        vx: RandSign() * (Math.random() * (maxSpeed - minSpeed) + minSpeed),
        vy: RandSign() * (Math.random() * (maxSpeed - minSpeed) + minSpeed)
    };
}

function RandomizePoint(p){
    p.w = 0;
    p.x = Math.random() * canvas.width; 
    p.y = Math.random() * canvas.height;
    p.vx =RandSign() * (Math.random() * (maxSpeed - minSpeed) + minSpeed);
    p.vy = RandSign() * (Math.random() * (maxSpeed - minSpeed) + minSpeed);
}

function dist(p, q){
    return Math.sqrt(Math.pow(p.x-q.x, 2) + Math.pow(p.y-q.y, 2))
}

function Advance(p){
    p.x += p.vx * 0.005;
    p.y += p.vy * 0.005;
    p.w = Math.min(1, p.w + 0.01)
    if(p.x < -distance || p.x > canvas.width + distance || p.y < -distance || p.y > canvas.height + distance){
        RandomizePoint(p);
    }
}

function DrawPoint(pt){
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pointRadius, 0, 2*Math.PI);
    ctx.fillStyle = `rgba(255, 255, 255, ${pt.w * 0.05})`;
    ctx.fill();
}

function DrawLine(p, q, w){
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(q.x, q.y);
    ctx.strokeStyle = `rgba(255, 255, 255, ${p.w * q.w * w* 0.2})`;
    ctx.stroke();
}

function Draw(){
    //ctx.fillStyle = "#eee";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(let p_idx = 0; p_idx < points.length; ++p_idx){
        let p = points[p_idx];
        DrawPoint(p);
        for(let q_idx = p_idx+1; q_idx < points.length; ++q_idx){
            let q = points[q_idx];
            let d = dist(p, q);
            if(d > distance)continue;
            DrawLine(p, q, (distance - d)/distance)
        }
        Advance(p);
    }
    requestAnimationFrame(Draw);
}

requestAnimationFrame(Draw);