//% color=#007700 icon="\uf14d" block="DD.Turtle"
//% groups=['Setup', 'Movement', 'Drawing', 'Setting', 'Advanced', 'Experimental']
namespace ddturtle {

    //% block='setup Turtle layer width %width and height %height'
    //% group='Setup'
    //% width.min=5 width.defl=50 height.min=5 height.defl=50 
    //% weight=100
    export function setup(width: number, height: number) {
        _width = width
        _height = height
        _ddHelper.setup(dumbdisplay.LAYER_TYPE_TURTLE, width, height)
    }

    //% block 
    //% group='Movement'
    export function forward(distance: number) {
        _ddHelper.sendCommand1("fd", distance.toString())
    }
    //% block
    //% group='Movement'
    export function backward(distance: number) {
        _ddHelper.sendCommand1("bk", distance.toString())
    }
    //% block='turn right %angle °' 
    //% group='Movement'
    export function right(angle: number) {
        _ddHelper.sendCommand1("rt", angle.toString())
    }
    //% block='turn left %angle °' 
    //% group='Movement'
    export function left(angle: number) {
        _ddHelper.sendCommand1("lt", angle.toString())
    }
    //& block='set heading %angle °'
    //% group='Drawing'
    export function setHeading(angle: number) {
        _ddHelper.sendCommand1("seth", angle.toString())
    }
    //% block
    //% group='Movement'
    export function home() {
        _ddHelper.sendCommand0("home")
    }
    //% block='goto x %x y %y'
    //% group='Movement'
    export function goto(x: number, y: number) {
        _ddHelper.sendCommand2("goto", x.toString(), y.toString())
    }
    //% block='draw circle with radius %radius'
    //% group='Drawing'
    export function circle(radius: number) {
        _ddHelper.sendCommand1("circle", radius.toString())
    }
    //% block='draw "centered" circle with radius %radius'
    //% advanced=true
    //% group='Drawing'
    export function centeredCircle(radius: number) {
        _ddHelper.sendCommand1("ccircle", radius.toString())
    }
    //% block='draw rectangle with width %width height %height'
    //% group='Drawing'
    export function rectangle(width: number, height: number) {
        _ddHelper.sendCommand2("rect", width.toString(), height.toString())
    }
    //% block='draw "centered" rectangle with width %width height %height'
    //% advanced=true
    //% group='Drawing'
    export function centeredRectangle(width: number, height: number) {
        _ddHelper.sendCommand2("crect", width.toString(), height.toString())        
    }
    //% block='draw oval with width %width height %height'
    //% group='Experimental'
    export function oval(width: number, height: number) {
        _ddHelper.sendCommand2("oval", width.toString(), height.toString())
    }
    //% block='draw "centered" oval with width %width height %height'
    //% advanced=true
    //% group='Experimental'
    export function centeredOval(width: number, height: number) {
        _ddHelper.sendCommand2("coval", width.toString(), height.toString())        
    }
    //% block='draw triangle given side 1 %side1 angle %angle side 2 %side2'
    //% group='Drawing'
    export function triangle(side1: number, angle: number, side2: number) {
        _ddHelper.sendCommand3("trisas", side1.toString(), angle.toString(), side2.toString())
    }
    //% block='draw isosceles triangle of side %side and angle %angle'
    //% advanced=true
    //% group='Drawing'
    export function isoscelesTriangle(side: number, angle: number) {
        _ddHelper.sendCommand2("trisas", side.toString(), angle.toString())
    }
    //% block='draw polygon of side %side and vertex count %vertexCount'
    //% vertexCount.min=3
    //% group='Drawing'
    export function polygon(side: number, vertexCount: number) {
        _ddHelper.sendCommand2("poly", side.toString(), vertexCount.toString())
    }
    //% block='draw polygon (surround an imaginary "centered" circle with radius %radius) and vertex count %vertexCount'
    //% vertexCount.min=3
    //% advanced=true
    //% group='Drawing'
    export function centeredPolygon(radius: number, vertexCount: number) {
        _ddHelper.sendCommand2("cpoly", radius.toString(), vertexCount.toString())
    }
    //% block='draw polygon (insde an imaginary circle with radius %radius) and vertex count %vertexCount'
    //% vertexCount.min=3
    //% advanced=true
    //% group='Experimental'
    export function centeredPolygonInside(radius: number, vertexCount: number) {
        _ddHelper.sendCommand2("cpolyin", radius.toString(), vertexCount.toString())
    }
    //% block='draw dot with size %size'
    //% size.min=1 size.defl=1
    //% group='Drawing'
    export function dot(size: number = 1) {
        _ddHelper.sendCommand1("dot", size.toString())
    }
    //% block='draw dot with size %size and color %color'
    //% size.min=1 size.defl=1
    //% color.shadow="colorNumberPicker"
    //% group='Drawing'
    export function dotOfColorNum (size: number = 1, color: number) {
        _ddHelper.sendCommand2("dot", size.toString(), color.toString())
    }
    //% block='draw dot with size %size and color %color'
    //% size.min=1 size.defl=1
    //% group='Drawing'
    export function dotOfColor(size: number = 1, color: string) {
        _ddHelper.sendCommand2("dot", size.toString(), color)
    }
    //% block
    //% group='Drawing'
    export function write(text: string) {
        _ddHelper.sendCommand1("write", text)
    }
    //% block
    //% group='Drawing'
    export function drawText(text: string) {
        _ddHelper.sendCommand1("drawtext", text)
    }
    //% block
    //% group='Setting'
    export function penUp(): void {
        _ddHelper.sendCommand0("pu")
    }
    //% block
    //% group='Setting'
    export function penDown(): void {
        _ddHelper.sendCommand0("pd")
    }
    //% block
    //% size.min=1 size.defl=1
    //% group='Setting'
    export function penSize(size: number): void {
        _ddHelper.sendCommand1("pensize", size.toString())
    }
    //% block='set pen color %color' 
    //% color.shadow="colorNumberPicker"
    //% group='Setting'
    export function penColorNum(color: number): void {
        _ddHelper.sendCommand1("pencolor", color.toString())
    }
    //% block='set pen color %color' 
    //% group='Setting'
    export function penColor(color: string): void {
        _ddHelper.sendCommand1("pencolor", color)
    }
    //% block='set fill color %color' 
    //% color.shadow="colorNumberPicker"
    //% group='Setting'
    export function fillColorNum(color: number): void {
        _ddHelper.sendCommand1("fillcolor", color.toString())
    }
    //% block='set fill color %color' 
    //% group='Setting'
    export function fillColor(color: string): void {
        _ddHelper.sendCommand1("fillcolor", color)
    }
    //% block='set no fill color' 
    //% group='Experimental'
    export function noFillColor(): void {
        _ddHelper.sendCommand0("nofillcolor")
    }
    //% block='set background color %color' 
    //% color.shadow="colorNumberPicker"
    //% group='Setting'
    export function bgColorNum(color: number): void {
        _ddHelper.sendCommand1("bgcolor", color.toString())
    }
    //% block='set background color %color' 
    //% group='Setting'
    export function bgColor(color: string): void {
        _ddHelper.sendCommand1("bgcolor", color)
    }

    //% block
    //% group='Drawing'
    export function beginFill(): void {
        _ddHelper.sendCommand0("begin_fill")
    }
    //% block
    //% group='Drawing'
    export function endFill(): void {
        _ddHelper.sendCommand0("end_fill")
    }

    //% block 
    //% group='Drawing'
    export function clear(): void {
        _ddHelper.sendCommand0("clear")
    }

    //% block="width"
    //% advanced=true
    export function width(): number { return _width }
    //% block="height"
    //% advanced=true
    export function height(): number { return _height }

    //% block
    //% group='Movement'
    //% advanced = true
    export function jumpTo(x: number, y: number) {
        _ddHelper.sendCommand2("jto", x.toString(), y.toString())
    }
    //% block
    //% advanced=true
    //% group='Movement'
    export function jumpHome() {
        _ddHelper.sendCommand0("jhome")
    }
    //% block='set pen filled'
    //% advance=true
    //% group='Advanced'
    export function penFilled(fillPen: boolean) {
        _ddHelper.sendCommand1("pfilled", fillPen ? "1" : "0")
    }
    //% block='set pen text size'
    //% penTextSize.min=1
    //% advance=true
    //% group='Advanced'
    export function penTextSize(size: number) {
        _ddHelper.sendCommand1("ptextsize", size.toString())
    }
    // //% block='set pen fill color %color'
    // //% advance=true
    // //% color.shadow="colorNumberPicker"
    // //% group='Advanced'
    // export function penFillColorNum(colornum: number) {
    //     _ddLayer.sendCommand1("pfillcolor", colornum.toString())
    // }
    // //% block='set pen fill color %color'
    // //% advance=true
    // //% group='Advanced'
    // export function penFillColor(color: string) {
    //     _ddLayer.sendCommand1("pfillcolor", color)
    // }
    // //% block='set no pen fill color'
    // //% advance=true
    // //% group='Advanced'
    // export function noPenFillColor() {
    //     _ddLayer.sendCommand0("pfillcolor")
    // }


    //% block='layer'
    //% advanced=true
    //% group='Advanced'
    export function layer():ddlayers.DDLayer { return _layer }


    const LAYER_ID = "2"


    // //% fixedInstance whenUsed
    // let _layer = new dumbdisplay.Layer(LAYER_ID)
    // //% fixedInstance whenUsed
    // let _ddHelper = new dumbdisplay.DDHelper(LAYER_ID)

    //% fixedInstance whenUsed
    let _layer = new ddlayers.DDLayer(LAYER_ID)
    let _ddHelper = _layer._ddHelper
    let _width = 0
    let _height = 0



}
