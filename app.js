document.addEventListener("DOMContentLoaded", () => {
    const scene = document.querySelector("a-scene");
    const loadingScreen = document.querySelector("#loading-screen");

    const hotspots = document.querySelectorAll(".hotspot");

    const infoPanel = document.querySelector("#info-panel");
    const panelTitle = document.querySelector("#panel-title");
    const panelDescription = document.querySelector("#panel-description");
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

    hotspots.forEach((hotspot) => {
        hotspot.addEventListener("click", () => {
            const title = hotspot.dataset.title;
            const description = hotspot.dataset.description;

            if (!infoPanel || !panelTitle || !panelDescription) {
                return;
            }

            panelTitle.textContent = title;
            panelDescription.textContent = description;

            infoPanel.classList.remove("hidden");

            console.log(`Opened hotspot: ${title}`);
        });
    });

    function closeInfoPanel() {
        if (infoPanel) {
            infoPanel.classList.add("hidden");
        }
    }

    if (closeButton) {
        closeButton.addEventListener("click", closeInfoPanel);
    }

    if (infoPanel) {
        infoPanel.addEventListener("click", (event) => {
            if (event.target === infoPanel) {
                closeInfoPanel();
            }
        });
    }
});