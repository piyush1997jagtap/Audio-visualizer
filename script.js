const container = document.getElementById('container');
const canvas = document.getElementById('canvas1');
const file = document.getElementById('fileUpload');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let audioSource;
let analyser;
let patternType;

function getPattern() {
    var eID = document.getElementById("pattern");
    patternType = eID.options[eID.selectedIndex].text;
}

file.addEventListener('change', function () {
    const files = this.files;
    const audio = document.getElementById('audio1');
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();
    const audioContext = new AudioContext();

    audioSource = audioContext.createMediaElementSource(audio);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 128;
    const bufferlength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferlength);

    const barWidth = 15;
    let barHeight;
    let x;

    function animate() {
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        if (patternType == 'Circle') {
            drawVisualizer(bufferlength, x, barWidth, barHeight, dataArray);
        }
        if (patternType == 'Leaf') {
            drawVisualizerForLeaf(bufferlength, x, barWidth, barHeight, dataArray);
        }
        if (patternType == 'Text') {
            drawVisualizerForText(bufferlength, x, barWidth, barHeight, dataArray);
        }

        if (patternType == 'Rectangle') {
            analyser.fftSize = 128;
            drawVisualizerForRectangle(bufferlength, x, barWidth, barHeight, dataArray);
        }
        requestAnimationFrame(animate);
    }
    animate();

})

function drawVisualizer(bufferlength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferlength; i++) {
        barHeight = dataArray[i] * 1.4;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(i * bufferlength * 4);
        const blue = barHeight / 2;
        const hue = 250 + i * 2;
        ctx.fillStyle = 'hsl(' + hue + ',100%,' + '50%)';
        ctx.beginPath();
        ctx.arc(0, barHeight, barHeight / 10, 0, Math.PI * 2);
        ctx.fill();
        x += barWidth;
        ctx.restore();
    }

}

function drawVisualizerForLeaf(bufferlength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferlength; i++) {
        barHeight = dataArray[i] * 1.4;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(i * 4.184);
        const hue = i * 0.03;
        ctx.fillStyle = 'hsl(' + hue + ',100%,' + barHeight / 3 + '%)';
        ctx.fillRect(0, 0, barWidth, barHeight);
        x += barWidth;
        ctx.restore();
    }

}

function drawVisualizerForText(bufferlength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferlength; i++) {
        barHeight = dataArray[i] * 1.5;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(i * 8.1);
        const hue = i * 3;
        ctx.strokeStyle = 'hsl(' + hue + ',100%,' + barHeight / 3 + '%)';
        ctx.font = dataArray[i] + 'px Helvetica';
        ctx.fillText('A', 0, barHeight);
        ctx.strokeText('A', 0, barHeight);
        x += barWidth;
        ctx.restore();
    }

}


function drawVisualizerForShadow(bufferlength, x, barWidth, barHeight, dataArray) {
    ctx.lineCap = 'square';
    ctx.shadowOffsetX = 15;
    ctx.shadowOffsetY = 10;
    ctx.shadowBlur = 5;
    ctx.shadowColor = 'black';
    for (let i = 0; i < bufferlength; i++) {
        barHeight = dataArray[i] * 1.5;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(i * 6);
        const hue = i * 0.3;

        ctx.lineWidth = barHeight / 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, barHeight);
        ctx.stroke();

        ctx.lineWidth = barHeight / 5;
        ctx.strokeStyle = 'rgba(150,150,150,1)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, barHeight);
        ctx.stroke();

        x += barWidth;
        ctx.restore();
    }

    for (let i = bufferlength; i > 20; i--) {
        barHeight = dataArray[i] > 80 ? dataArray[i] : 80;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(i * 3);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, barHeight * 3, barHeight / 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(150,150,150,1)';

        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

}

function drawVisualizerForRectangle(bufferlength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferlength; i++) {
        barHeight = dataArray[i] * 0.8;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(i * 0.14);
        const hue = i * 1.5;
        ctx.fillStyle = 'hsl(' + hue + ',100%,' + barHeight / 3 + '%)';
        ctx.strokeStyle = 'white';
        ctx.fillRect(barHeight / 2, barHeight / 2, barWidth, barHeight);
        barHeight > 80 ? ctx.strokeRect(barHeight / 2, barHeight / 2, barWidth, barHeight * 1.2) : ctx.strokeRect(0, 0, 0, 0);
        barHeight > 110 ? ctx.strokeRect(barHeight / 2, barHeight * 1.8, barWidth, barHeight * 0.2) : ctx.strokeRect(0, 0, 0, 0);
        x += barWidth;
        ctx.restore();
    }

}