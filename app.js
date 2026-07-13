document.addEventListener("DOMContentLoaded", () => {
    const scene = document.querySelector("a-scene");
    const loadingScreen = document.querySelector("#loading-screen");

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
});