'use strict';

let app = null;

function main() {
    let cnv = document.getElementById('canvas');

    drawCanvasRect(cnv);
    app = new FotoPrint();
    app.init();
    app.drawObj(cnv);
    cnv.addEventListener('mousedown', drag, false);
    cnv.addEventListener('dblclick', makenewitem, false);
}

function drawCanvasRect(cnv) {
    let ctx = cnv.getContext("2d");

    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, cnv.width, cnv.height);
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
function makenewitem(ev) {
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
}

//Delete button
//Onclick Event
function remove() {
    let cnv = document.getElementById('canvas');

    app.removeObj();
    drawCanvasRect(cnv);
    app.drawObj(cnv);
}

//Save button
//Onclick Event
function saveasimage() {
    try {
        window.open(document.getElementById('canvas').toDataURL("imgs/png"));}
    catch(err) {
        alert("You need to change browsers OR upload the file to a server.");
    }
}

