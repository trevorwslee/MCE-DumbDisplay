
DumbDisplay MakeCode Extension
------------------------------


DumbDisplay MakeCode Extension is a simple tool to extend your Micro:bit screen to your Android phone via Micro:bit built-in Bluetooth or USB Serial.

You explode your creativity with a little help from this extension, and use DumbDisplay to realize an enhanced Micro:bit virtual screen on your Android phone.

You can install the free DumbDisplay app from Android Play Store -- https://play.google.com/store/apps/details?id=nobody.trevorlee.dumbdisplay

The app can accept connection via
* Bluetooth LE -- which is relatively slow (and memory hungry)
* USB (OTG) -- which is faster, but requires a cable and an adaptor (OTG)


In a nutshell, this extension allows you to use DumbDisplay as a screen in place of the Micro:bit built-in screen
* customizable screen size
* customizable LED color
* many screen-related MakeCode Core-like commands
* can mix with a Turtle layer using many Turtle-like commands

To start with, you must setup DumbDisplay (DD) like

    ddmb.setup(5, 5)
        
- DumbDisplayMB ddmb.setup(15, 9) -- setup a DD screen layer similar to Micro:bit screen but with size 15x9
- DumbDisplayMB ddmb.setupLikeLocal() -- setup a DD screen layer similar to Micro:bit screen; additionally, most DumbDisplayMB commands will be replicated to Micro:bit internal screen
- DumbDisplayTurtle ddturtle.setup(300, 200) -- setup a DD screen layer with size 300x200

Then you can program something intresting, like

    ddmb.setup(5, 5)
    basic.forever(function () {
        ddmb.showIcon(IconNames.Heart)
        basic.pause(1000)
        ddmb.showIcon(IconNames.SmallHeart)
   })

Or like

     ddturtle.setup(100, 100)
     ddmb.setup(5, 5)
     dumbdisplay.layerOpacity(ddmb.layer(), 20)
     basic.forever(function () {
         ddmb.showIcon(IconNames.Heart)
         ddturtle.circle(50)
         ddturtle.right(20)
         basic.pause(1000)
         ddmb.showIcon(IconNames.SmallHeart)
     })


Notes:
  ; you can have 1 DumbDisplayMB screen layer + 1 DumbDisplayTurtle screen layer at the same time; the layer you setup first will be on top
  ; setting up will wait for connection to DumbDisplay Android app; therefore, make sure your phone is ready to accept connection (Bluetooth or USB Serial)
  ; at any time, if you want to start again, press the reset button on the back of your Micro:bit


You largely do not need to use DumpDisplay package. Instead, you will mostly use DumbDisplayMB and/or DumbDisplayTurtle to render drawings on the corresponding layers.

DumbDisplayMB:
- `showIcon(name: IconNames)` -- similar to Basic
- `showArrow(name: ArrowNames)` -- similar to Basic
- `showString(str: string)` -- similar to Basic
- `showNumber(num: number)` -- similar to Basic 
- `clearScreen()` -- similar to Basic
- `plot(x: number, y: number)` -- similary to Led
- `unplot(x: number, y: number)` -- similar to Led
- `toggle(x: number, y: number)` -- similar to Led
- `showLeds(leds: string)` -- similar to Led
- `ledColorNum(color: number)` -- set the color of the LEDs with a color number
- `ledColor(color: string)` -- set the color of the LEDs with a normal color name like "green", or a hex number (starting with "#")
- `createImage(leds: string)` / `showImage(offset: number)` / `scrollImage(offset: number, interval: number)` -- similar to Images
- `layer()` -- return the layer object to be used for some functions of DumbDisplay
- notes:
  * unless "setup like local", which will replicate most commands to local Micro:bit, the DumbDisplayMB commands will be brief; in other words, you get to control the timing how long something is shown. For example, the text "Hello World!" can take a little while for Basic.showString() to finish (since it will scroll the text), DumbDisplay.showString() virtual takes no time to finish; you use Basic.pause() to allow time for the string to scroll in DD virtual screen on your phone.
  * showLeds() / createImage() input is a string -- an "image literal" or a normal string; if it is a normal string, some similar format should be followed
    ; char # -- ON 
    ; char . -- OFF
    ; char | -- end of row
    ; e.g. ".####.||||#....#" represents 5 rows, with 1st row being ".####." and last row being "#....#" 

DumbDisplayTurtle:
- `forward(distance: number)` -- move forward
- `backward(distance: number)` -- move backward
- `right(angle: number)` -- turn right
- `left(angle: number)` -- turn left
- `setHeading(angle: number)` -- set heading direction
- `home()` -- move to home (center of screen)    
- `goto(x: number, y: number)` -- go to a position of the screen
- `circle(radius: number)` -- draw a circle
- `centeredCircle(radius: number)` -- draw a circle with current position being the center
- `rectangle(width: number, height: number)` -- draw a rectangle
  * it is similar to
        forward(width)
        left(90)
        forward(height)
        left(90)
        forward(width)
        left(90)
        forward(height)
        left(90)
- `centeredRectangle(width: number, height: number)` -- draw a rectangle with current position being the center
- `triangle(side1: number, angle: number, side2: number)` -- draw a triangle given SAS (side1, angle, side2)    
- `isoscelesTriangle(side: number, angle: number)` -- draw an isosceles triangle given side and angle
- `polygon(side: number, vertexCount: number)` -- draw a polygon given side and # vertices
- `centeredPolygon(radius: number, vertexCount: number)` -- draw a polygon with current position being the center (and surrounding an imaginary circle)
- `dot(size: number)` -- draw a dot (with certain pen size)
- `dotOfColorNum(size: number, color: number)` -- draw a dot (with certain pen size and pen color number)
- `dotOfColor(size: number, color: string)` -- draw a dot (with certain pen size and pen color name like "green")
- `write(text: string)` -- write text
- `drawText(text: string)` -- draw text (in the heading direction)
- `penup()` -- pen up
- `pendown()` -- pen down
- `penSize(size: number)` -- set pen size
- `penColorNum(color: number)` -- set pen color with color number
- `penColor(color: string)` -- set pen color with color name like "green", or a hex number (starting with "#")
- `fillColorNum(color: number)` -- set fill with color number 
- `fillColor(color: string)` -- set fill color with color name like "green", or a hex number (starting with "#")
- `bgColorNum(color: number)` -- set background color with color number 
- `bgColor(color: string)` -- set background color with color name like "green", or a hex number (starting with "#")
- `beginFill()`
- `endFill()`
- `clear()` -- clear the screen
- `jumpHome()` -- move to home (center of screen) without drawing 
- `jumpTo(x: number, y: number)` -- go to a position on screen without drawing 
- `penFilled(fillPen: boolean)` -- set whether pen filled (with fill color); note that when pen filled,  drawn shape will be filled
- `penTextSize(size: number)` -- set the size of text (the default pen text size depends on your phone setting)
- `layer()` -- return the layer object to be used for some functions of DumbDisplay

DumbDisplay:
- `powerUp(enableBluetooth: boolean = true, enableSerial: boolean = true)` -- if not explicitly called, powerUp() is automatically called when you setup DumbDisplayMB or DumbDisplayTurtle; however, you may want to call powerUp() before setting up layers in order to dictate more "power up" options
  * enableBluetooth -- set to false so that Bluetooth is not used
    ; this will leave more memory for your program
  * enableSerial -- set to false so that Serial is not used, and you can freely make use of Serial
- `backgroundColorNum(color: number)` -- set the background color of DumbDisplay with color number 
- `backgroundColor(color: number)` -- set the background color of DumbDisplay with color name like "green", or a hex number (starting with "#")
- `toColor(r: number, g: number, b: number)` -- turn RGB into color name that you can use, say to set LED color
  * in fact, the "color name" is simply the combine of the 3 RBG numbers -- e.g. R 100, B 0, G 200, will become "100-0-200"  
- `layerVisible(layer: Layer, visible: boolean)` -- set whether a layer is visible or not
- `layerOpacity(layer: Layer, opacity: number)` -- set the opacity of a layer (0 being totally transparent; 255 being total opaque)
- `removeLayer(layer: Layer)` -- remove a layer; yes, you can setup the layer again 
- `writeSerial(msg: string)` -- you can write some "comment" to the serial port and have that "comment" be sent to DumbDisplay terminal (on the phone side)

A reminder -- DumbDisplay will make use of both your Micro:bit Bluetooth and USB Serial, therefore you should not be making use of them for your own purposes. However, if you really need to use any one of them, you can use DumbDisplay.powerUp() to disallow DumbDisplay to use Bluetooth or USB Serial.




Greeting from the author Trevor Lee:

  Hope you can enjoy this little extension.

  Be happy! Jesus loves you!







Change History
--------------

v0.1.0 
- initial release

v0.0.3 
- bug fixes

v0.0.2
- bug fixes

v0.0.1
- initial internal release



