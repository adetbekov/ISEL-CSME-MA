class DrawingObjects
{
    constructor (px, py, name) {
        if (this.constructor === DrawingObjects) {
            // Error Type 1. Abstract class can not be constructed.
            throw new TypeError("Can not construct abstract class.");
        }

        //else (called from child)
        // Check if all instance methods are implemented.
        if (this.draw === DrawingObjects.prototype.draw) {
            // Error Type 4. Child has not implemented this abstract method.
            throw new TypeError("Please implement abstract method draw.");
        }

        if (this.mouseOver === DrawingObjects.prototype.mouseOver) {
            // Error Type 4. Child has not implemented this abstract method.
            throw new TypeError("Please implement abstract method mouseOver.");
        }

        this.posx = px;
        this.posy = py;
        this.name = name;
    }

    draw (cnv) {
        // Error Type 6. The child has implemented this method but also called `super.foo()`.
        throw new TypeError("Do not call abstract method draw from child.");
    }

    mouseOver(mx, my) {
        // Error Type 6. The child has implemented this method but also called `super.foo()`.
        throw new TypeError("Do not call abstract method mouseOver from child.");
    }


    sqDist(px1, py1, px2, py2) {
        let xd = px1 - px2;
        let yd = py1 - py2;

        return ((xd * xd) + (yd * yd));
    }
}

class Rect extends DrawingObjects
{

    constructor (px, py, w, h, c) {
        super(px, py, 'R');
        this.w = w;
        this.h = h;
        this.color = c;
    }

    draw (cnv) {
        let ctx = cnv.getContext("2d");

        ctx.fillStyle = this.color;
        ctx.fillRect(this.posx, this.posy, this.w, this.h);

    }

    mouseOver(mx, my) {
        return ((mx >= this.posx) && (mx <= (this.posx + this.w)) && (my >= this.posy) && (my <= (this.posy + this.h)));

    }

}

class Picture extends DrawingObjects
{

    constructor (px, py, w, h, impath) {
        super(px, py, 'P');
        this.w = w;
        this.h = h;
        this.impath = impath;
        this.imgobj = new Image();
        this.imgobj.src = this.impath;
    }

    draw (cnv) {
        let ctx = cnv.getContext("2d");

        if (this.imgobj.complete) {
            ctx.drawImage(this.imgobj, this.posx, this.posy, this.w, this.h);
            console.log("Debug: N Time");

        } else {
            console.log("Debug: First Time");
            let self = this;
            this.imgobj.addEventListener('load', function () {
                ctx.drawImage(self.imgobj, self.posx, self.posy, self.w, self.h);
            }, false);
        }
    }

    mouseOver(mx, my) {
        return ((mx >= this.posx) && (mx <= (this.posx + this.w)) && (my >= this.posy) && (my <= (this.posy + this.h)));
    }
}

class Oval extends DrawingObjects
{
    constructor (px, py, r, hs, vs, c) {
        super(px, py, 'O');
        this.r = r;
        this.radsq = r * r;
        this.hor = hs;
        this.ver = vs;
        this.color = c;
    }

    mouseOver (mx, my) {
        let x1 = 0;
        let y1 = 0;
        let x2 = (mx - this.posx) / this.hor;
        let y2 = (my - this.posy) / this.ver;

        return (this.sqDist(x1,y1,x2,y2) <= (this.radsq));
    }

    draw (cnv) {
        let ctx = cnv.getContext("2d");

        ctx.save();
        ctx.translate(this.posx,this.posy);
        ctx.scale(this.hor,this.ver);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.r, 0, 2*Math.PI, true);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}


class Heart extends DrawingObjects
{
    constructor (px, py, w, c) {
        super(px, py, 'H');
        this.h = w * 0.7;
        this.drx = w / 4;
        this.radsq = this.drx * this.drx;
        this.ang = .25 * Math.PI;
        this.color = c;
    }

    outside (x, y, w, h, mx, my) {
        return ((mx < x) || (mx > (x + w)) || (my < y) || (my > (y + h)));
    }

    draw (cnv) {
        let leftctrx = this.posx - this.drx;
        let rightctrx = this.posx + this.drx;
        let cx = rightctrx + this.drx * Math.cos(this.ang);
        let cy = this.posy + this.drx * Math.sin(this.ang);
        let ctx = cnv.getContext("2d");

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.posx, this.posy);
        ctx.arc(leftctrx, this.posy, this.drx, 0, Math.PI - this.ang, true);
        ctx.lineTo(this.posx, this.posy + this.h);
        ctx.lineTo(cx,cy);
        ctx.arc(rightctrx, this.posy, this.drx, this.ang, Math.PI, true);
        ctx.closePath();
        ctx.fill();
    }

    mouseOver (mx, my) {
        let leftctrx = this.posx - this.drx;
        let rightctrx = this.posx + this.drx;
        let qx = this.posx - 2 * this.drx;
        let qy = this.posy - this.drx;
        let qwidth = 4 * this.drx;
        let qheight = this.drx + this.h;

        let x2 = this.posx;
        let y2 = this.posy + this.h;
        let m = (this.h) / (2 * this.drx);

        //quick test if it is in bounding rectangle
        if (this.outside(qx, qy, qwidth, qheight, mx, my)) {
            return false;
        }

        //compare to two centers
        if (this.sqDist (mx, my, leftctrx, this.posy) < this.radsq) return true;
        if (this.sqDist(mx, my, rightctrx, this.posy) < this.radsq) return true;

        // if outside of circles AND less than equal to y, return false
        if (my <= this.posy) return false;

        // compare to each slope
        // left side
        if (mx <= this.posx) {
            return (my < (m * (mx - x2) + y2));
        } else {  //right side
            m = -m;
            return (my < (m * (mx - x2) + y2));
        }
    }
}

class Bear extends DrawingObjects {
    constructor (px, py, r, c) {
        super(px, py, 'B');
        this.r = r;
        this.radsq = r * r;
        this.color = c;
    }

    mouseOver (mx, my) {
        let x1 = 0;
        let y1 = 0;
        let x2 = (mx - this.posx);
        let y2 = (my - this.posy);

        return (this.sqDist(x1,y1,x2,y2) <= (this.radsq));
    }

    draw (cnv) {

        this.head = new Oval(this.posx, this.posy, this.r, 1, 0.95, this.color);
        this.earLeft = new Oval(this.posx - .75*this.r, this.posy- .63*this.r, this.r/2, 1, 0.88, this.color);
        this.earRight = new Oval(this.posx + .75*this.r, this.posy- .63*this.r, this.r/2, 1, 0.88, this.color);
        this.earLeftIn= new Oval(this.posx - .75*this.r, this.posy- .63*this.r, this.r/4.5, 1, 0.88, "#f39c12");
        this.earRightIn = new Oval(this.posx + .75*this.r, this.posy- .63*this.r, this.r/4.5, 1, 0.88, "#f39c12");
        this.eyeRight = new Oval(this.posx + this.r/3, this.posy - this.r/5.5, this.r/8, 1, 1, "black");
        this.eyeLeft = new Oval(this.posx - this.r/3, this.posy - this.r/5.5, this.r/8, 1, 1, "black");
        this.eyeLeftIn = new Oval(this.posx - .38*this.r, this.posy - .25*this.r, this.r/25, 1, 1, "white");
        this.eyeRightIn = new Oval(this.posx + .29*this.r, this.posy - .25*this.r, this.r/25, 1, 1, "white");
        this.nose = new Oval(this.posx, this.posy + this.r/6, this.r/3.5, 1, .78, "black");
        this.noseIn = new Oval(this.posx - this.r/7, this.posy + .11*this.r, this.r/20, 1, 1, "white");

        let ctx = cnv.getContext("2d");

        this.earLeft.draw(cnv);
        this.earLeftIn.draw(cnv);
        this.earRight.draw(cnv);
        this.earRightIn.draw(cnv);
        this.head.draw(cnv);
        this.eyeLeft.draw(cnv);
        this.eyeLeftIn.draw(cnv);
        this.eyeRight.draw(cnv);
        this.eyeRightIn.draw(cnv);
        
        this.nose.draw(cnv);
        this.noseIn.draw(cnv);

        ctx.beginPath();
        ctx.moveTo(this.posx,this.posy + this.r/3);
        ctx.bezierCurveTo(this.posx, this.posy + this.r/1.4, this.posx + this.r/2.3, this.posy + this.r/1.8, this.posx + this.r/2.3, this.posy + this.r/2.2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.posx,this.posy + this.r/3);
        ctx.bezierCurveTo(this.posx, this.posy + this.r/1.4, this.posx - this.r/2.3, this.posy + this.r/1.8, this.posx - this.r/2.3, this.posy + this.r/2.2);
        ctx.stroke();
    }
    setPos(x, y){
        this.posx = x;
        this.posy = y;
        this.head.setPos(x, y);
        this.earLeft.setPos(x - .75*this.r/4, y - .75*this.r);
        this.earRight.setPos(x + .75*this.r/4, this.y - .75*this.r);
        this.orelhaED.setPos(x - .75*this.r/4, y - .75*this.r);
        this.orelhaDD.setPos(x + .75*this.r/4, y - .75*this.r);
        this.olhoD.setPos(x + this.r/3, y -this.r/3);
        this.olhoE.setPos(x - this.r/3, y - this.r/3);
        this.olhoED.setPos(x - .4 * this.r/3, y - .4*this.r);
        this.olhoDD.setPos(x + .27*this.r/3, y - .4*this.r);
        this.nariz.setPos(x, y + this.r/4);
        this.narizD.setPos(x - this.r/10, y +.185 * this.r);
    }
}

class Ghost extends DrawingObjects
{
    constructor () {
        super(px, py, 'G');

    }

    mouseOver (mx, my) {

    }

    draw (cnv) {
        let ctx = cnv.getContext("2d");


    }
}


