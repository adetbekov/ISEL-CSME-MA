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
    setPos(x, y){
        this.posx = x;
        this.posy = y;
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

function shadeColor(color, percent) {  
    var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
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
        this.earLeftIn= new Oval(this.posx - .75*this.r, this.posy- .63*this.r, this.r/4.5, 1, 0.88, shadeColor(this.color, 35));
        this.earRightIn = new Oval(this.posx + .75*this.r, this.posy- .63*this.r, this.r/4.5, 1, 0.88, shadeColor(this.color, 35));
        this.eyeRight = new Oval(this.posx + this.r/3, this.posy - this.r/5.5, this.r/8, 1, 1, "black");
        this.eyeLeft = new Oval(this.posx - this.r/3, this.posy - this.r/5.5, this.r/8, 1, 1, "black");
        this.eyeLeftIn = new Oval(this.posx - .38*this.r, this.posy - .25*this.r, this.r/25, 1, 1, "white");
        this.eyeRightIn = new Oval(this.posx + .29*this.r, this.posy - .25*this.r, this.r/25, 1, 1, "white");
        this.nose = new Oval(this.posx, this.posy + this.r/4, this.r/3.5, 1, .78, "black");
        this.noseIn = new Oval(this.posx - this.r/7, this.posy + .15*this.r, this.r/20, 1, 1, "white");
        this.muzzle = new Oval(this.posx, this.posy + this.r/2.2, this.r/1.6, 1, .78, shadeColor(this.color, 35));

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
        
        this.muzzle.draw(cnv);
        this.nose.draw(cnv);
        this.noseIn.draw(cnv);

        ctx.beginPath();
        ctx.moveTo(this.posx,this.posy + this.r/3);
        ctx.bezierCurveTo(this.posx, this.posy + this.r/1.3, this.posx + this.r/2.3, this.posy + this.r/1.6, this.posx + this.r/2.3, this.posy + this.r/2.2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.posx,this.posy + this.r/3);
        ctx.bezierCurveTo(this.posx, this.posy + this.r/1.3, this.posx - this.r/2.3, this.posy + this.r/1.6, this.posx - this.r/2.3, this.posy + this.r/2.2);
        ctx.stroke();
    }
    setPos(x, y){
        this.posx = x;
        this.posy = y;
    }
}

class Ghost extends DrawingObjects
{
    constructor (px, py, w, h, c) {
        super(px, py, 'G');
        this.color = c;
        this.w = w;
        this.h = h;

    }

    mouseOver (mx, my) {
        return ((mx >= this.posx - this.w) && (mx <= (this.posx + this.w)) && (my >= this.posy - this.h) && (my <= (this.posy + this.h)));
    }

    draw (cnv) {

        this.ghostHead = new Oval(this.posx, this.posy, this.w, 1, 1, this.color);
        this.ghostRigthEye = new Oval(this.posx + this.w/1.6, this.posy + this.h/10, this.w/4, 1, 1, "white");
        this.ghostLeftEye = new Oval(this.posx - this.w/6, this.posy + this.h/10, this.w/4, 1, 1, "white");
        this.ghostRigthEyeBlack = new Oval(this.posx + this.w/2, this.posy + this.h/10, this.w/7, 0.8, 1, "black");
        this.ghostLeftEyeBlack = new Oval(this.posx - this.w/3.3, this.posy + this.h/10, this.w/7, 0.8, 1, "black");

        let ctx = cnv.getContext("2d");

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.posx - this.w, this.posy, this.w*2, this.h);
        ctx.closePath();

        this.ghostHead.draw(cnv);
        this.ghostRigthEye.draw(cnv);
        this.ghostLeftEye.draw(cnv);
        this.ghostRigthEyeBlack.draw(cnv);
        this.ghostLeftEyeBlack.draw(cnv);


        ctx.beginPath();
        ctx.moveTo(this.posx - this.w, this.posy + this.h);
        ctx.lineTo(this.posx - .6*this.w, this.posy + this.h/2); 
        ctx.lineTo(this.posx - .3*this.w, this.posy + this.h);
        ctx.closePath();

        ctx.fillStyle = "white";
        ctx.fill();


        ctx.beginPath();
        ctx.moveTo(this.posx, this.posy + this.h/2);
        ctx.lineTo(this.posx - .35*this.w, this.posy + this.h);
        ctx.lineTo(this.posx + .4*this.w, this.posy + this.h);
        ctx.closePath();
        ctx.fillStyle = "white";
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.posx + .6*this.w, this.posy + this.h/2);
        ctx.lineTo(this.posx + .3*this.w, this.posy + this.h);
        ctx.lineTo(this.posx + this.w, this.posy + this.h);
        ctx.closePath();
        ctx.fillStyle = "white";
        ctx.fill();



    }

    setPos(x, y) {
        this.posx = x;
        this.posy = y;
        // this.ghostHead.setPos(x, y);
        // this.ghostLeftEye.setPos(x - this.w/2, y - this.h/10);
        // this.ghostRigthEye.setPos(x + this.w/2, y - this.h/10);
        // this.ghostLeftEyeBlack.setPos(x + this.w/2, y + this.h/10);
        // this.ghostRigthEyeBlack.setPos(x - this.w/2, y + this.h/10);
    }
}

class Virus extends DrawingObjects
{
    constructor (px, py, w, c) {
        super(px, py, 'V');
        this.color = c;
        this.w = w;
        this.matrix = [
            "0000000000000",
            "0001000001000",
            "0000100010000",
            "0001111111000",
            "0011011101100",
            "0111111111110",
            "0101011101010",
            "0101000001010",
            "0000110110000",
            "0000000000000"
        ]
    }

    mouseOver (mx, my) {
        return ((mx >= this.posx) && (mx <= (this.posx + this.w * this.matrix[0].length)) && (my >= this.posy) && (my <= (this.posy + this.w * this.matrix.length)));
    }

    draw (cnv) {

        let matrix = this.matrix

        let drawMatrix = new Array();

        for(let i = 0; i < matrix.length; i++) {
            drawMatrix[i] = new Array();
            for(let j = 0; j < matrix[0].length; j++) {
                if(matrix[i][j] != "0") {
                    drawMatrix[i][j] = new Rect(this.posx + this.w * j, this.posy + this.w * i, this.w, this.w, this.color);
                }
            }
        }

        let ctx = cnv.getContext("2d");

        for(let i = 0; i < matrix.length; i++) {
            for(let j = 0; j < matrix[0].length; j++) {
                if(drawMatrix[i][j]){
                    drawMatrix[i][j].draw(cnv);
                }
            }
        }
    }

    setPos(x, y) {
        this.posx = x;
        this.posy = y;

        this.ghostHead.setPos(x, y);
        this.ghostLeftEye.setPos(x - this.w/2, y - this.h/10);
        this.ghostRigthEye.setPos(x + this.w/2, y - this.h/10);
        this.ghostLeftEyeBlack.setPos(x + this.w/2, y + this.h/10);
        this.ghostRigthEyeBlack.setPos(x - this.w/2, y + this.h/10);
    }
}

class Batman extends DrawingObjects
{
    constructor (px, py, w, c) {
        super(px, py, 'M');
        this.color = c;
        this.w = w;
        this.matrix = [
            "11111111111111111111111111",
            "11111100111111111100111111",
            "11110001111100111110001111",
            "11000001111000011110000011",
            "10000000111000011100000001",
            "10000000000000000000000001",
            "00000000000000000000000000",
            "00000000000000000000000000",
            "10000000000000000000000001",
            "10000110001000010001100001",
            "11001111111100111111110011",
            "11100111111100111111100111",
            "11111111111111111111111111"
        ]
    }

    mouseOver (mx, my) {
        return ((mx >= this.posx) && (mx <= (this.posx + this.w * this.matrix[0].length)) && (my >= this.posy) && (my <= (this.posy + this.w * this.matrix.length)));
    }

    draw (cnv) {

        let matrix = this.matrix

        let drawMatrix = new Array();

        for(let i = 0; i < matrix.length; i++) {
            drawMatrix[i] = new Array();
            for(let j = 0; j < matrix[0].length; j++) {
                if(matrix[i][j] == "0") {
                    drawMatrix[i][j] = new Rect(this.posx + this.w * j, this.posy + this.w * i, this.w, this.w, this.color);
                }
            }
        }

        let ctx = cnv.getContext("2d");

        for(let i = 0; i < matrix.length; i++) {
            for(let j = 0; j < matrix[0].length; j++) {
                if(drawMatrix[i][j]){
                    drawMatrix[i][j].draw(cnv);
                }
            }
        }
    }

    setPos(x, y) {
        this.posx = x;
        this.posy = y;
    }
}

class Robot extends DrawingObjects
{
    constructor (px, py, w, c) {
        super(px, py, 'S');
        this.color = c;
        this.w = w;
        this.matrix = [
            "111111111111111111111111111111111111111111111111111111111111111111111111111111111",
            "111111111111111111111111111111111111111111111111111111111111111111111111111111111",
            "111111111111111111111111111111111111111100000111111111111111111111111111111111111",
            "111111111111111111111111111111111111000000000000011111111111111111111111111111111",
            "111111111111111111111111111111111000001111111111100111111111111111111111111111111",
            "111111111111111111111111111111100000111000001111111001111111111111111111111111111",
            "111111111111111111111111111111000000000000001111111110111111111111111111111111111",
            "111111111111111111111111111110000010000000000111111111011111111111111111111111111",
            "111111111111111111111111111100000110000000000111111111101111111111111111111111111",
            "111111111111111111111111111000001110000000000011111111110111111111111111111111111",
            "111111111111111111111111110000011110000000000011111111111011111111111111111111111",
            "111111111111111111111111100000011110000000000011111100010001111111111111111111111",
            "111111111111111111111111000000111110000000000011101100010001111111111111111111111",
            "111111111111111111111111000000111110000000111111000110001000111111111111111111111",
            "111111111111111111111110000000110001101110000011100110001000011111111111111111111",
            "111111111111111111111110000000000001101000000001111110000000011111111111111111111",
            "111111111111111111111110000000100001001000000001111111111100001111111111111111111",
            "111111111111111111111100000000100001001000000001111000000000001111111111111111111",
            "111111111111111111111100000000100001000000000000000001111111001111111111111111111",
            "111111111111111111111100000000100001001100000001111111101000001111111111111111111",
            "111111111111111111111100000000100001100000111111000000000000011111111111111111111",
            "111111111111111111111100000000100000001111110000000000000011111111111111111111111",
            "111111111111111111111100000000000011111111000000001111111111111111111111111111111",
            "111111111111111111111100000000011111111111000111111110000000011111111111111111111",
            "111111111111111111111100000001111111111111111111111000000000011111111111111111111",
            "111111111111111111111100000001111111111111110000000000000111111111111111111111111",
            "111111111111111111111100000111111111111111100000111111111111111110111111111111111",
            "111111111111111111111100011111111111111111111111111111111111111111111111111111111",
            "111111111111111111111111111111111111111111111111111111100110000111111111111111111",
            "111111111111111111111111111111111111111111111111100000000000000111111111111111111",
            "111111111111111111111111111111111111111111111110000000000111111111111111111111111",
            "111111111111111111111111111111111111111111110000000001111111111111111111111111111",
            "111111111111111111111111111111111111111111111111111111111111111111111111111111111",
            "111111111111111111111111111111111111111111111111111111111101111111111111111111111",
            "111111111111111111111111111111111111111111111111111110000000111111100111111111111",
            "111111111111111111111111111111111111111111111111111110010000111111100111111111111",
            "111111111111111111111111111111111111111111111111111110011000111111100011111111111",
            "111111111111111111111111111111111111111111111111111111011111111111100111111111111",
            "111111111111111111110011111111111111111111111111111111011111011111110111111111111",
            "111111111111111111111001111111111111111111111111111111011100011111110111111111111",
            "111111111111111111111001111111111111111111111111111111000100011111110011111111111",
            "111111111111111111111101111111111111111111111111111111100000011111110011111111111",
            "111111111111111111101001111111111111111111111111111111100000011111110011111111111",
            "111111111111111111110001111111111111111111111111111111101110101111111001111111111",
            "111111111111111111100001111111111111111111111111111111100111101111111000111111111",
            "111111111111111111100001111111111111111111111111111111110111101111111001111111111",
            "111111111111111111100001011111111111111111111111111111110111101111111001111111111",
            "111111111111111111100001011111111111111111111111111111110000000111111111111111111",
            "111111111111111111100001111111111111111111111111111111110000011111111111111111111",
            "111111111111111111100001111111111111111111111111111111111111111111111111111111111",
            "111111111111111111100000111111100111111111111111111111111111111111111111111111111",
            "111111111111111111000011111111000111111111111111111111111111111111111111111111111",
            "111111111111111111000011100000000111111111111111111111111111111111111111111111111",
            "111111111111111111000010000000000111111111111111111111111111111111111111111111111",
            "111111111111111111000010000000000011111110110111111111111111111011111111111111111",
            "111111111111111110000111111110000011110000100111111111111111000011111111111111111",
            "111111111111111110000111111111000011110000101011111111111100111001111111111111111",
            "111111111111111110000111111111001111110000001011111111111101111101111111111111111",
            "111111111111111110000111111111111111110000001011111111111101111101111111111111111",
            "111111111111111110000111111111111111111000010011110011111111111001111111111111111",
            "111111111111111100000111111111111111111000010001111111111110111100111111111111111",
            "111111111111111100001111111111111111111000010101111111111110111000111111111111111",
            "111111111111111100001111111111111111111000111111111111111110000001100011111111111",
            "111111111111111110001111111111111111111101111111111111111110100010111111111111111",
            "111111111111111111001111111111111111111010111111111110111111011111111111111111111",
            "111111111111111111111111111111111111111111111111111111001111111111111111111111111",
            "111111111111111111111111111111111111111101111111111111111111111111111111111111111",
            "111111111111011111111111110011111111111111111111111111111111111111111111111111111",
            "111111111111000011111111110011111111110000111111111111111111111111111111111111111",
            "111111111111100011111111111111111000000011111111111111111111111111111111111111111",
            "111111111111110011111111111111111111111111111111111111111111001111111011111111111",
            "111111111111111111111111111111111111111111111111111111100000001111110011111111111",
            "111111111111111111111111111111111111111111111111110000000000111011100111111111111",
            "111111111111111111111111111111111111111111111110000000011111111110001100111111111",
            "111111111111111111111111111110111011111111111111000000111111111000000001111100111",
            "111111111111111111111111111110110011111111111111000000011111111110000100000000111",
            "111111111111111111111111111110111011111111111111111001111111110000001000000011111",
            "110111111111111111111111111110111111111111111111111111111111111100000000111111111",
            "110011111111111111111111111110111111111111111111111111111111111110001111111111111",
            "111001111111111111111110011100111011111111111111111111111111111111111111111111111",
            "111100111111111111111110011100111011111111111111111111111111111111111111111111111",
            "111110011111111111111110001110111111111111111111111111111111111111111111111111111",
            "111111001111111111111110000110111111111111111111111111111111111111111111111111111",
            "111111100111111111111111000000010011111111111111111111111111111111111111111111111",
            "111111110011111111111111000000000011111111111111111111111111111111111111111111111",
            "111111111001111111111111000000000110111111101111111111111111111111111111111111111",
            "111111111100111111111111100011100000111111100111111111111111111111111111111111111",
            "111111111110011111111111100000000011111111110011111111111111111111111111111111111",
            "111111111111001111111100000000011111111111111101111111111111111111111111111111111",
            "111111111111100111100000000111111111111111111110011111111111111111111111111111111",
            "111111111111110000000011111111111111111111111111001111111111111111111111111111111",
            "111111111111111100011111111111111111111111111111100111111111111111111111111111111",
            "111111111111111111111111111111111111111111111111110011111111111111111100011111111",
            "111111111111111111111111111111111111111111111111111001111111111100100000111111111",
            "111111111111111111111111111111111111111111111111111100111111111000000111111111111",
            "111111111111111111111111111111111111111111111111111110011100000001111111111111111",
            "111111111111111111111111111111111111111111111111111111100000011111111111111111111",
            "111111111111111111111111111111111111111111111111111111110111111111111111111111111",
            "111111111111111111111111111111111111111111111111111111111111111111111111111111111",
            "111111111111111111111111111111111111111111111111111111111111111111111111111111111"
        ]
    }

    mouseOver (mx, my) {
        return ((mx >= this.posx) && (mx <= (this.posx + this.w * this.matrix[0].length)) && (my >= this.posy) && (my <= (this.posy + this.w * this.matrix.length)));
    }

    draw (cnv) {

        let matrix = this.matrix

        let drawMatrix = new Array();

        for(let i = 0; i < matrix.length; i++) {
            drawMatrix[i] = new Array();
            for(let j = 0; j < matrix[0].length; j++) {
                if(matrix[i][j] == "0") {
                    drawMatrix[i][j] = new Rect(this.posx + this.w * j, this.posy + this.w * i, this.w, this.w, this.color);
                }
            }
        }

        let ctx = cnv.getContext("2d");

        for(let i = 0; i < matrix.length; i++) {
            for(let j = 0; j < matrix[0].length; j++) {
                if(drawMatrix[i][j]){
                    drawMatrix[i][j].draw(cnv);
                }
            }
        }
    }

    setPos(x, y) {
        this.posx = x;
        this.posy = y;
    }
}

class Text extends DrawingObjects {

    constructor (px, py, w, h, text, c) {
        super(px, py, 'T');
        this.w = w;
        this.h = h;
        this.text = text;
        this.color = c;
    }

    draw (cnv) {
        let ctx = cnv.getContext("2d");
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.posx, this.posy);

    }

    mouseOver(mx, my) {
        return ((mx >= this.posx) && (mx <= (this.posx + this.w)) && (my >= this.posy - this.h) && (my <= (this.posy)));

    }
    setPos(x, y){
        this.posx = x;
        this.posy = y;
    }
}