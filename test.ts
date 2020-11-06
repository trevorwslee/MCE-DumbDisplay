let testNum = 0  // 0 means adhoc test first ... then ...
                 // 1 means shape test first ... then ...
                 // 2 means just the standard test


let testRound = 0


// *** Adhoc Test

let img: ddmb.ddmbimage = null
function initAdhocTest() {
    ddmb.setup(11, 7)
    ddturtle.setup(50, 50)
    ddturtle.bgColor("orange")
    // create an image to be used during adhoc test
    img = ddmb.createImage("#.#.#.#.#||.#.#.#")
}
function adhocTestRound() {
    dumbdisplay.layerOpacity(ddmb.layer(), 128)
    img.scrollImage(1, 500)
    //
    ddturtle.jumpHome()
    ddturtle.penDown()
    ddturtle.penColor("blue")
    //
    ddturtle.jumpTo(-12.5, 0)
    ddturtle.penSize(10)
    ddturtle.write("hello")
    basic.pause(2000)
    ddturtle.clear()
    //
    ddturtle.penUp()
    ddturtle.fillColor("yellow")
    ddturtle.beginFill()
    ddturtle.forward(10.5)
    ddturtle.right(135.5)
    ddturtle.forward(10)
    ddturtle.right(135)
    ddturtle.forward(10)
    ddturtle.endFill()
    ddturtle.penDown()
    basic.pause(2000)
    ddturtle.clear()
    //
    ddturtle.penUp()
    ddturtle.goto(-10, 0)
    ddturtle.penDown()
    ddturtle.forward(10)
    ddturtle.penSize(3)
    ddturtle.forward(10)
    ddturtle.circle(5)
    ddturtle.penSize(0)
    basic.pause(2000)
    ddturtle.clear()
    //
    ddturtle.jumpHome()
    ddturtle.dotOfColor(15, "green")
    ddturtle.penUp()
    ddturtle.right(90)
    ddturtle.goto(20, 20)
    ddturtle.penDown()
    ddturtle.home()
    ddturtle.forward(20)
    ddturtle.left(90)
    ddturtle.forward(10)
    basic.pause(2000)
    ddturtle.clear()
    //
    ddturtle.goto(-25, 25)
    ddturtle.dot()
    ddturtle.goto(0, 0)
    ddturtle.dot(8)
    ddturtle.goto(25, 25)
    ddturtle.dot()
    ddturtle.goto(-25, -25)
    ddturtle.dot()
    ddturtle.goto(25, -25)
    ddturtle.dot()
    basic.pause(2000)
    ddturtle.clear()
    //
    ddturtle.goto(0, 0)
    ddturtle.circle(10)
    ddturtle.right(15)
    ddturtle.circle(10)
    ddturtle.right(15)
    ddturtle.circle(10)
    ddturtle.right(15)
    ddturtle.circle(10)
    basic.pause(2000)
    ddturtle.clear()
    //
    ddturtle.forward(5)
    ddturtle.left(45)
    ddturtle.backward(5)
    ddturtle.right(45)
    ddturtle.forward(5)
    ddturtle.circle(5)
    basic.pause(2000)
    ddturtle.clear()
    //
    ddturtle.jumpTo(-ddturtle.width() / 2, 0)
    ddturtle.penColor("green")
    ddturtle.write("the end")
    basic.pause(2000)
    //
    dumbdisplay.layerOpacity(ddmb.layer(), 255)
    //
    ddmb.showArrow(ArrowNames.North)
    basic.pause(2000)
    for (let x = 0; x < ddmb.width(); x++)
        ddmb.toggle(x, 3)
    basic.pause(2000)
    ddmb.showLeds(`
    . # . . .
    . # . . .
    . . # . .
    . . . # .
    . . . # .
    `)
    basic.pause(2000)
    ddmb.showLeds(".#.#")
    basic.pause(2000)
    ddmb.showLeds("#####\n.#.#.\n#")
    basic.pause(2000)
    for (let x = 0; x < ddmb.width(); x++) {
        ddmb.unplot(x, 0)
        ddmb.plot(x, 5)
    }
    basic.pause(2000)
    //
    let x = 0
    let y = 0
    while (true) {
        ddmb.plot(x, y)
        if (y % 2 == 0) {
            if (x == 4)
                y += 1
            else
                x += 1    
        } else {
            if (x == 0)
                y += 1
            else
                x -= 1
        }
        if (y == 5)
            break
    }
    basic.pause(2000)
    //
    ddmb.showIcon(IconNames.Heart)
    basic.pause(1000)
    ddmb.showIcon(IconNames.Diamond)
    basic.pause(2000)
    ddmb.showNumber(888)
    basic.pause(3000)
    ddmb.showString("BYE!")
    //
    for (let y = 0; y <= ddmb.maxY(); y++)
        ddmb.plot(3, y)
    basic.pause(1000)
    for (let y = ddmb.maxY(); y >= 0; y--)
        ddmb.unplot(3, y)
    basic.pause(2000)
}





// *** Shape Test

let shape = 0
function initShapeTest() {
    ddturtle.setup(215, 215)
    ddturtle.penColor("blue")
}
function shapeTestRound() {
    ddturtle.left(20)
    ddturtle.forward(20)
    switch (shape) {
        case 0: 
            ddturtle.circle(50.5)
            break
        case 1:
            ddturtle.rectangle(80, 60.5)
            break
        case 2:
            ddturtle.triangle(80, 50.5, 40)
            break    
        case 3:
            ddturtle.isoscelesTriangle(50, 65.5)
            break
        case 4:
            ddturtle.centeredCircle(50)
            break    
        case 5:
            ddturtle.centeredRectangle(80, 60)
            break
        case 6:
            ddturtle.polygon(50, 5)   
            break
        case 7:
            ddturtle.centeredPolygon(50, 5)   
            ddturtle.centeredCircle(50)
            break
        case 8:
            ddturtle.centeredCircle(50)
            ddturtle.centeredPolygonInside(50, 5)   
            break
        case 9:
            ddturtle.oval(60, 80)
            break
        case 10:
            ddturtle.centeredOval(60, 80)
            break
        default:
            for (let size = 3; size <= 10; size++) {
                ddturtle.clear()
                ddturtle.centeredPolygon(40, size)   
                ddturtle.centeredCircle(40)
                basic.pause(500)
            }
            shape = -1
            break
    }
    shape = shape + 1
    ddturtle.right(90)
    ddturtle.forward(100)
    basic.pause(2000)
    ddturtle.clear()
    ddturtle.jumpHome()
    ddturtle.setHeading(0)
    if (shape == 0) {
        ddturtle.penSize(2)
        ddturtle.fillColor("yellow")
        ddturtle.penFilled(true)
    }
}




// *** Standard Test

let r = randint(0, 255)
let g = 128
let b = 0
let small = true
function initStandardTest() {
    ddmb.setup(5, 5)
    ddturtle.setup(189, 189)
    //dumbdisplay.backgroundColorNum(0xffffff)
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
    ddturtle.dotOfColorNum(15, 0xaa8800)
}
function standardTestRound() {
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
}



basic.forever(function () {
    if (testRound == 0) {
        dumbdisplay.removeLayer(ddmb.layer())
        dumbdisplay.removeLayer(ddturtle.layer())
        if (testNum == 0) {
            initAdhocTest()
        } else if (testNum == 1) {
            initShapeTest()
        } else {
            initStandardTest()
        }
    }
    if (testNum == 0) {
        adhocTestRound()
        testRound = -1
        testNum++
    } else if (testNum == 1) {
        shapeTestRound()
        if (testRound == 24) {
            testRound = -1
            testNum++
        }
    } else {
        standardTestRound()
    }
    testRound++
})


