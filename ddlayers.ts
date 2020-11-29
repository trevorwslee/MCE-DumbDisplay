

//% color=#770077 icon="\uf14d" block="DDLayers"
//% groups=['Layer', 'Led Layer', 'Experimental']
namespace ddlayers {

    //% block='create a LED layer with %numRows row(s) and %numCols column(s)'
    //% numRows.min=1 numRows.defl=1 numCols.min=1 numCols.defl=1
    //% group='Layer'
    export function setupLedLayer(numRows: number = 1, numCols: number = 1): ddlayers.LedLayer {
        let layerId = (_next_leyer_id++).toString()
        //_setup(layerId, "led", numRows, numCols)
        // _sendPartCommand1(layerId + ".SU", "led")
        // _sendPartCommand2(NO_COMMAND_IN, numRows.toString(), numCols.toString())
        // _sendCommand0((NO_COMMAND_IN))
        return new ddlayers.LedLayer(layerId, numRows, numCols, numRows >= numCols)
    }
    
    let _next_leyer_id = 3

    class DDLayer extends dumbdisplay.Layer {
        protected _ddHelper: dumbdisplay.DDHelper
        public constructor(layerId: string) {
            super(layerId)
            this._ddHelper = new dumbdisplay.DDHelper(this)
        }
    }

    export class LedLayer extends DDLayer {
        private horizontal: boolean
        public constructor(layerId: string, numRows: number, numCols: number, horizontal: boolean) {
            super(layerId)
            this.horizontal = horizontal
            this._ddHelper.setup("led", numRows, numCols)
        }
        //% block='turn led x %x y %y ON'
        //% group='Led Layer'
        public ledOn(x: number = 0, y: number = 0) {
            this._ddHelper.sendCommand2("ledon", x.toString(), y.toString())
        }
        //% block='turn led x %x y %y OFF'
        //% group='Led Layer'
        public ledOff(x: number = 0, y: number = 0) {
            this._ddHelper.sendCommand2("ledoff", x.toString(), y.toString())
        }
        //% block='toggle led x %x y %y'
        //% group='Led Layer'
        public ledToggle(x: number = 0, y: number = 0) {
            this._ddHelper.sendCommand2("ledtoggle", x.toString(), y.toString())
        }
        //% block='turn on %count led(s) like a bar'
        //% group='Led Layer'
        public ledBar(count: number) {
            let cmd = this.horizontal ? "ledhoribar" : "ledvertbar"
            this._ddHelper.sendCommand1(cmd, count.toString())
        }
        //% block='set led ON color %color'
        //% color.shadow="colorNumberPicker"
        //% group='Led Layer'
        public ledOnColorNum(color: number) {
            this._ddHelper.sendCommand1("ledoncolor", color.toString())
        }
        //% block='set led ON color %color'
        //% group='Led Layer'
        public ledOnColor(color: string) {
            this._ddHelper.sendCommand1("ledoncolor", color)
        }
        //% block='set led OFF color %color'
        //% color.shadow="colorNumberPicker"
        //% group='Led Layer'
        public ledOffColorNum (color: number) {
            this._ddHelper.sendCommand1("ledoffcolor", color.toString())
        }
        //% block='set led OFF color %color'
        //% group='Led Layer'
        public ledOffColor(color: string) {
            this._ddHelper.sendCommand1("ledoffcolor", color)
        }
    }

}
