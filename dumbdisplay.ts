
enum AutoPinDirection {
    //% block="horizontal"
    Horizontal,
    //% block="vertical"
    Vertical
}


//% color=#000077 icon="\uf14d" block="DumbDisplay"
//% groups=['Setup', 'Helper', 'Experimental']
namespace dumbdisplay {

    export const LAYER_TYPE_MB = "mb"
    export const LAYER_TYPE_TURTLE = "turtle"

    const LOG_CONNECTION = true     
    const DEBUG_ON = false

    //% block
    //% group='Basic'
    //% shim=DumbDisplayCpp::getConnected
    export function connected(): boolean { return true }

    //% block="convert to color from R %r G %g B %b"
    //% group='Helper'
    //% advanced=true
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

    // //% block='explicitly power up with Bluetooth %enableBluetooth and Serial %enableSerial'
    // //% advanced=true
    // //% group='Setup'
    // export function powerUp(enableBluetooth: boolean = true, enableSerial: boolean = true) {
    //     let enableWhat = (enableBluetooth ? 1 : 0) + (enableSerial ? 2 : 0)
    //     _powerUp(enableWhat)
    // }
    
    //% block='explicitly wait for a connection, setting Bluetooth %enableBluetooth and Serial %enableSerial'
    //% advanced=true
    //% group='Setup'
    export function connect(enableBluetooth: boolean = true, enableSerial: boolean = true): void {
        let enableWhat = (enableBluetooth ? 1 : 0) + (enableSerial ? 2 : 0)
        _initConnection(enableWhat)
    }

    //% block='config "pin layers frame" to be %xUnitCount by %yUnitCount'
    //% xUnitCount.defl=100 yUnitCount.defl=100
    //% advanced=true
    //% group='Setup'
    export function configPinLayers(xUnitCount: number = 100, yUnitCount: number = 100) {
        _initConnection(DEF_ENABLE_WHAT)
        if (xUnitCount != 100 || yUnitCount != 100) {
            _sendCommand2("CFGPF", xUnitCount.toString(), yUnitCount.toString());
        }
    }

    //% block='config "auto pin layers" to be in the direction %direction'
    //% advanced=true
    //% group='Setup'
    export function configAutoPinLayers(direction: AutoPinDirection) {
        let layoutSpec = direction == AutoPinDirection.Horizontal ? "H(*)" : "V(*)"
        _sendCommand1("CFGAP", layoutSpec);
    }




    //% block='pin a layer on the virtual "pin frame" @ position (%uLeft, %uTop) with size (%uWidth x %uHeight)'
    //% group='Layer'
    //% advanced=true
    export function pinLayer(layer: ddlayers.DDLayer, uLeft: number, uTop: number, uWidth: number, uHeight: number) {
        _sendPartCommand0(layer._ddHelper.layerId + ".PIN")
        _sendPartCommand2(NO_COMMAND_IN, uLeft.toString(), uTop.toString());
        _sendPartCommand2(NO_COMMAND_IN, uWidth.toString(), uHeight.toString());
        //_sendPartCommand1(NO_COMMAND_IN, align);
        _sendCommand0(NO_COMMAND_IN)
    }

    //% block='a LED-grid layer with size %numCols by %numRows (LED sub-size %numSubCols by %numSubRows'
    //% numRows.min=1 numRows.defl=1 numCols.min=1 numCols.defl=1
    //% numSubRows.min=1 numSubRows.defl=1 numSubCols.min=1 numSubCols.defl=1
    //% group='Setup'
    export function setupLedGridLayer(numCols: number = 1, numRows: number = 1, numSubCols: number = 1, numSubRows: number = 1): ddlayers.LedGridLayer {
        _initConnection(DEF_ENABLE_WHAT);
        let layerId = (_next_layer_id++).toString()
        _sendPartCommand1(layerId + ".SU", "ledgrid")
        _sendPartCommand2(NO_COMMAND_IN, numCols.toString(), numRows.toString())
        _sendPartCommand2(NO_COMMAND_IN, numSubCols.toString(), numSubRows.toString())
        _sendCommand0((NO_COMMAND_IN))
        // let layerId = (_next_layer_id++).toString()
        // _setup(layerId, "ledgrid", numCols, numRows)
        return new ddlayers.LedGridLayer(layerId/*, numRows, numCols*/, numCols >= numRows)
    }

    //% block='a LCD layer with size %numCols by %numRows'
    //% numRows.min=1 numRows.defl=2 numCols.min=1 numCols.defl=16
    //% group='Setup'
    export function setupLcdLayer(numCols: number = 16, numRows: number = 2): ddlayers.LcdLayer {
        let layerId = (_next_layer_id++).toString()
        _setup(layerId, "lcd", numCols, numRows)
        // _preSetup();
        // _sendPartCommand1(layerId + ".SU", "lcd")
        // _sendPartCommand2(NO_COMMAND_IN, numRows.toString(), numCols.toString())
        // _sendCommand0((NO_COMMAND_IN))
        return new ddlayers.LcdLayer(layerId)
    }
    

    //% block='delete a layer'
    //% group='Layer'
    //% advanced=true
    export function removeLayer(layer: ddlayers.DDLayer) {
        _sendCommand0(layer._ddHelper.layerId + ".DEL")
    }

    export function removeAllLayers() {
        _sendCommand0("DELALL")
    }


    //% block
    //% group='Helper'
    export function writeComment(msg: string) {
        _sendCommand0("// " + msg)
    }

    //% block
    //% group='Helper'
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



    const DD_SID = "Microbit"
    const INIT_COMMAND = ">init>"
    const ACK_INIT_COMMAND_DATA = "<init<\n"
    const RESET_REQUEST_DATA = "<reset?\n"

    const NO_COMMAND_IN = ""


    export class DDHelper {
        public layerId: string
        public constructor(layerId: string) {
            this.layerId = layerId
        }
        public setup(layerType: string, width: number, height: number) {
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
        return true;
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
    let _next_layer_id = 3
    let _reset_callback: () => void

 

    function _initConnection(enableWhat: number) {
        _powerUp(enableWhat)
        if (!connected())
            _connect()
    }
    function _setup(layerId: string, layerType: string, width: number, height: number) {
        _initConnection(DEF_ENABLE_WHAT);
        _sendCommand3(layerId + ".SU", layerType, width.toString(), height.toString())
        // if (LOG_CONNECTION) {
        //     writeSerial("% setup layer " + layerId + "." + layerType)
        // }
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
                    if (LOG_CONNECTION) {
                        writeSerial("% RESET!")
                    }
                    control.reset()
                }
            }
        )
        if (LOG_CONNECTION) {
            writeSerial("% power up")
        }
    }
}


