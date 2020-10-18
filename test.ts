let r = randint(0, 255)
let g = 128
let b = 0
let small = true
ddmb.setup(5, 5)
ddturtle.setup(189, 189)
if (false) {
    // turtle DEBUG CODE
    ddturtle.left(20)
    ddturtle.forward(20)
    ddturtle.penColor("green")
    ddturtle.penSize(5)
    ddturtle.penFillColor("yellow")
    ddturtle.polygon(40, 6)
    basic.pause(20000)
}
if (false) {
    // turtle DEBUG CODE
    ddturtle.forward(20)
    ddturtle.beginFill()
    ddturtle.forward(60)
    ddturtle.left(90)
    ddturtle.forward(40)
    ddturtle.left(90)
    ddturtle.forward(60)
    ddturtle.left(90)
    ddturtle.forward(40)
    ddturtle.left(90)
    ddturtle.endFill()
    basic.pause(10000)
}
if (false) {
    // turtle DEBUG CODE
    ddturtle.penColor("green")
    ddturtle.penSize(5)
    ddturtle.penFillColor("yellow")
    ddturtle.forward(20)
    ddturtle.rectangle(60, 40)
    basic.pause(10000)
}
dumbdisplay.backgroundColorNum(0xffffff)
ddmb.ledColor("#0aa00")
ddmb.showIcon(IconNames.Heart)
basic.pause(1000)
ddmb.ledColor("skyblue")
dumbdisplay.layerOpacity(ddmb.layer(), 60)
if (true) {
    ddturtle.jumpTo(-30, -73)
    ddturtle.penColor("red")
    ddturtle.penSize(2)
    ddturtle.penFillColor("lightcyan")
    ddturtle.polygon(61, 8)
    ddturtle.jumpHome()
    ddturtle.noPenFillColor()
    ddturtle.penSize(1)
}
ddturtle.dot(21)
ddturtle.dotOfColorNum(15, 0xffff00)

basic.forever(function () {
    dumbdisplay.writeSerial("begin round")
    ddturtle.penColor(dumbdisplay.toColor(r, g, b))
    ddturtle.circle(27)
    ddturtle.rectangle(90, 20)
    ddturtle.right(10)
    b = b + 20
    if (b > 255) {
        b = 0
        r = randint(0, 255)
    }
    if (small) {
        ddmb.showIcon(IconNames.SmallHeart)
        small = false
    } else {
        ddmb.showIcon(IconNames.Heart)
        small = true
    }
    basic.pause(1000)
})


