class model {
    constructor(){
        this.curves = [];
    }

    isEmpty(){
        return this.curves.length < 1;
    }

    getCurves(){
        return this.curves;
    }

    getBoundingBox(bbox){
        if (this.curves.length < 1) {
            bbox.xmin = 0.0;
            bbox.xmax = 10.0;
            bbox.ymin = 0.0;
            bbox.xmax = 10.0;
            return;
        }
        this.curves[0].getBoundingBox(bbox);
        for (let i = 0; i < this.curves.length; i++) {
            var bbox_c;
            this.curves[i].getBoundingBox(bbox_c)
            if (bbox_c.xmin < bbox.xmin) {
                bbox.xmin = bbox_c.xmin;
            }

            if (bbox_c.xmax > bbox.xmax) {
                bbox.xmax = bbox_c.xmax;
            }

            if (bbox_c.ymin < bbox.ymin) {
                bbox.ymin = bbox_c.ymin;
            }

            if (bbox_c.ymax > bbox.ymax) {
                bbox.ymax = bbox_c.ymax;
            }
        }
    }

    snapToCurve(pos, pick_tol){
        if (this.curves.length < 1) {
            return false;
        }

        var xC, yC;
        var xClst = pos.x;
        var yClst = pos.y;
        var id_target = -1;
        var dmin = pick_tol;
        var d;

        for (let i = 0; i < this.curves.length; i++) {
            xC = this.curves[i].getXinit();
            yC = this.curves[i].getYinit();

            if (Math.abs(pos.x - xC) < pick_tol && Math.abs(pos.y - yC) < pick_tol ) {
                d = Math.sqrt((pos.x - xC)*(pos.x - xC)+(pos.y - yC)*(pos.y - yC));

                if (d<dmin) {
                    xClst = xC;
                    yClst = yC;
                    dmin = d;
                    id_target = i;
                }
                continue;
            }

            xC = this.curves[i].getXend();
            yC = this.curves[i].getYend();

            if (Math.abs(pos.x - xC) < pick_tol && Math.abs(pos.y - yC) < pick_tol ) {
                d = Math.sqrt((pos.x - xC)*(pos.x - xC)+(pos.y - yC)*(pos.y - yC));
                if (d<dmin) {
                    xClst = xC;
                    yClst = yC;
                    dmin = d;
                    id_target = i;
                }
                continue;
            }
            xC = pos.x;
            yC = pos.y;
            d = this.curves[i].closestPoint({x: xC, y: yC});
            if (d<dmin) {
                xClst = xC;
                yClst = yC;
                dmin = d;
                id_target=i;
            }
        }
        
        if (id_target < 0) {
            return false;
        }
        pos.x = xClst;
        pos.y = yClst;
        return true;
    }

    insertCurve(curve){
        this.curves.push(curve);
    }

    selectFence(xmin, xmax, ymin, ymax){
        if (this.curves.length < 1) {
            return;
        }

        var inFence;
        var bbox = {};
        this.curves.forEach(curve => {
            curve.getBoundBox(bbox);
            (bbox.xmin < xmin || bbox.xmax > xmax || bbox.ymin < ymin || bbox.ymax > ymax) ? inFence = false : inFence = true;
            if (inFence) {
                curve.isSelected() ? curve.setSelected(false) : curve.setSelected(true);
            }//when implementation of shift key is done insert else{if(shiftkey){curve.setSelected(false)}}
        });
    }
}

export default model;