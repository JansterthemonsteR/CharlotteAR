document.addEventListener("DOMContentLoaded", () => {
    const scene = document.querySelector("a-scene");
    const loadingScreen = document.querySelector("#loading-screen");

    const hotspot = document.querySelector("#hotspot-one");

    const infoPanel = document.querySelector("#info-panel");
    const closeButton = document.querySelector("#close-panel");

    if (!scene) {
        console.error("The A-Frame scene could not be found.");
        return;
    }

    scene.addEventListener("arReady", () => {
        console.log("MindAR is ready.");

        if (loadingScreen) {
            loadingScreen.classList.add("hidden");
        }
    });

    scene.addEventListener("arError", () => {
        console.error("MindAR could not start.");

        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <h1>Camera could not start</h1>
                <p>Please allow camera access and refresh the page.</p>
            `;
        }
    });

    if (hotspot && infoPanel) {
    hotspot.addEventListener("click", () => {
        console.log("Hotspot opened.");

        hotspot.setAttribute("material", "color", "#d97706");
        infoPanel.classList.remove("hidden");
    });
}

    if (closeButton && infoPanel) {
        closeButton.addEventListener("click", () => {
            console.log("Information panel closed.");
            infoPanel.classList.add("hidden");
        });
    }

    if (infoPanel) {
        infoPanel.addEventListener("click", (event) => {
            if (event.target === infoPanel) {
                infoPanel.classList.add("hidden");
            }
        });
    }
});