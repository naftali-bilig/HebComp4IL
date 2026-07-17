(function () {
    "use strict";

    var frame = document.getElementById("learning-frame");
    var loading = document.getElementById("loading");
    var targetUrl = new URL(frame.getAttribute("data-target"), window.location.origin);
    new URLSearchParams(window.location.search).forEach(function (value, key) {
        targetUrl.searchParams.append(key, value);
    });
    var target = targetUrl.pathname + targetUrl.search;
    var separator = target.indexOf("?") === -1 ? "?" : "&";
    var wasHidden = false;

    function hardRefreshLearning() {
        loading.style.display = "grid";
        frame.src = target + separator + "appLoad=" + Date.now();
    }

    frame.addEventListener("load", function () {
        loading.style.display = "none";
    });

    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "hidden") {
            wasHidden = true;
        } else if (wasHidden) {
            wasHidden = false;
            hardRefreshLearning();
        }
    });

    window.addEventListener("pageshow", function (event) {
        if (event.persisted) {
            hardRefreshLearning();
        }
    });

    hardRefreshLearning();
}());
