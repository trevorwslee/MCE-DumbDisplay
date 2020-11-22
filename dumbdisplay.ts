
//% color=#000077 icon="\uf14d" block="DumbDisplay"
//% groups=['Setup', 'Basic', 'Math', 'Layer', 'Advanced', 'Experimental', 'Led Layer']
namespace dumbdisplay {

    export const LAYER_TYPE_MB = "mb"
    export const LAYER_TYPE_TURTLE = "turtle"

    export const LOG_CONNECTION = true
    export const DEBUG_ON = true

    //% block
    //% group='Basic'
    //% shim=DumbDisplayCpp::getConnected
    export function connected() { return true }

    //% block="convert to color from R %r G %g B %b"
    //% advanced=true
    //% group='Advanced'
    //% r.min=0 r.max=255 g.min=0 g.max=255 b.min=0 b.max=255
    export function toColor(r: number, g: number, b: number): string {
        return r + "-" + g + "-" + b
    }


    //% block="on DumbDisplay reset"
    //% advanced=true
    //% group='Experimental'
    export function onReset(callback: () => void): void {
        _reset_callback = callback
    }

    // //% block='set background color %color' 
    // //% color.shadow="colorNumberPicker"
    // //% group='Basic'
    // export function backgroundColorNum(color: number): void {
    //     _sendCommand1("BGC", color.toString())
    // }
    // //% block='set background color %color' 
    // //% group='Basic'
    // export function backgroundColor(color: string): void {
    //     _sendCommand1("BGC", color)
    // }

    //% block='power up with Bluetooth %enableBluetooth and Serial %enableSerial'
    //% advanced=true
    //% group='Setup'
    export function powerUp(enableBluetooth: boolean = true, enableSerial: boolean = true) {
        let enableWhat = (enableBluetooth ? 1 : 0) + (enableSerial ? 2 : 0)
        _powerUp(enableWhat)
    }

    // //% block='set layer %layer visibility %visible'
    // //% group='Layer'
    // export function layerVisible(layer: dumbdisplay.Layer, visible: boolean) {
    //     _sendCommand1(layer.layerId + ".visible", visible ? "1" : "0")
    // }
 
    // //% block='set layer %layer opacity %opacity'
    // //% opacity.min=0 opacity.min=255 
    // //% group='Layer'
    // export function layerOpacity(layer: dumbdisplay.Layer, opacity: number) {
    //     _sendCommand1(layer.layerId + ".opacity", opacity.toString())
    // }

    //% block
    //% group='Layer'
    //% advanced=true
    export function removeLayer(layer: dumbdisplay.Layer) {
        _sendCommand0(layer.layerId + ".DEL")
    }
    export function removeAllLayers() {
        _sendCommand0("DELALL")
    }


    // //% block='create a LED layer with %numRows row(s) and %numCols column(s)'
    // //% numRows.min=1 numRows.defl=1 numCols.min=1 numCols.defl=1
    // //% group='Layer'
    // export function setupLedLayer(numRows: number = 1, numCols: number = 1): ddlayers.LedLayer {
    //     let layerId = (_next_leyer_id++).toString()
    //     _setup(layerId, "led", numRows, numCols)
    //     // _sendPartCommand1(layerId + ".SU", "led")
    //     // _sendPartCommand2(NO_COMMAND_IN, numRows.toString(), numCols.toString())
    //     // _sendCommand0((NO_COMMAND_IN))
    //     return new ddlayers.LedLayer(layerId, numRows >= numCols)
    // }

    //% block
    //% advanced=true
    //% group='Advanced'
    export function writeSerial(msg: string) {
        serial.writeString("// " + msg + "\n")
    }

    //% block='pin %pin pulse as buttom %button click'
    //% advanced=true
    //% group='Experimental'
    export function pinPulseAsButtonClick(pin: DigitalPin, button: Button) {
        let btn: EventBusSource
        if (button == Button.A)
            btn = EventBusSource.MICROBIT_ID_BUTTON_A
        else if (button == Button.B)
            btn = EventBusSource.MICROBIT_ID_BUTTON_B
        else
            btn = EventBusSource.MICROBIT_ID_BUTTON_AB
        pins.setPull(pin, PinPullMode.PullUp)
        pins.onPulsed(pin, PulseValue.Low, function () {
            control.raiseEvent(btn, EventBusValue.MICROBIT_BUTTON_EVT_CLICK)
        })
    }


    // export class Layer {
    //     public layerId: string
    //     public constructor(layerId: string) {
    //         this.layerId = layerId
    //     }
    //     //% block='set layer %layer visibility %visible'
    //     //% group='Layer'
    //     public layerVisible(visible: boolean) {
    //         _sendCommand1(this.layerId + ".visible", visible ? "1" : "0")
    //     }
    
    //     //% block='set layer %layer opacity %opacity'
    //     //% opacity.min=0 opacity.min=255 
    //     //% group='Layer'
    //     public layerOpacity(opacity: number) {
    //         _sendCommand1(this.layerId + ".opacity", opacity.toString())
    //     }
    // }

    // export class LedLayer extends Layer {
    //     public constructor(layerId: string) {
    //         super(layerId)
    //     }
    //     //% block="turn led x %x y %y on"
    //     //% advanced=true
    //     //% group='Led Layer'
    //     public ledOn(x: Number, y: Number) {
    //         _sendCommand2(this.layerId + ".ledon", x.toString(), y.toString())
    //     }
    //     //% block="turn led x %x y %y off"
    //     //% advanced=true
    //     //% group='Led Layer'
    //     public ledOff(x: Number, y: Number) {
    //         _sendCommand2(this.layerId + ".ledoff", x.toString(), y.toString())
    //     }
    // }



    const DD_SID = "Microbit"
    const INIT_COMMAND = ">init>"
    const ACK_INIT_COMMAND_DATA = "<init<\n"
    const RESET_REQUEST_DATA = "<reset?\n"

    const NO_COMMAND_IN = ""

    // export class Layer {
    //     public layerId: string
    //     public constructor(layerId: string) {
    //         this.layerId = layerId
    //     }
    //     //% block='set layer %layer visibility %visible'
    //     //% group='Layer'
    //     public layerVisible(visible: boolean) {
    //         _sendCommand1(this.layerId + ".visible", visible ? "1" : "0")
    //     }
    
    //     //% block='set layer %layer opacity %opacity'
    //     //% opacity.min=0 opacity.min=255 
    //     //% group='Layer'
    //     public layerOpacity(opacity: number) {
    //         _sendCommand1(this.layerId + ".opacity", opacity.toString())
    //     }
    // }


    export class DDHelper {
        private layerId: string
        public constructor(layer: dumbdisplay.Layer) {
            this.layerId = layer.layerId
        }
        public setup(layerType: string, width: number, height: number) {
            //_powerUp(DEF_ENABLE_WHAT)
            _setup(this.layerId, layerType, width, height)
        }
        public sendCommand0(cmd: string): boolean {
            return _sendCommand0(this.layerId + "." + cmd)
        }
        public sendCommand1(cmd: string, param: string): boolean {
            return _sendCommand1(this.layerId + "." + cmd, param)
        }
        public sendCommand2(cmd: string, param1: string, param2: string): boolean {
            return _sendCommand2(this.layerId + "." + cmd, param1, param2)
        }
        public sendCommand3(cmd: string, param1: string, param2: string, param3: string): boolean {
            return _sendCommand3(this.layerId + "." + cmd, param1, param2, param3)
        }
        public beginSendCommand(cmd: string): boolean {
            return _sendPartCommand0(this.layerId + "." + cmd)
        }
        public endSendCommand(): boolean {
            return _sendCommand0(NO_COMMAND_IN)
        }
        public partSendCommand1(param: string): boolean {
            return _sendPartCommand1(NO_COMMAND_IN, param)
        }
        public partSendCommand2(param1: string, param2: string): boolean {
            return _sendPartCommand2(NO_COMMAND_IN, param1, param2)
        }
        public partSendCommandMbLeds(mbLeds: string/*, width: number, height: number*/): boolean {
            return _sendPartCommandMbLeds(mbLeds, -1, -1)
            //return _sendPartCommandMbLeds(mbLeds, width, height)
        }
    }


    //% shim=DumbDisplayCpp::ddinit
    function _ddinit(enableWhat: number, onStart: Action, onStop: Action, onReceive: (data: string) => void) {
        _reset_callback = null  // actually, this is not necessary
        basic.showString("initialized")
        basic.showArrow(ArrowNames.North)
    }
    //% shim=DumbDisplayCpp::ddconnect
    function _ddconnect() {
    }
    //% shim=DumbDisplayCpp::sendCommand0
    function _sendCommand0(cmd: string): boolean {
        return true//ddmb.toggle(0, 0)
    }
    //% shim=DumbDisplayCpp::sendCommand1
    function _sendCommand1(cmd: string, param: string): boolean {
        return true 
    }
    //% shim=DumbDisplayCpp::sendCommand2
    function _sendCommand2(cmd: string, param1: string, param2: string): boolean {
        return true
    }
    //% shim=DumbDisplayCpp::sendCommand3
    function _sendCommand3(cmd: string, param1: string, param2: string, param3: string): boolean {
        return true
    }
    //% shim=DumbDisplayCpp::sendPartCommand0
    function _sendPartCommand0(cmd: string): boolean {
        return true
    }
    //% shim=DumbDisplayCpp::sendPartCommand1
    function _sendPartCommand1(cmd: string, param: string): boolean {
        return true
    }
    //% shim=DumbDisplayCpp::sendPartCommand2
    function _sendPartCommand2(cmd: string, param1: string, param2: string): boolean {
        return true
    }
    //% shim=DumbDisplayCpp::sendPartCommandMbLeds
    function _sendPartCommandMbLeds(mbLeds: string, width: number, height: number): boolean {
        return true
    }



    let _initialized: boolean = false
    let _reset_callback: () => void

 
    function _setup(layerId: string, layerType: string, width: number, height: number) {
        _powerUp(DEF_ENABLE_WHAT)
        if (!connected())
            _connect()
        _sendCommand3(layerId + ".SU", layerType, width.toString(), height.toString())
    }

    function _connect() {
        if (LOG_CONNECTION) {
            writeSerial("% establish connection ...")
        }
        let round = 0
        while (!_initialized) {
            if (!connected())
                _ddconnect()
            if (!connected()) {
                if (LOG_CONNECTION) {
                    writeSerial("% ... connecting ...")
                }
                basic.showIcon(IconNames.Heart)
            } else {
                if (LOG_CONNECTION) {
                    writeSerial("% ... hand shaking ...")
                }
                basic.showIcon(IconNames.Diamond)
            }
            basic.pause(400)
            if (_initialized) break    
            if (!connected())
                basic.showIcon(IconNames.SmallHeart)
            else
                basic.showIcon(IconNames.SmallDiamond)
            basic.pause(100)
            if (_initialized) break    
            if (connected() && round % 2 == 0) {
                _sendCommand1(INIT_COMMAND, DD_SID)
            }
            round = round + 1
        }
        if (LOG_CONNECTION) {
            writeSerial("% ... connection established")
        }
        basic.showIcon(IconNames.Yes)
    }

    const DEF_ENABLE_WHAT = 3
    const INDICATE_DISCONNECT_RESET = false

    let _poweredUp = false
    function _powerUp(enableWhat: number) {
        if (_poweredUp)
            return
        _poweredUp = true
        _ddinit(
            enableWhat,
            function () {
                // connected
            },
            function () {
                // disconnected
                if (LOG_CONNECTION) {
                    writeSerial("% disconnected")
                }
                if (INDICATE_DISCONNECT_RESET) {
                    basic.showIcon(IconNames.No)
                    basic.pause(500)
                    basic.showIcon(IconNames.Surprised)
                    basic.pause(500)
                    basic.showIcon(IconNames.No)
                }
                control.reset()
            },
            function (data: string): void {
                // received data
                if (data == ACK_INIT_COMMAND_DATA) {
                    _initialized = true
                } else if (data == RESET_REQUEST_DATA) {
                    if (_reset_callback != null)
                        _reset_callback()
                    control.reset()
                }
            }
        );
    }

    //% block='create a LED layer with %numRows row(s) and %numCols column(s)'
    //% numRows.min=1 numRows.defl=1 numCols.min=1 numCols.defl=1
    //% group='Layer'
    export function setupLedLayer(numRows: number = 1, numCols: number = 1): dumbdisplay.LedLayer {
        let layerId = (_next_leyer_id++).toString()
        _setup(layerId, "led", numRows, numCols)
        // _sendPartCommand1(layerId + ".SU", "led")
        // _sendPartCommand2(NO_COMMAND_IN, numRows.toString(), numCols.toString())
        // _sendCommand0((NO_COMMAND_IN))
        return new dumbdisplay.LedLayer(layerId/*, numRows, numCols*/, numRows >= numCols)
    }
    


    // **************
    // *** layers *** 
    // **************


    export class Layer {
        public layerId: string
        public constructor(layerId: string) {
            this.layerId = layerId
        }
        //% block='set %this(myLayer) layer visibility %visible'
        //% group='Layer'
        public layerVisible(visible: boolean) {
            _sendCommand1(this.layerId + ".visible", visible ? "1" : "0")
            //dumbdisplay.layerVisible(this, visible)
        }
        //% block='set %this(myLayer) layer opacity %opacity'
        //% opacity.min=0 opacity.min=255 
        //% group='Layer'
        public layerOpacity(opacity: number) {
            _sendCommand1(this.layerId + ".opacity", opacity.toString())
            //dumbdisplay.layerOpacity(this, opacity)
        }
        //% block='set %this(myLayer) layer background color %color'
        //% color.shadow="colorNumberPicker"
        //% group='Layer'
        public layerBackgroundColorNum(color: number) {
            _sendCommand1(this.layerId + ".backgroundcolor", color.toString())
        }
        //% block='set %this(myLayer) layer background color %color'
        //% group='Layer'
        public layerBackgroundColor(color: string) {
            _sendCommand1(this.layerId + ".backgroundcolor", color)
        }
        //% block='set %this(myLayer) layer no background color'
        //% group='Layer'
        public layerNoBackgroundColor() {
            _sendCommand0(this.layerId + ".backgroundcolor")
        }
    }


    let _next_leyer_id = 3

    export class DDLayer extends Layer {
        protected _ddHelper: dumbdisplay.DDHelper
        protected constructor(layerId: string) {
            super(layerId)
            this._ddHelper = new dumbdisplay.DDHelper(this)
        }
    }

    export class LedLayer extends DDLayer {
        private horizontal: boolean
        public constructor(layerId: string/*, numRows: number, numCols: number*/, horizontal: boolean) {
            super(layerId)
            this.horizontal = horizontal
            //this._ddHelper.setup("led", numRows, numCols)
        }
        //% block='turn %this(myLedLayer) led x %x y %y ON'
        //% group='Led Layer'
        public ledOn(x: number = 0, y: number = 0) {
            this._ddHelper.sendCommand2("ledon", x.toString(), y.toString())
        }
        //% block='turn %this(myLedLayer) led x %x y %y OFF'
        //% group='Led Layer'
        public ledOff(x: number = 0, y: number = 0) {
            this._ddHelper.sendCommand2("ledoff", x.toString(), y.toString())
        }
        //% block='toggle %this(myLedLayer) led x %x y %y'
        //% group='Led Layer'
        public ledToggle(x: number = 0, y: number = 0) {
            this._ddHelper.sendCommand2("ledtoggle", x.toString(), y.toString())
        }
        //% block='turn %this(myLedLayer) %count led(s) on like a bar'
        //% group='Led Layer'
        public ledBar(count: number) {
            let cmd = this.horizontal ? "ledhoribar" : "ledvertbar"
            this._ddHelper.sendCommand1(cmd, count.toString())
        }
        //% block='set %this(myLedLayer) led ON color %color'
        //% color.shadow="colorNumberPicker"
        //% group='Led Layer'
        public ledOnColorNum(color: number) {
            this._ddHelper.sendCommand1("ledoncolor", color.toString())
        }
        //% block='set %this(myLedLayer) led ON color %color'
        //% group='Led Layer'
        public ledOnColor(color: string) {
            this._ddHelper.sendCommand1("ledoncolor", color)
        }
        //% block='set %this(myLedLayer) led OFF color %color'
        //% color.shadow="colorNumberPicker"
        //% group='Led Layer'
        public ledOffColorNum (color: number) {
            this._ddHelper.sendCommand1("ledoffcolor", color.toString())
        }
        //% block='set %this(myLedLayer) led OFF color %color'
        //% group='Led Layer'
        public ledOffColor(color: string) {
            this._ddHelper.sendCommand1("ledoffcolor", color)
        }
    }

}


