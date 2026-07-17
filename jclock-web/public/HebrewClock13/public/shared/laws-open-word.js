(function() {
    "use strict";

    var WEB01_OPEN_IN_WORD_SERVICE = "https://shilat-medical.web.app/open-in-word/";
    var WEB01_SUPPORTED_PDF_HOSTS = {
        "fs.knesset.gov.il": true,
        "olaw.org.il": true,
        "www.olaw.org.il": true
    };
    var WEB02_CONTEXT_TTL_MS = 60 * 60 * 1000;
    var WEB02_CONTEXT_MAX_PDF_BYTES = 4 * 1024 * 1024;
    var WEB02_MAX_PDF_BYTES = 100 * 1024 * 1024;
    var WEB02_SERVICE_ORIGIN = new URL(WEB01_OPEN_IN_WORD_SERVICE).origin;
    var WEB02_ALLOWED_SOURCE_PAGES = Object.freeze({
        "https://jclock.net/HebrewClock13/public/man/me/he/laws/": true,
        "https://jclock.net/HebrewClock13/public/man/me/he/laws/index.html": true,
        "https://jclock.net/HebrewClock13/public/woman/me/he/laws/": true,
        "https://jclock.net/HebrewClock13/public/man/me/en/laws/index.html": true,
        "https://jclock.net/HebrewClock13/public/woman/me/he/laws/index.html": true,
        "https://jclock.net/HebrewClock13/public/woman/me/en/laws/index.html": true
    });
    var WEB02_pdf_contexts = new Map();
    var WEB02_active_bridge = null;
    var WEB02_bridge_installed = false;

    function WEB02_authorized_source_page()
    {
        var sourcePage = document.location.origin + document.location.pathname;
        return WEB02_ALLOWED_SOURCE_PAGES[sourcePage] === true ? sourcePage : null;
    }

    function WEB01_is_supported_official_pdf(value)
    {
        try
        {
            var url = new URL(value, document.location.href);
            return url.protocol == "https:" &&
                WEB01_SUPPORTED_PDF_HOSTS[url.hostname] === true &&
                /\.pdf$/i.test(url.pathname);
        }
        catch(error)
        {
            return false;
        }
    }

    function WEB01_reveal_word_after_download(openWord)
    {
        openWord.hidden = false;
        openWord.focus({ preventScroll: true });
    }

    function WEB02_memory_context_accepts_up_to_4mb(file)
    {
        return file instanceof File && file.size <= WEB02_CONTEXT_MAX_PDF_BYTES;
    }

    function WEB02_downloaded_file_name_matches_source(fileName, sourceName)
    {
        var actual = String(fileName || "").trim();
        var expected = String(sourceName || "").trim();
        if(actual.toLocaleLowerCase() === expected.toLocaleLowerCase())
            return true;

        var expectedStem = expected.replace(/\.pdf$/i, "");
        var escapedStem = expectedStem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return new RegExp("^" + escapedStem + " \\([1-9][0-9]*\\)\\.pdf$", "i").test(actual);
    }

    function WEB02_accepted_downloaded_file(file, sourceName)
    {
        return file instanceof File &&
            file.size > 0 &&
            file.size <= WEB02_MAX_PDF_BYTES &&
            (/\.pdf$/i.test(file.name) || file.type === "application/pdf") &&
            WEB02_downloaded_file_name_matches_source(file.name, sourceName);
    }

    function WEB02_forget_pdf_context(sourceUrl)
    {
        var retained = WEB02_pdf_contexts.get(sourceUrl);
        if(retained && retained.timeoutId)
            clearTimeout(retained.timeoutId);
        WEB02_pdf_contexts.delete(sourceUrl);
    }

    function WEB02_retain_pdf_context(sourceUrl, file)
    {
        WEB02_forget_pdf_context(sourceUrl);
        var expiresAt = Date.now() + WEB02_CONTEXT_TTL_MS;
        var retained = {
            file: file,
            expiresAt: expiresAt,
            timeoutId: null
        };
        retained.timeoutId = setTimeout(function() {
            var current = WEB02_pdf_contexts.get(sourceUrl);
            if(current === retained)
                WEB02_pdf_contexts.delete(sourceUrl);
        }, WEB02_CONTEXT_TTL_MS);
        WEB02_pdf_contexts.set(sourceUrl, retained);
        return retained;
    }

    function WEB02_get_pdf_context(sourceUrl)
    {
        var retained = WEB02_pdf_contexts.get(sourceUrl);
        if(!retained)
            return null;
        if(retained.expiresAt <= Date.now())
        {
            WEB02_forget_pdf_context(sourceUrl);
            return null;
        }
        return retained;
    }

    function WEB02_bridge_id()
    {
        if(window.crypto && typeof window.crypto.randomUUID == "function")
            return window.crypto.randomUUID();
        var bytes = new Uint8Array(16);
        window.crypto.getRandomValues(bytes);
        return Array.from(bytes, function(value) {
            return value.toString(16).padStart(2, "0");
        }).join("");
    }

    function WEB02_close_wordakn4il_overlay()
    {
        var active = WEB02_active_bridge;
        if(!active)
            return;
        active.overlay.hidden = true;
        active.iframe.src = "about:blank";
        document.body.classList.remove("wordakn4il-dialog-open");
        WEB02_active_bridge = null;
        if(active.trigger)
            active.trigger.focus({ preventScroll: true });
    }

    function WEB02_get_wordakn4il_overlay()
    {
        var existing = document.querySelector(".wordakn4il-overlay");
        if(existing)
            return existing;

        var overlay = document.createElement("div");
        overlay.className = "wordakn4il-overlay";
        overlay.hidden = true;
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-label", "WordAKN4IL");

        var panel = document.createElement("div");
        panel.className = "wordakn4il-panel";
        var close = document.createElement("button");
        close.type = "button";
        close.className = "wordakn4il-close";
        close.innerText = "סגור";
        close.addEventListener("click", WEB02_close_wordakn4il_overlay);
        var iframe = document.createElement("iframe");
        iframe.className = "wordakn4il-frame";
        iframe.title = "WordAKN4IL";
        iframe.src = "about:blank";

        panel.appendChild(close);
        panel.appendChild(iframe);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
        return overlay;
    }

    function WEB02_install_pdf_context_bridge()
    {
        if(WEB02_bridge_installed)
            return;
        WEB02_bridge_installed = true;
        window.addEventListener("message", function(event) {
            var active = WEB02_active_bridge;
            var data = event.data;
            if(!active || event.origin !== WEB02_SERVICE_ORIGIN ||
                event.source !== active.iframe.contentWindow || !data ||
                data.bridgeId !== active.bridgeId)
                return;

            if(data.type === "wordakn4il-ready")
            {
                var retained = WEB02_get_pdf_context(active.sourceUrl);
                if(!retained)
                {
                    active.error.textContent = "ה־PDF הזמני פג; יש לבחור אותו מחדש.";
                    WEB02_close_wordakn4il_overlay();
                    return;
                }
                event.source.postMessage({
                    type: "wordakn4il-pdf-context",
                    bridgeId: active.bridgeId,
                    sourcePage: active.sourcePage,
                    sourceLocation: active.sourceLocation,
                    file: retained.file,
                    expiresAt: retained.expiresAt
                }, WEB02_SERVICE_ORIGIN);
            }
            else if(data.type === "wordakn4il-memory-rejected")
            {
                active.error.textContent =
                    "אין די מרווח זיכרון להמרה המשובצת. ה־PDF נשאר באחסון; " +
                    "לחץ שוב על WordAKN4IL כדי לפתוח את מסלול האחסון.";
                active.trigger.dataset.storageFallback = "true";
            }
            else if(data.type === "wordakn4il-convert-request")
            {
                event.source.postMessage({
                    type: "wordakn4il-convert-error",
                    bridgeId: active.bridgeId,
                    detail: "גרסת ההמרה המקומית הוחלפה במנוע המאובטח. יש לרענן את הדף ולנסות שוב."
                }, WEB02_SERVICE_ORIGIN);
            }
        });
        document.addEventListener("keydown", function(event) {
            if(event.key === "Escape" && WEB02_active_bridge)
                WEB02_close_wordakn4il_overlay();
        });
    }

    function WEB02_open_retained_pdf_in_word(sourceUrl, serviceUrl, trigger, error)
    {
        var retained = WEB02_get_pdf_context(sourceUrl);
        if(!retained)
            return false;

        WEB02_install_pdf_context_bridge();
        var overlay = WEB02_get_wordakn4il_overlay();
        var iframe = overlay.querySelector(".wordakn4il-frame");
        var bridgeId = WEB02_bridge_id();
        var bridgedUrl = new URL(serviceUrl.href);
        var sourcePage = WEB02_authorized_source_page();
        if(!sourcePage)
            return false;
        bridgedUrl.searchParams.set("bridge", bridgeId);
        bridgedUrl.searchParams.set("parentOrigin", document.location.origin);
        bridgedUrl.searchParams.set("parentPage", sourcePage);
        bridgedUrl.searchParams.set("sourceLocation", document.location.href);
        WEB02_active_bridge = {
            bridgeId: bridgeId,
            sourcePage: sourcePage,
            sourceLocation: document.location.href,
            targetTitle: serviceUrl.searchParams.get("title") || "",
            sourceUrl: sourceUrl,
            iframe: iframe,
            overlay: overlay,
            trigger: trigger,
            error: error
        };
        overlay.hidden = false;
        document.body.classList.add("wordakn4il-dialog-open");
        iframe.src = bridgedUrl.href;
        return true;
    }

    function WEB02_use_storage_fallback(openWord, error)
    {
        openWord.dataset.storageFallback = "true";
        var storageUrl = new URL(openWord.href);
        storageUrl.searchParams.set("mode", "storage");
        openWord.href = storageUrl.href;
        error.textContent =
            "קובץ מעל 4MB אינו נשמר ב־context. ה־PDF כבר נשמר באחסון; " +
            "לחץ שוב על WordAKN4IL ובחר אותו משם.";
        openWord.focus({ preventScroll: true });
    }

    window.addOpenInWordButtons = function WEB01_add_download_then_word_controls()
    {
        if(!WEB02_authorized_source_page())
            return;
        var cards = document.querySelectorAll(".law-card");
        cards.forEach(function(card) {
            if(card.querySelector(".wordakn4il"))
                return;

            var actions = card.querySelector(".law-actions");
            var openLaw = actions && actions.querySelector("a");
            if(!actions || !openLaw || !WEB01_is_supported_official_pdf(openLaw.href))
                return;

            var title = card.querySelector("h2");
            var serviceUrl = new URL(WEB01_OPEN_IN_WORD_SERVICE);
            serviceUrl.searchParams.set("title", title ? title.innerText : "חוק");

            var sourceUrl = new URL(openLaw.href);
            var sourceName = decodeURIComponent(sourceUrl.pathname.split("/").pop() || "law.pdf");
            var downloadPdf = document.createElement("a");
            downloadPdf.className = "download-law-pdf";
            downloadPdf.href = openLaw.href;
            downloadPdf.download = sourceName;
            downloadPdf.target = "_blank";
            downloadPdf.rel = "noopener";
            downloadPdf.innerText = "הורד PDF";

            var openWord = document.createElement("a");
            openWord.className = "open-in-word wordakn4il";
            openWord.href = serviceUrl.href;
            openWord.target = "_blank";
            openWord.rel = "noopener";
            openWord.innerText = "WordAKN4IL";
            openWord.hidden = true;
            openWord.setAttribute("aria-haspopup", "dialog");

            var fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "application/pdf,.pdf";
            fileInput.hidden = true;
            fileInput.className = "wordakn4il-file";

            var error = document.createElement("span");
            error.className = "wordakn4il-error";
            error.setAttribute("role", "alert");

            downloadPdf.addEventListener("click", function() {
                WEB01_reveal_word_after_download(openWord);
            });

            openWord.addEventListener("click", function(event) {
                if(openWord.dataset.storageFallback === "true")
                    return;
                event.preventDefault();
                error.textContent = "";
                if(WEB02_open_retained_pdf_in_word(openLaw.href, serviceUrl, openWord, error))
                    return;
                fileInput.click();
            });

            fileInput.addEventListener("change", function() {
                var file = fileInput.files && fileInput.files[0];
                fileInput.value = "";
                if(!file)
                    return;
                if(!WEB02_accepted_downloaded_file(file, sourceName))
                {
                    error.textContent = "יש לבחור את קובץ ה־PDF שהורד עבור החוק הזה.";
                    return;
                }

                if(!WEB02_memory_context_accepts_up_to_4mb(file))
                {
                    WEB02_use_storage_fallback(openWord, error);
                    return;
                }
                WEB02_retain_pdf_context(openLaw.href, file);
                WEB02_open_retained_pdf_in_word(openLaw.href, serviceUrl, openWord, error);
            });

            actions.appendChild(downloadPdf);
            actions.appendChild(openWord);
            actions.appendChild(fileInput);
            actions.appendChild(error);
        });
    };
})();
