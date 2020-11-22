
//% color=#770000 icon="\uf14d" block="DumbDisplay.MB"
//% groups=['Setup', 'Basic', 'Led', 'Images', 'Advanced', 'Experimental']
namespace ddmb {

    //% block='setup width %width and height %height'
    //% width.min=5 width.defl=5 height.min=5 height.defl=5
    //% group='Setup'
    export function setup(width: number, height: number) {
        _width = width
        _height = height
        _ddLayer.setup(dumbdisplay.LAYER_TYPE_MB, width, height)
    }


    //% block='setup like local micro:bit'
    //% group='Setup'
    export function setupLikeLocal() {
        _also_output_to_screen = false
        _width = 5
        _height = 5
        _ddLayer.setup(dumbdisplay.LAYER_TYPE_MB, 5, 5)
        _also_output_to_screen = true
        basic.clearScreen()
    }


    //% block
    //% group='Basic'
    export function showNumber(num: number): void {
        _ddLayer.sendCommand1("shn", num.toString())
        if (_also_output_to_screen) 
            basic.showNumber(num)
    }

    //% block
    //% group='Basic'
    export function showString(str: string): void {
        _ddLayer.sendCommand1("shs", str)
        if (_also_output_to_screen) 
            basic.showString(str)
    }

    //% block 
    //% group='Basic'
    export function showIcon(name: IconNames) {
        _ddLayer.sendCommand1("shi", name.toString())
        if (_also_output_to_screen)
            basic.showIcon(name)
    }

    //% block
    //% group='Basic'
    export function showArrow(name: ArrowNames) {
        _ddLayer.sendCommand1("sha", name.toString())
        if (_also_output_to_screen)
            basic.showArrow(name)
    }

    //% block
    //% group='Basic'
    export function clearScreen(): void {
        _ddLayer.sendCommand0("cs")
        if (_also_output_to_screen)
            basic.clearScreen()
    }


    //% block='plot x %x y %y'
    //% group='Led'
    export function plot(x: number, y: number): void {
        _ddLayer.sendCommand2("pl", x.toString(), y.toString())
        if (_also_output_to_screen)
            led.plot(x, y)
    }

    //% block='unplot x %x y %y'
    //% group='Led'
    export function unplot(x: number, y: number): void {
        _ddLayer.sendCommand2("upl", x.toString(), y.toString())
        if (_also_output_to_screen)
            led.unplot(x, y)
    }

    //% block='toggle x %x y %y'
    //% group='Led'
    export function toggle(x: number, y: number): void {
        _ddLayer.sendCommand2("tggl", x.toString(), y.toString())
        if (_also_output_to_screen)
            led.toggle(x, y)
    }

    //% block
    //% group='Basic'
    export function showLeds(leds: string) {
        _ddLayer.beginSendCommand("shleds")
        _ddLayer.partSendCommandMbLeds(leds/*, 5, 5*/)
        _ddLayer.endSendCommand()
        if (_also_output_to_screen)
            _mbShowLeds(leds)
    }

    //% shim=DumbDisplayCpp::mbShowLeds
    function _mbShowLeds(leds: string) {
    }


    export class ddmbimage {
        private imgId: number
        constructor(imgId: number) {
            this.imgId = imgId
        }
        //% block="show image %this(myImage) at offset %offset"
        //% advanced=true
        //% group='Images'
        public showImage(offset: number) {
            _ddLayer.sendCommand2("shimg", this.imgId.toString(), offset.toString())
        }
        //% block="scroll image %this(myImage) with offset %offset and interval (ms) %interval"
        //% offset.min=1 offset.defl=1 interval.min=100 interval.defl=200
        //% advanced=true
        //% group='Images'
        public scrollImage(offset: number, interval: number) {
            _ddLayer.sendCommand3("sclimg", this.imgId.toString(), offset.toString(), interval.toString())
        }
    }



    //% block
    //% advanced=true
    //% group='Images'
    export function createImage(leds: string): ddmbimage {
        let imgId = _nextImgId
        _nextImgId = _nextImgId + randint(1, 10)
        _ddLayer.beginSendCommand("crimg")
        _ddLayer.partSendCommand1(imgId.toString())
        _ddLayer.partSendCommandMbLeds(leds)
        _ddLayer.endSendCommand()
        return new ddmbimage(imgId);
    }



    //% block='set LED color %color' 
    //% color.shadow="colorNumberPicker"
    //% group='Led'
    //% advanced=true
    export function ledColorNum(color: number): void {
        _ddLayer.sendCommand1("ledc", color.toString())
    }

    //% block='set LED color %color' 
    //% group='Led'
    //% advanced=true
    export function ledColor(color: string): void {
        _ddLayer.sendCommand1("ledc", color)
    }

    //% block="dump current local micro:bit screen" 
    //% advanced=true
    //% group='Experimental'
    export function dumpScreen(): void {
        _ddLayer.beginSendCommand("ds")
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                if (led.point(x, y)) {
                    _ddLayer.partSendCommand2(x.toString(), y.toString())
                }
            }
        }
        _ddLayer.endSendCommand()
    }


    //% block='also ouput to micro:bit'
    //% group='Basic'
    //% advanced=true
    //% weight=100
    export function alsoOuputToScreen() { return _also_output_to_screen }

    //% block='width'
    //% group='Basic'
    //% advanced=true
    export function width(): number { return _width }
    //% block='height'
    //% group='Basic'
    //% advanced=true
    export function height(): number { return _height }

    //% block='max X'
    //% group='Basic'
    //% advanced=true
    export function maxX(): number { return _width - 1 }
    //% block='max Y'
    //% group='Basic'
    //% advanced=true
    export function maxY(): number { return _height - 1 }

    //% block='layer'
    //% advanced=true
    //% group='Advanced'
    export function layer():dumbdisplay.Layer { return _layer }



    const LAYER_ID = "1"



    //% fixedInstance whenUsed
    let _layer = new dumbdisplay.Layer(LAYER_ID)
    //% fixedInstance whenUsed
    let _ddLayer = new dumbdisplay.DDLayer(_layer)
    let _width = 0
    let _height = 0
    let _also_output_to_screen: boolean = false
    let _nextImgId = 0


}


// namespace dumbdisplay {
//     export class LcdLayer extends Layer {
//         public constructor(layerId: string) {
//             super(layerId)
//         }
//     }
// }

