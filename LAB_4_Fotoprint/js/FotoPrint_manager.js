'use strict';

let app = null;
let first = true;

function main() {
    let cnv = document.getElementById('canvas');
    let top = document.getElementById('top');

    drawCanvasRect(top);
    drawCanvasRect(cnv);
    app = new FotoPrint();
    app.init();
    app.drawObjSel(top);
    cnv.addEventListener('mousedown', drag, false);
    top.addEventListener('dblclick', makeNewItem, false);
    cnv.addEventListener('dblclick', makeNewItem, false);
    // resizeCanvas(cnv, top)
    // window.addEventListener('resize', function(){ resizeCanvas(cnv, top) });
}

function drawCanvasRect(cnv) {
    let ctx = cnv.getContext("2d");
    let color = document.getElementById('i1').value;

    if(first === true) {
        console.log("first")
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, cnv.width, cnv.height);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, cnv.width, cnv.height);
    }
    else{
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, cnv.width, cnv.height);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, cnv.width, cnv.height);
    }

}

function resizeCanvas(c, t) {
    let container = document.getElementsByClassName('container');
    c.style.width = container[0].clientWidth - 30 + "px";
    t.style.width = .8 * (container[0].clientWidth - 30) + "px";
}

function changeBackground(){
    let cnv = document.getElementById('canvas');

    first = false;
    drawCanvasRect(cnv);
    app.drawObj(cnv);
}

//Drag & Drop operation
//drag
function drag(ev) {
    let mx = null;
    let my = null;
    let cnv = null;

    if ( ev.layerX ||  ev.layerX === 0) {
        mx= ev.layerX;
        my = ev.layerY;
    } else if (ev.offsetX || ev.offsetX === 0) {
        mx = ev.offsetX;
        my = ev.offsetY;
    }

    if (app.dragObj(mx, my)) {
        cnv = document.getElementById('canvas');
        cnv.style.cursor = "pointer";
        cnv.addEventListener('mousemove', move, false);
        cnv.addEventListener('mouseup', drop, false);
    }

}

//Drag & Drop operation
//move
function move(ev) {
    let mx = null;
    let my = null;
    let cnv = document.getElementById('canvas');

    if ( ev.layerX ||  ev.layerX === 0) {
        mx= ev.layerX;
        my = ev.layerY;
    } else if (ev.offsetX || ev.offsetX === 0) {
        mx = ev.offsetX;
        my = ev.offsetY;
    }
    app.moveObj(mx, my);
    drawCanvasRect(cnv);
    app.drawObj(cnv);

}

//Drag & Drop operation
//drop
function drop() {
    let cnv = document.getElementById('canvas');

    cnv.removeEventListener('mousemove', move, false);
    cnv.removeEventListener('mouseup', drop, false);
    cnv.style.cursor = "crosshair";
}

//Insert a new Object on Canvas
//dblclick Event
function makeNewItem(ev) {
    let mx = null;
    let my = null;
    let cnv = document.getElementById('canvas');

    if ( ev.layerX ||  ev.layerX === 0) {
        mx = ev.layerX;
        my = ev.layerY;
    } else if (ev.offsetX || ev.offsetX === 0) {
        mx = ev.offsetX;
        my = ev.offsetY;
    }
    if (app.insertObj(mx, my)) {
        drawCanvasRect(cnv);
        app.drawObj(cnv);
    }

    else if (app.selectObj(mx, my)) {
        drawCanvasRect(cnv);
        app.drawObj(cnv);
    }
}

//Delete button
//Onclick Event
function remove() {
    let cnv = document.getElementById('canvas');

    app.removeObj();
    drawCanvasRect(cnv);
    app.drawObj(cnv);
}

function insertText() {
    let cnv = document.getElementById('canvas');
    let ctx = cnv.getContext('2d');
    let text = document.getElementById('text').value;
    let color = document.getElementById('i3').value;
    ctx.font = "12pt Helvetica";
    let widthText = ctx.measureText(text).width;
    let fullText = new Text(50, 50, widthText, 20, text, color);
    drawCanvasRect(cnv);
    app.insertOnCanvas(fullText);
    app.drawObj(cnv);
}

function insertImage() {
    let cnv = document.getElementById('canvas');
    let URL = window.webkitURL || window.URL;
    let imagePath = document.getElementById('imageFile').files[0];
    let url = URL.createObjectURL(imagePath);
    let img = new Image();
    img.src = imagePath;

    let fullImage = new Picture(50, 50, 150, 150, url);

    drawCanvasRect(cnv);
    app.insertOnCanvas(fullImage);
    app.drawObj(cnv);
}

//Save button
//Onclick Event
function saveAsImage() {
    try {
        window.open(document.getElementById('canvas').toDataURL("imgs/png"));}
    catch(err) {
        alert("You need to change browsers OR upload the file to a server.");
    }
}



