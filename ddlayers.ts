//% color=#000077 icon="\uf14d" block="DDLayers"
//% groups=['Layer', 'Led Layer', 'Lcd Layer']
namespace ddlayers {

  let _next_layer_id = 3

  export class DDLayer /*extends Layer */{
      //public layerId: string
      public _ddHelper: dumbdisplay.DDHelper
      public constructor(layerId: string) {
          //super(layerId)
          //this.layerId = layerId
          this._ddHelper = new dumbdisplay.DDHelper(layerId)
      }
      //% block='set %this(myLayer) layer visibility %visible'
      //% group='Layer'
      public layerVisible(visible: boolean) {
          this._ddHelper.sendCommand1("visible", visible ? "1" : "0")
          //dumbdisplay.layerVisible(this, visible)
      }
      //% block='set %this(myLayer) layer opacity %opacity'
      //% opacity.min=0 opacity.max=255 
      //% group='Layer'
      public layerOpacity(opacity: number) {
          this._ddHelper.sendCommand1("opacity", opacity.toString())
          //dumbdisplay.layerOpacity(this, opacity)
      }
      //% block='set %this(myLayer) layer background color %color'
      //% color.shadow="colorNumberPicker"
      //% group='Layer'
      public layerBackgroundColorNum(color: number) {
          this._ddHelper.sendCommand1("bgcolor", color.toString())
      }
      //% block='set %this(myLayer) layer background color %color'
      //% group='Layer'
      public layerBackgroundColor(color: string) {
          this._ddHelper.sendCommand1("bgcolor", color)
      }
      //% block='set %this(myLayer) layer no background color'
      //% group='Layer'
      public layerNoBackgroundColor() {
          this._ddHelper.sendCommand0("nobgcolor")
      }
      //% block='clear the layer'
      //% group='Layer'
      public layerClear() {
          this._ddHelper.sendCommand0("clear")
      }
  }


  
  export class LedGridLayer extends DDLayer {
    private horizontal: boolean
    public constructor(layerId: string, horizontal: boolean) {
        super(layerId)
        this.horizontal = horizontal
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
    public ledOffColorNum(color: number) {
        this._ddHelper.sendCommand1("ledoffcolor", color.toString())
    }
    //% block='set %this(myLedLayer) led OFF color %color'
    //% group='Led Layer'
    public ledOffColor(color: string) {
        this._ddHelper.sendCommand1("ledoffcolor", color)
    }
  }



  export class LcdLayer extends DDLayer {
    public constructor(layerId: string) {
        super(layerId)
    }
    //% block='print to %this(myLcdLayer) text %text '
    //% group='Lcd Layer'
    public print(text: string) {
        this._ddHelper.sendCommand1("print", text)
    }
    //% block='set %this(myLcdLayer) cursor home'
    //% group='Lcd Layer'
    public home() {
        this._ddHelper.sendCommand0("home")
    }
    //% block='set %this(myLcdLayer) cursor %x %y'
    //% group='Lcd Layer'
    public setCursor(x: number, y: number) {
        this._ddHelper.sendCommand2("setcursor", x.toString(), y.toString())
    }
    //% block='turn on %this(myLcdLayer) cursor'
    //% group='Lcd Layer'
    public cursor() {
        this._ddHelper.sendCommand1("cursor", "1")
    }
    //% block='turn off %this(myLcdLayer) cursor'
    //% group='Lcd Layer'
    public noCursor() {
        this._ddHelper.sendCommand1("cursor", "0")
    }
    //% block='autoscroll %this(myLcdLayer)'
    //% group='Lcd Layer'
    public autoscroll() {
        this._ddHelper.sendCommand1("autoscroll", "1")
    }
    //% block='no autoscroll %this(myLcdLayer)'
    //% group='Lcd Layer'
    public noAutoscroll() {
        this._ddHelper.sendCommand1("autoscroll", "0")
    }
    //% block='turn on %this(myLcdLayer) display'
    //% group='Lcd Layer'
    public display() {
        this._ddHelper.sendCommand1("display", "1")
    }
    //% block='turn off %this(myLcdLayer) display'
    //% group='Lcd Layer'
    public noDisplay() {
        this._ddHelper.sendCommand1("display", "0")
    }
    //% block='scroll %this(myLcdLayer) display left'
    //% group='Lcd Layer'
    public scrollDisplayLeft() {
        this._ddHelper.sendCommand0("scrollleft")
    }
    //% block'scroll %this(myLcdLayer) display right'
    //% group='Lcd Layer'
    public scrollDisplayRight() {
        this._ddHelper.sendCommand0("scrollright")
    }
    //% block='write to %this(myLcdLayer) text %line as a line to %y'
    //% group='Lcd Layer'
    public writeLine(line: string, y: number = 0) {
        this._ddHelper.sendCommand3("writeline", y.toString(), "L", line)
    }
    //% block='set %this(myLcdLayer) pixel color %color'
    //% color.shadow="colorNumberPicker"
    //% group='Lcd Layer'
    public pixelColorNum(color: number) {
        this._ddHelper.sendCommand1("pixelcolor", color.toString())
    }
    //% block='set %this(myLcdLayer) pixel color %color'
    //% group='Lcd Layer'
    public pixelColor(color: string) {
        this._ddHelper.sendCommand1("pixelcolor", color)
    }
    //% block='set %this(myLcdLayer) "background" pixel color %color'
    //% color.shadow="colorNumberPicker"
    //% group='Lcd Layer'
    public bgPixelColorNum(color: number) {
        this._ddHelper.sendCommand1("bgpixelcolor", color.toString())
    }
    //% block='set %this(myLcdLayer) "background" pixel color %color'
    //% group='Lcd Layer'
    public bgPixelColor(color: string) {
        this._ddHelper.sendCommand1("bgpixelcolor", color)
    }
    //% block='set %this(myLcdLayer) no "background" pixel color'
    //% group='Lcd Layer'
    public noBgPixelColor() {
        this._ddHelper.sendCommand0("bgpixelcolor")
    }
}


}