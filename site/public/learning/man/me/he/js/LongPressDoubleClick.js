(function () {
    "use strict";

    var LONG_PRESS_DURATION = 600;
    var MOVE_TOLERANCE = 12;
    var press = null;
    var suppressClickUntil = 0;
    var suppressClickTarget = null;

    function doubleClickElement(element) {
        element.dispatchEvent(new MouseEvent("dblclick", {
            bubbles: true,
            cancelable: true,
            view: window
        }));
    }

    function clearPress() {
        if (!press) {
            return;
        }

        clearTimeout(press.timer);
        press = null;
    }

    document.addEventListener("pointerdown", function (event) {
        if (event.pointerType !== "touch" || event.isPrimary === false) {
            return;
        }

        var target = event.target.closest("[ondblclick]");
        if (!target) {
            return;
        }

        clearPress();
        press = {
            pointerId: event.pointerId,
            target: target,
            startX: event.clientX,
            startY: event.clientY,
            timer: setTimeout(function () {
                var longPressTarget = press && press.target;
                if (!longPressTarget) {
                    return;
                }

                suppressClickTarget = longPressTarget;
                suppressClickUntil = Date.now() + 1000;
                press = null;
                doubleClickElement(longPressTarget);
            }, LONG_PRESS_DURATION)
        };
    }, true);

    document.addEventListener("pointermove", function (event) {
        if (!press || event.pointerId !== press.pointerId) {
            return;
        }

        if (Math.abs(event.clientX - press.startX) > MOVE_TOLERANCE ||
            Math.abs(event.clientY - press.startY) > MOVE_TOLERANCE) {
            clearPress();
        }
    }, true);

    ["pointerup", "pointercancel"].forEach(function (eventName) {
        document.addEventListener(eventName, function (event) {
            if (press && event.pointerId === press.pointerId) {
                clearPress();
            }
        }, true);
    });

    document.addEventListener("click", function (event) {
        if (Date.now() > suppressClickUntil || !suppressClickTarget) {
            return;
        }

        if (event.target === suppressClickTarget || suppressClickTarget.contains(event.target)) {
            event.preventDefault();
            event.stopImmediatePropagation();
            suppressClickTarget = null;
            suppressClickUntil = 0;
        }
    }, true);

    document.addEventListener("contextmenu", function (event) {
        if (event.target.closest("[ondblclick]")) {
            event.preventDefault();
        }
    }, true);

    var style = document.createElement("style");
    style.textContent = "@media (pointer: coarse) { [ondblclick] { -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; } }";
    document.head.appendChild(style);
}());
