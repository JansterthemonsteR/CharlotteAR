document.addEventListener("DOMContentLoaded", async () => {
    const scene = document.querySelector("a-scene");
    const imageTarget = document.querySelector("#image-target");
const welcomeScreen = document.querySelector("#welcome-screen");
const startButton = document.querySelector("#start-ar");
    const loadingScreen = document.querySelector("#loading-screen");
    const instructions = document.querySelector("#ar-instructions");
    const instructionText = document.querySelector("#instruction-text");

    const hotspots = document.querySelectorAll(".hotspot");

    const infoPanel = document.querySelector("#info-panel");
    const panelTitle = document.querySelector("#panel-title");
    const panelDescription = document.querySelector("#panel-description");
    const panelImage = document.querySelector("#panel-image");
    const panelLink = document.querySelector("#panel-link");
    const closeButton = document.querySelector("#close-panel");

    let hotspotData = [];

    if (!scene) {
        console.error("The A-Frame scene could not be found.");
        return;
    }

    /*
     * Load all historical content from history.json.
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
 * Start MindAR after the visitor presses the button.
 */
if (startButton && welcomeScreen && loadingScreen) {
    startButton.addEventListener("click", async () => {
        startButton.disabled = true;
        startButton.textContent = "Starting...";

        welcomeScreen.classList.add("hidden");
        loadingScreen.classList.remove("hidden");

        try {
            const arSystem = scene.systems["mindar-image-system"];

            if (!arSystem) {
                throw new Error("MindAR system could not be found.");
            }

            await arSystem.start();
        } catch (error) {
            console.error("Unable to start the AR experience:", error);

            loadingScreen.innerHTML = `
                <h1>Camera could not start</h1>
                <p>Please allow camera access and refresh the page.</p>
            `;
        }
    });
}
    /*
     * Hide the loading screen when the camera is ready.
     */
    scene.addEventListener("arReady", () => {
        console.log("MindAR is ready.");

        if (loadingScreen) {
            loadingScreen.classList.add("hidden");
        }

        if (instructions) {
            instructions.classList.remove("hidden");
        }
    });

    /*
     * Show an error if MindAR cannot start.
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
     * Update the instructions when the image is recognized.
     */
    if (imageTarget) {
        imageTarget.addEventListener("targetFound", () => {
            console.log("Tracking image found.");

            if (instructionText) {
                instructionText.textContent =
                    "Mural found — tap a numbered hotspot";
            }

            if (instructions) {
                instructions.classList.add("target-found");
            }
        });

        imageTarget.addEventListener("targetLost", () => {
            console.log("Tracking image lost.");

            if (instructionText) {
                instructionText.textContent =
                    "Point your camera at the mural";
            }

            if (instructions) {
                instructions.classList.remove("target-found");
            }
        });
    }

    /*
     * Open the correct information card.
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

            /*
             * Show or hide the photograph.
             */
            if (panelImage && selectedHotspot.image) {
                panelImage.src = selectedHotspot.image;
                panelImage.alt =
                    selectedHotspot.imageAlt || selectedHotspot.title;

                panelImage.classList.remove("hidden");
            } else if (panelImage) {
                panelImage.src = "";
                panelImage.alt = "";
                panelImage.classList.add("hidden");
            }

            /*
             * Show or hide the Learn More button.
             */
            if (panelLink && selectedHotspot.link) {
                panelLink.href = selectedHotspot.link;
                panelLink.textContent =
                    selectedHotspot.linkText || "Learn More";

                panelLink.classList.remove("hidden");
            } else if (panelLink) {
                panelLink.href = "#";
                panelLink.textContent = "";
                panelLink.classList.add("hidden");
            }

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
     * Clicking outside the white card also closes it.
     */
    if (infoPanel) {
        infoPanel.addEventListener("click", (event) => {
            if (event.target === infoPanel) {
                closeInfoPanel();
            }
        });
    }
});