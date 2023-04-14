const getIncludes = async () => {
    const selects = document.querySelectorAll("[data-include]");
    selects.forEach(async (select) => {
        const path = select.getAttribute("data-include");
        // select.remove();
        let callback = () => {
            select.replaceWith(...new DOMParser().parseFromString(html, "text/html").body.childNodes);

        }

        var response = await fetch(path);
        var html = await response.text();
        let next = false;
        if (html.indexOf("<script src=") > -1) {
            next = true;
        }
        while (next) {
            var src = html.substring(
                html.indexOf("<script src=" + '"') + 13,
                html.indexOf('"' + "><\/script>")
            );
            let tmp = "<script src=" + '"' + src + '"' + "><\/script>";
            html = html.replace(tmp, "");

            if (html.indexOf("<script src=") > -1) {
                next = true;
            } else {
                next = false;
            }
            generateScriptPromise(src).then(() => {
                console.log("Script " + src + " carregado");
            });
        }

        callback();
    });
};

function generateScriptPromise(src) {
    const scriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            document.body.appendChild(script);
            resolve();
        };
        script.onerror = () => {
            reject();
        };
    });
    return scriptPromise;
}