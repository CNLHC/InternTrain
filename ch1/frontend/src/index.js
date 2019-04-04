sectorMapping = {
    "谢谢参与": [0, 2, 5, 7],
    "100元话费": [3, 6],
    "10元话费": [9],
    "50积分": [1, 4, 8],

}
function startLottery(onsuccess) {
    const request = new XMLHttpRequest();
    request.timeout = 2500
    request.responseType = "json"
    request.onload = function (e) {
        onsuccess(e.target.response)
    }
    request.onerror = function (e) {
        alert('系统错误')
    }
    request.ontimeout = function (e) {
        alert('响应超时')
    }
    request.open("GET", "http://intern.bytedance.cnworkshop.xyz:4449/api/turnTable");
    request.send();
}

function drawTurnTableStatic() {
    var prizeImgSrc = {
        0: "./img/thanks.png",
        1: "./img/50point.png",
        2: "./img/thanks.png",
        3: "./img/100yuan.png",
        4: "./img/50point.png",
        5: "./img/thanks.png",
        6: "./img/100yuan.png",
        7: "./img/thanks.png",
        8: "./img/50point.png",
        9: "./img/10yuan.png"
    }
    var canvas = document.getElementById("turn-table-canvas");
    var ctx = canvas.getContext("2d");
    var cW = ctx.canvas.width
    var offset = cW / 2
    var outerCircleR = offset
    var prizeImgWidth = 0.116 * cW
    var prizeImgHeightOffset = offset - 0.1 * cW;
    ctx.canvas.height = ctx.canvas.width;
    ctx.translate(offset, offset)
    var sector = 0;
    //polar to cartesian
    var p2c = function (r, theta) {
        return [r * Math.cos(theta), r * Math.sin(theta)]
    }
    var drawPadding = function () {
        ctx.beginPath();
        ctx.arc(0, 0, outerCircleR, 0, 2 * Math.PI)
        ctx.fillStyle = "#c13820"
        ctx.fill()

    }
    var drawPrizeImg = function (sector, src) {
        var prizeImg = new Image()
        prizeImg.src = src
        prizeImg.addEventListener('load', function () {
            ctx.save()
            ctx.rotate(36 * sector * Math.PI / 180);
            ctx.drawImage(prizeImg, 0 - prizeImgWidth / 2, 0 - prizeImgHeightOffset, prizeImgWidth, prizeImgWidth)
            ctx.restore()
        }, false);
    }
    var drawSector = function (sector) {
        ctx.beginPath()
        ctx.moveTo(0, 0)
        var sectorStartRad = 36 * sector * Math.PI / 180
        var sectorEndRad = 36 * (sector + 1) * Math.PI / 180
        var sectorCord1 = p2c(0.88 * offset, sectorStartRad)
        var sectorCord2 = p2c(0.88 * offset, sectorEndRad)
        ctx.lineTo(sectorCord1[0], sectorCord1[1])
        ctx.arc(0, 0, 0.88 * offset, sectorStartRad, sectorEndRad)
        ctx.lineTo(0, 0)
        ctx.fillStyle = sector % 2 != 0 ? "#ffffff" : "#fef6e1"
        ctx.fill()
        ctx.strokeStyle = "#fde29c"
        ctx.stroke()
        drawPrizeImg(sector, prizeImgSrc[sector])
    }

    drawPadding()
    for (sector; sector < 10; sector++)
        drawSector(sector)
}

function drawTurnTableAnimated(startLotteryCallback) {
    var rotateAnimationRunning = false
    var rotateAnimationLength = 3000
    var successAnimationRunning = false
    var successAnimationLength = 2000
    var successAjax = false;
    var response;

    var canvas = document.getElementById("turn-table-animation-canvas");
    var ctx = canvas.getContext("2d");
    var cW = ctx.canvas.width
    var offset = cW / 2
    ctx.canvas.height = ctx.canvas.width;
    ctx.translate(offset, offset)
    var sector = 0;
    var pointerImage = new Image();
    var pointerHeight = 0.255 * cW;
    var pointerWidth = 0.205 * cW;
    pointerImage.src = './img/Pointer.png'
    pointerImage.addEventListener('load', function () {
        var pointerHeightOffset = (pointerHeight - pointerWidth) + (pointerWidth / 2);
        ctx.drawImage(pointerImage, 0 - pointerWidth / 2, 0 - pointerHeightOffset, pointerWidth, pointerHeight)
    }, false);
    var p2c = function (r, theta) {
        return [r * Math.cos(theta), r * Math.sin(theta)]
    }
    var drawLEDBand = function (sector, on) {
        ctx.beginPath();
        var cord = p2c(0.47 * cW, (36 * sector + 18) * Math.PI / 180)
        ctx.arc(cord[0], cord[1], 0.04 * offset, 0, 2 * Math.PI)
        ctx.fillStyle = on ? "#fee491" : "#ffffff"
        ctx.fill()
    }
    var drawPointer = function (angle) {
        var pointerHeight = 0.255 * cW;
        var pointerWidth = 0.205 * cW;
        var pointerHeightOffset = (pointerHeight - pointerWidth) + (pointerWidth / 2);
        ctx.save()
        ctx.rotate(angle * Math.PI / 180);
        ctx.drawImage(pointerImage, 0 - pointerWidth / 2, 0 - pointerHeightOffset, pointerWidth, pointerHeight)
        ctx.restore()
    }
    var startTimeStamp = 0;
    var startTimeCached = false;
    var clearCanvas = function () {
        ctx.clearRect(0 - offset, 0 - offset, canvas.width, canvas.height)
    }


    var animationDraw = function (timeStamp) {
        if (!startTimeCached) {
            startTimeStamp = timeStamp
            startTimeCached = true
            console.log("pre animation start")
        }
        clearCanvas()
        var progress = (timeStamp - startTimeStamp) / rotateAnimationLength;
        drawPointer(3600 * progress)
        var sector = 0
        for (sector; sector < 10; sector++)
            drawLEDBand(sector, sector == Math.floor(3600 * progress % 720 / 72));
        if (rotateAnimationRunning)
            window.requestAnimationFrame(animationDraw);
        else {
            startTimeCached = false
            if (successAjax) {
                successAjax = false
                successAnimationRunning = true
                window.requestAnimationFrame(successAnimationDraw)
                window.setTimeout(function () {
                    successAnimationRunning = false
                }, successAnimationLength)
                console.log("pre animation end")
            }
        }
    }

    var pointerAngle;
    var successAnimationDraw = function (timeStamp) {
        var choose = function (choices) {
            var index = Math.floor(Math.random() * choices.length);
            return choices[index];
        }
        if (!startTimeCached) {
            startTimeStamp = timeStamp
            startTimeCached = true
            var domResult = document.getElementById('footer')
            domResult.innerHTML = (response.name == "谢谢参与" ? "" : "恭喜您获得:") + response.name
            pointerAngle = choose(sectorMapping[response.name]) * 36
            console.log("success animation start")
        }
        var progress = (timeStamp - startTimeStamp) / successAnimationLength;

        clearCanvas()
        console.log(pointerAngle)
        drawPointer(pointerAngle)
        var sector = 0;
        for (sector; sector < 10; sector++)
            drawLEDBand(sector, Math.floor(progress * 5) % 2 == 1);

        if (successAnimationRunning)
            window.requestAnimationFrame(successAnimationDraw)
        else {

            console.log("success animation end")
            startTimeCached = false
            successAjax = false
        }
    }

    canvas.addEventListener('click', function (e) {
        if (e.layerX < offset + pointerWidth && e.layerX > offset - pointerWidth && e.layerY < offset + pointerWidth && e.layerY > offset - pointerWidth)
            if (!rotateAnimationRunning && !successAnimationRunning) {
                var domResult = document.getElementById('footer')
                domResult.innerHTML = ""
                startLottery(function (res) {
                    successAjax = true, response = res
                })
                window.requestAnimationFrame(animationDraw)
                window.setTimeout(function () {
                    rotateAnimationRunning = false
                }, rotateAnimationLength)
                rotateAnimationRunning = true;
            }
    })

    for (sector; sector < 10; sector++)
        drawLEDBand(sector, sector % 2 == 0);

}