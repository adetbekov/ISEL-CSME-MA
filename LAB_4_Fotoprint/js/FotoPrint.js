'use strict';

class FotoPrint
{
    constructor() {
        this.thingInMotion = null;
        this.offsetx = null;
        this.offsety = null;
        this.shpinDrawingSel = new Pool(100);
        this.shpinDrawing = new Pool(100);
    }

    init() {
        let r = new Rect(20, 25, 50, 50, "#f1c40f");
        this.shpinDrawingSel.insert(r);

        let o = new Oval(125, 50, 35, 1, 1, "#2ecc71");
        this.shpinDrawingSel.insert(o);

        let h = new Heart(215, 33, 75, "#e74c3c");
        this.shpinDrawingSel.insert(h);

        // let dad = new Picture(200, 200, 70, 70, "imgs/allison1.jpg");
        // this.shpinDrawing.insert(dad);

        let b = new Bear(320, 52, 35, "#d35400");
        this.shpinDrawingSel.insert(b);

        let g = new Ghost(430, 45 , 35, 40, "#3498db");
        this.shpinDrawingSel.insert(g);

        let v = new Virus(490, 8, 8, "#9b59b6");
        this.shpinDrawingSel.insert(v);

        let m = new Batman(610, 25, 4, "#1abc9c");
        this.shpinDrawingSel.insert(m);

        let s = new Robot(730, 0, 1, "#34495e");
        this.shpinDrawingSel.insert(s);
    }

    drawObj(cnv) {
        for (let i = 0; i < this.shpinDrawing.stuff.length; i++) {
            this.shpinDrawing.stuff[i].draw(cnv);
        }
    }

    drawObjSel(top){
        for (let i = 0; i < this.shpinDrawingSel.stuff.length; i++) {
            this.shpinDrawingSel.stuff[i].draw(top);
        }
    }

    dragObj(mx, my) {
        let endpt = this.shpinDrawing.stuff.length-1;

        for (let i = endpt; i >= 0; i--) {
            if (this.shpinDrawing.stuff[i].mouseOver(mx, my)) {
                this.offsetx = mx - this.shpinDrawing.stuff[i].posx;
                this.offsety = my - this.shpinDrawing.stuff[i].posy;
                let item = this.shpinDrawing.stuff[i];
                this.thingInMotion = this.shpinDrawing.stuff.length - 1;
                this.shpinDrawing.stuff.splice(i, 1);
                this.shpinDrawing.stuff.push(item);
                return true;
            }
        }
        return false;
    }

    moveObj(mx, my) {
        // this.shpinDrawing.stuff[this.thingInMotion].setPos(mx, my);
        this.shpinDrawing.stuff[this.thingInMotion].posx = mx - this.offsetx;
        this.shpinDrawing.stuff[this.thingInMotion].posy = my - this.offsety;
    }

    removeObj () {
        this.shpinDrawing.remove();
    }

    insertObj (mx, my) {
        let item = null;
        let endpt = this.shpinDrawing.stuff.length-1;

        for (let i = endpt; i >= 0; i--) {
            if (this.shpinDrawing.stuff[i].mouseOver(mx,my)) {
                item = this.cloneObj(this.shpinDrawing.stuff[i]);
                this.shpinDrawing.insert(item);
                return true;
            }
        }
        return false;
    }

    insertOnCanvas(obj){
        this.shpinDrawing.insert(obj);

    }

    selectObj(mx, my){
        let item = null;
        let endpt = this.shpinDrawingSel.stuff.length-1;

        for (let i = endpt; i >= 0; i--) {
            if (this.shpinDrawingSel.stuff[i].mouseOver(mx,my)) {
                item = this.cloneObj(this.shpinDrawingSel.stuff[i]);
                this.shpinDrawing.insert(item);
                return true;
            }
        }
        return false;
    }

    cloneObj (obj) {
        let item = {};
        let objColor = document.getElementById('i2').value;
        let txtColor = document.getElementById('i3').value;
        let text = document.getElementById('text').value;

        console.log(obj.name)

        switch(obj.name) {
            case "R":
                item = new Rect(obj.posx + 20, obj.posy + 20, obj.w, obj.h, objColor);
                break;

            case "P":
                item = new Picture(obj.posx + 20, obj.posy + 20, obj.w, obj.h, obj.impath);
                break;

            case "O":
                item = new Oval(obj.posx + 20, obj.posy + 20, obj.r, obj.hor, obj.ver, objColor);
                break;

            case "H":
                item = new Heart(obj.posx + 20, obj.posy + 20, obj.drx * 4, objColor);
                break;

            case "B":
                item = new Bear(obj.posx + 20, obj.posy + 20, obj.r, objColor);
                break;

            case "G":
                item = new Ghost(obj.posx+ 20, obj.posy+ 20, obj.w, obj.h, objColor);
                break;

            case "V":
                item = new Virus(obj.posx+ 20, obj.posy+ 20, obj.w, objColor);
                break;

            case "M":
                item = new Batman(obj.posx+ 20, obj.posy+ 20, obj.w, objColor);
                break;

            case "S":
                item = new Robot(obj.posx+ 20, obj.posy+ 20, obj.w, objColor);
                break;

            case "T":
                item = new Text(obj.posx+ 20, obj.posy+ 20, obj.w, obj.h, text, txtColor);
                break;

            default: throw new TypeError("Can not clone this type of object");
        }
        return item;
    }
}


class Pool
{
    constructor (maxSize) {
        this.size = maxSize;
        this.stuff = [];

    }

    insert (obj) {
        if (this.stuff.length < this.size) {
            this.stuff.push(obj);
        } else {
            alert("The application is full: there isn't more memory space to include objects");
        }
    }

    remove () {
        if (this.stuff.length !== 0) {
            this.stuff.pop();
        } else {
           alert("There aren't objects in the application to delete");
        }
    }
}

