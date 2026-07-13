document.addEventListener("DOMContentLoaded", async () => {
    const scene = document.querySelector("a-scene");
    const loadingScreen = document.querySelector("#loading-screen");

    const hotspots = document.querySelectorAll(".hotspot");

    const infoPanel = document.querySelector("#info-panel");
    const panelTitle = document.querySelector("#panel-title");
    const panelDescription = document.querySelector("#panel-description");
    const closeButton = document.querySelector("#close-panel");

    let hotspotData = [];

    if (!scene) {
        console.error("The A-Frame scene could not be found.");
        return;
    }

    /*
     * Load the historical information from history.json.
     */
    try {
        const response = await fetch("./data/history.json");

        if (!response.ok) {
            throw new Error(
                `Could not load history.json. Status: ${response.status}`
            );
        }

        const data = await response.json();
        hotspotData = data.hotspots;

        console.log("Hotspot information loaded successfully.");
    } catch (error) {
        console.error("Unable to load hotspot information:", error);
    }

    /*
     * Hide the loading screen when MindAR is ready.
     */
    scene.addEventListener("arReady", () => {
        console.log("MindAR is ready.");

        if (loadingScreen) {
            loadingScreen.classList.add("hidden");
        }
    });

    /*
     * Display an error if the camera cannot start.
     */
    scene.addEventListener("arError", () => {
        console.error("MindAR could not start.");

        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <h1>Camera could not start</h1>
                <p>Please allow camera access and refresh the page.</p>
            `;
        }
    });

    /*
     * Open the matching information when a hotspot is selected.
     */
    hotspots.forEach((hotspot) => {
        hotspot.addEventListener("click", () => {
            const hotspotId = hotspot.dataset.hotspotId;

            const selectedHotspot = hotspotData.find(
                (item) => item.id === hotspotId
            );

            if (
                !selectedHotspot ||
                !infoPanel ||
                !panelTitle ||
                !panelDescription
            ) {
                console.error(
                    `No information was found for hotspot: ${hotspotId}`
                );
                return;
            }

            panelTitle.textContent = selectedHotspot.title;
            panelDescription.textContent = selectedHotspot.description;

            infoPanel.classList.remove("hidden");

            console.log(`Opened hotspot: ${selectedHotspot.title}`);
        });
    });

    /*
     * Close the information panel.
     */
    function closeInfoPanel() {
        if (infoPanel) {
            infoPanel.classList.add("hidden");
        }
    }

    if (closeButton) {
        closeButton.addEventListener("click", closeInfoPanel);
    }

    /*
     * Clicking the dark background also closes the card.
     */
    if (infoPanel) {
        infoPanel.addEventListener("click", (event) => {
            if (event.target === infoPanel) {
                closeInfoPanel();
            }
        });
    }
});