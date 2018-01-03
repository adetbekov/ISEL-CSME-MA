'use strict';

class FotoPrint
{
    constructor() {
        this.thingInMotion = null;
        this.offsetx = null;
        this.offsety = null;
        this.shpinDrawing = new Pool(100);
        this.shpinDrawingSelector = new Pool(100);
    }

    init() {
        let r = new Rect(100, 100, 20, 20, "red");
        this.shpinDrawing.insert(r);

        let o = new Oval(150, 150, 50, 1, 1, "blue");
        this.shpinDrawing.insert(o);

        let h = new Heart(250, 250, 80, "pink");
        this.shpinDrawing.insert(h);

        // let dad = new Picture(200, 200, 70, 70, "imgs/allison1.jpg");
        // this.shpinDrawing.insert(dad);

        let b = new Bear(340, 70, 50, "#d35400");
        this.shpinDrawing.insert(b);
    }

    drawObj(cnv) {
        for (let i = 0; i < this.shpinDrawing.stuff.length; i++) {
            this.shpinDrawing.stuff[i].draw(cnv);
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

    // selectObj(mx, my){
    //     let item = null;
    //     let endpt = this.shpinDrawingSel.stuff.length-1;

    //     for (let i = endpt; i >= 0; i--) {
    //         if (this.shpinDrawingSel.stuff[i].mouseOver(mx,my)) {
    //             item = this.cloneObj(this.shpinDrawingSel.stuff[i]);
    //             this.shpinDrawing.insert(item);
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    cloneObj (obj) {
        let item = {};
        let objColor = document.getElementById('i2').value;
        let txtColor = document.getElementById('i3').value;
        let text = document.getElementById('text').value;

        switch(obj.name) {
            case "R":
                item = new Rect(obj.posx + 20, obj.posy + 20, obj.w, obj.h, obj.color);
                break;

            case "P":
                item = new Picture(obj.posx + 20, obj.posy + 20, obj.w, obj.h, obj.impath);
                break;

            case "O":
                item = new Oval(obj.posx + 20, obj.posy + 20, obj.r, obj.hor, obj.ver, obj.color);
                break;

            case "H":
                item = new Heart(obj.posx + 20, obj.posy + 20, obj.drx * 4, obj.color);
                break;

            case "B":
                item = new Bear(obj.posx + 20, obj.posy + 20, obj.r, objColor);
                break;

            case "G":
                item = new Ghost(obj.posx, obj.posy, obj.w, obj.h, objColor);
                break;

            case "V":
                item = new Rosa_Ventos(obj.posx, obj.posy, obj.w, objColor);
                break;

            case "T":
                item = new Text(obj.posx, obj.posy, obj.w, obj.h, text, txtColor);
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

