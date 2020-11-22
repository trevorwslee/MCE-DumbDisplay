

namespace ddlayers {

    export class DDLayer extends dumbdisplay.Layer {
        protected _ddHelper: dumbdisplay.DDHelper
        public constructor(layerId: string) {
            super(layerId)
            this._ddHelper = new dumbdisplay.DDHelper(this)
        }
    }

    export class LedLayer extends DDLayer {
        private horizontal: boolean
        public constructor(layerId: string, horizontal: boolean) {
            super(layerId)
            this.horizontal = horizontal
        }
        //% block="turn ON led x %x y %y on"
        //% advanced=true
        //% group='Led Layer'
        public ledOn(x: number = 0, y: number = 0) {
            this._ddHelper.sendCommand2("ledon", x.toString(), y.toString())
        }
        //% block="turn OFF led x %x y %y off"
        //% advanced=true
        //% group='Led Layer'
        public ledOff(x: number = 0, y: number = 0) {
            this._ddHelper.sendCommand2("ledoff", x.toString(), y.toString())
        }
        //% block="toggle led x %x y %y on"
        //% advanced=true
        //% group='Led Layer'
        public ledToggle(x: number = 0, y: number = 0) {
            this._ddHelper.sendCommand2("ledtoggle", x.toString(), y.toString())
        }
        //% block="toggle led x %x y %y on"
        //% advanced=true
        //% group='Led Layer'
        public ledGauge(value: number) {
            let cmd = this.horizontal ? "ledhorigauge" : "ledvertgauge"
            this._ddHelper.sendCommand1(cmd, value.toString())
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
