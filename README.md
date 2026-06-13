# Rubiks-Cube-Solver
A web application that can solve any Rubik's cube using Herbert Kociemba's Two-Phase Algorithm.

## Table of contents
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Testing](#testing)

## Installation
### Option 1: Using Git Bash.
```
# Run the following commands in Git Bash
git clone https://github.com/klbdev/Rubiks-Cube-Solver
cd Rubiks-Cube-Solver
start index.html
```
### Option 2: Download the repository.
1. Click the green **Code** button.
2. Select **Download ZIP**.
3. Extract the ZIP file.
4. Double click the `index.html` file in file explorer.

## Usage
### Select the colour palette
1. On the top-left, select a colour by clicking on it. The selected colour will look slightly compressed.
2. Apply the selected colour on the Rubik's cube net by clicking on the grey facelets. You can overwrite a painted facelet by changing the selected colour and clicking on the facelet again.

### Fill the Rubik's cube net
1. The cube net consists of 6 (six) faces, namely Up (U), Left (L), Front (F), Right (R), Back (B), and Down (D).
2. Each face consists of 9 (nine) facelets, with indices 0 to 8 inclusive. 
3. Each face has a specific fixed colour. You cannot edit the centre facelet of each face as its colour is fixed by design.
4. It is important that you maintain the proper orientation of the cube when painting its facelets. To do so, align your cube such that:

| Centre facelet colour | Orientation |
|--------------|-------|
| White | Up (U) |
| Orange | Left (L) |
| Green | Front (F) |
| Red | Right (R) |
| Blue | Back (B) |
| Yellow | Down (D) |

### Click the 'Solve' button
1. The solution will be outputted on the right side of the screen, where you can follow the instructions step by step.
2. If the cube is incomplete, already solved, or mathematically impossible, an alert will appear with an error message.

## Features
### 'Identity Cube' button
- This button renders the solved cube state on the Rubik's cube net.
### 'Reset' button
- Resets the Rubik's cube net and the solution interface.
### 'Previous' and 'Next' buttons
- These buttons allow you to cycle through the solutions one step at a time to minimise the possibility of skipping steps.
### Step counter and progress bar
- These elements provide visual feedback on the completion rate of your Rubik's cube.

## Testing
[Video](https://youtu.be/xPaNP0tf73Q) demonstration of the user interface on a randomly scrambled cube.

## Acknowledgements
- Herbert Kociemba's [Two-Phase Algorithm](http://www.kociemba.org/cube.htm).
- Javascript implementation of the algorithm [min2phase.js](https://github.com/cs0x7f/min2phase.js/blob/master/README.md) by Shuang Chen.
