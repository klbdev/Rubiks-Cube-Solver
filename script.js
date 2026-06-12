// Objects
const paletteButtons = document.querySelectorAll(".color-btn");
const editableStickers = document.querySelectorAll(".sticker:not(.fixed)");
const cubeNetContainer = document.querySelector(".cube-net-container");
const faces = cubeNetContainer.querySelectorAll(".face");
const solveBtn = document.querySelector(".solve-btn");
const identityCubeBtn = document.querySelector(".set-identity-cube-btn");
const resetCubeBtn = document.querySelector(".reset-cube-btn");
const prevBtn = document.querySelector(".previous-btn");
const nextBtn = document.querySelector(".next-btn");
const solutionLine = document.querySelector(".solution-line");
const stepCounter = document.querySelector(".step-counter");
const progressBarFill = document.querySelector(".progress-bar-fill");
const completionRate = document.querySelector(".completion-rate");

// Global variables
let currentBrushColor = "white";
let currentStep = 1;
let totalSteps = 0;
let decodedMovesArray = [];

const color_map = new Map([
    ["white", "U"],
    ["orange", "L"],
    ["green", "F"],
    ["red", "R"],
    ["blue", "B"],
    ["yellow", "D"]
]);

const moveTranslations = {
    "U": "Turn the Up (U) face 90-degrees clockwise.",
    "U'": "Turn the Up (U) face 90-degrees anti-clockwise.",
    "U2": "Turn the Up (U) face 180-degrees.",
    "R": "Turn the Right (R) face 90-degrees clockwise.",
    "R'": "Turn the Right (R) face 90-degrees anti-clockwise.",
    "R2": "Turn the Right (R) face 180-degrees.",
    "F": "Turn the Front (F) face 90-degrees clockwise.",
    "F'": "Turn the Front (F) face 90-degrees anti-clockwise.",
    "F2": "Turn the Front (F) face 180-degrees.",
    "D": "Turn the Down (D) face 90-degrees clockwise.",
    "D'": "Turn the Down (D) face 90-degrees anti-clockwise.",
    "D2": "Turn the Down (D) face 180-degrees.",
    "L": "Turn the Left (L) face 90-degrees clockwise.",
    "L'": "Turn the Left (L) face 90-degrees anti-clockwise.",
    "L2": "Turn the Left (L) face 180-degrees.",
    "B": "Turn the Back (B) face 90-degrees clockwise.",
    "B'": "Turn the Back (B) face 90-degrees anti-clockwise.",
    "B2": "Turn the Back (B) face 180-degrees."
};

const errorTranslations = {
    "Error 1": "Incorrect sticker count. There must be exactly 9 of each color.",
    "Error 2": "Invalid edge pieces. Not all 12 unique edges exist.",
    "Error 3": "Edge flip parity error. One or more edges are flipped impossibly.",
    "Error 4": "Invalid corner pieces. Not all 8 unique corners exist.",
    "Error 5": "Corner twist parity error. A corner is twisted impossibly.",
    "Error 6": "Permutation parity error. Two pieces are impossibly swapped.",
    "Error 7": "No solution found within search limits.",
    "Error 8": "Phase 1 search failed to generate a valid path."
};

// Event listeners
// Check that only 1 color is selected at any time
paletteButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        // Remove selection border from previously selected button
        document.querySelector(".color-btn.selected").classList.remove("selected");
        // Add selection border to newly selected button
        btn.classList.add("selected");
        // Update brush color
        currentBrushColor = btn.classList[1]; // index 1 is the color
    }); 
});

// Update sticker color
editableStickers.forEach(sticker => {
    sticker.addEventListener("click", () => {
        // overwrite sticker color
        sticker.className = "sticker";
        sticker.classList.add(currentBrushColor);
    });
});

solveBtn.addEventListener("click", solveCube);
identityCubeBtn.addEventListener("click", generateIdentityCube);
resetCubeBtn.addEventListener("click", resetCube);

nextBtn.addEventListener("click", () => {
    if (currentStep < totalSteps) {
        currentStep++;
        updateStepUI(currentStep, totalSteps);
    }
});

prevBtn.addEventListener("click", () => {
    if (currentStep > 1) {
        currentStep--;
        updateStepUI(currentStep, totalSteps);
    }
});

// functions
function generateIdentityCube() {
    faces.forEach(face => {
        // Get the center facelet color, and spread its color to neighbouring facelets
        const centerFacelet = face.querySelector(".fixed");
        const centerFaceletColor = centerFacelet.classList[1];
        const editableFacelets = face.querySelectorAll(".sticker:not(.fixed)");
        editableFacelets.forEach(facelet => {
            // Overwrite facelet color
            facelet.className = "sticker";
            facelet.classList.add(centerFaceletColor);
        });
    });
}

// Resets the cube to its grey, unpainted state. Also resets the UI
function resetCube() {
    faces.forEach(face => {
        const editableFacelets = face.querySelectorAll(".sticker:not(.fixed)");
        editableFacelets.forEach(facelet => {
            // Reset facelet color
            facelet.className = "sticker";
        });
    });
    resetSteps();
}
    
// If complete, returns a dictionary with the facelet string 54 chars long.
// If incomplete, returns a dictionary with the location of error.
function getCubeString() {
    let cubeString = "";
    const faceOrder = ["U", "R", "F", "D", "L", "B"];
    for (const faceSymbol of faceOrder) {
        // Get the active face in order
        const currentFace = cubeNetContainer.querySelector(`.face.${faceSymbol}`);
        // Get the stickers for the active face
        const currentFaceStickers = currentFace.querySelectorAll(".sticker");
        for (const [i, sticker] of currentFaceStickers.entries()) {
            const faceColor = color_map.get(sticker.classList[1]); // Looks up the Map to find its associated face color
            if (!faceColor) {
                return {complete: false, error: `${i}${faceSymbol}`};
            }
            cubeString += faceColor;
        }
    }
    return {complete: true, data: cubeString};
}


// Decodes the moves into an array and outputs the current step instruction on the screen
function renderMoves(encodedMoves) {
    const encodedMovesArray = encodedMoves.trim().split(/\s+/);
    currentStep = 1;
    // Stores the sequence of decoded moves in decodedMovesArray, and update totalSteps
    encodedMovesArray.forEach(encodedMove => {
        decodedMovesArray.push(moveTranslations[encodedMove]);
    });
    totalSteps = decodedMovesArray.length;
    // Display the first step. Subsequent steps are handled by the event listeners of prevBtn and nextBtn
    updateStepUI(currentStep, totalSteps);
}

// Updates the solution line, step counter, and progress bar interface
function updateStepUI(cur, total) {
    solutionLine.textContent = decodedMovesArray[cur - 1];
    stepCounter.textContent = `Step ${cur} of ${total}:`;
    const progress = Math.round((cur / total) * 100);
    progressBarFill.style.width = `${progress}%`;
    completionRate.textContent = `${progress}% complete`;
}

// Resets the UI and global variables to the default state
function resetSteps() {
    decodedMovesArray = [];
    solutionLine.textContent = "Your solution appears here...";
    stepCounter.textContent = "";
    progressBarFill.style.width = "0%";
    completionRate.textContent = "0% complete";
}

// Main function for the solve button
function solveCube() {
    const cubeString = getCubeString();
    resetSteps();
    if (!cubeString.complete) {
        window.alert(`Invalid cube: Sticker #${cubeString.error[0]} on face ${cubeString.error[1]} is unpainted!`);
        return;
    }

    // Perform Herbert Kociemba's two-phase algorithm using min2phase.js
    const result = min2phase.solve(cubeString.data);
    if (result in errorTranslations) {
        // Output descriptive error message if solver fails
        window.alert(`Error: ${errorTranslations[result]}`);
        return;
    }

    // If the result is empty, no moves needed. Else, render the moves accordingly
    result === "" ? window.alert("Cube is already solved!") : renderMoves(result);
}



