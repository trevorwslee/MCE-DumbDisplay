let r = randint(0, 255)
let g = 128
let b = 0
let small = true
ddmb.setup(5, 5)
ddturtle.setup(189, 189)
dumbdisplay.backgroundColorNum(0xffffff)
ddmb.ledColor("#0aa00")
ddmb.showIcon(IconNames.Heart)
basic.pause(1000)
ddmb.ledColor("skyblue")
dumbdisplay.layerOpacity(ddmb.layer(), 60)
if (true) {
    //ddturtle.jumpTo(-30, -73)
    ddturtle.penColor("blue")
    ddturtle.penSize(2)
    ddturtle.fillColor("lemonchiffon")
    ddturtle.penFilled(true)
    //ddturtle.polygon(61, 8)
    ddturtle.centeredPolygonInside(73, 6)
    ddturtle.jumpHome()
    ddturtle.penFilled(false)
    ddturtle.penSize(1)
    ddturtle.centeredCircle(79)
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


