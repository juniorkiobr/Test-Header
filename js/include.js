const getIncludes = async () => {
    const selects = document.querySelectorAll("[data-include]");
    selects.forEach(async (select) => {
        const path = select.getAttribute("data-include");
        var response = await fetch(path);
        var html = await response.text();
        select.remove();

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
        document.body.innerHTML += html;
    });
};

function generateScriptPromise(src) {
    const scriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve();
        };
        script.onerror = () => {
            reject();
        };
        document.body.appendChild(script);
    });
    return scriptPromise;
}