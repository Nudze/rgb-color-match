const [ boxesContainer, namesContainer ] = document.querySelectorAll("#colors div");
const [ easyBtn, mediumBtn, hardBtn, extremeBtn, newBtn ] = document.querySelectorAll("button");

const boxes = document.getElementsByClassName("box");
const names = document.getElementsByClassName("name");

const [ easy, medium, hard, extreme ] = [ 3, 5, 8, 13 ];

let colors;
let clickedName;
let clickedBox;
let disabledNum = 0;
let currentLevel = easy;

startGame(currentLevel);

onClick(easyBtn, easy);
onClick(mediumBtn, medium);
onClick(hardBtn, hard);
onClick(extremeBtn, extreme);

newBtn.addEventListener("click", function () {
	startGame(currentLevel);
	disabledNum = 0;
	this.innerText = "New Game";
});

function startGame (level) {
	if (colors) clearBoard();

	colors = generateColors(level);
	for (const color of colors) {
		const box = document.createElement("div");
		box.style.backgroundColor = color;
		box.style.height = `${100 / colors.length}%`;
		box.classList.add("box");

		boxesContainer.appendChild(box);
	}

	shuffle(colors);
	for (const color of colors) {
		const name = document.createElement("div");
		name.innerText = color;
		name.classList.add("name");

		namesContainer.appendChild(name);
	}

	addListeners();
}

function clearBoard () {
	for (let i = boxes.length - 1; i >= 0; i--) {
		boxes[i].remove();
		names[i].remove();
	}
}

function addListeners () {
	for (const box of boxes) {
		box.addEventListener("click", boxFunc);
	}
	for (const name of names) {
		name.addEventListener("click", nameFunc);
	}
}

function nameFunc () {
	if (clickedName && clickedName !== this) {
		clickedName.classList.remove("border");
	}
	clickedName = this;
	this.classList.add("border");

	if (clickedBox) check();

	ifNoMoves();
}

function boxFunc () {
	if (clickedBox && clickedBox !== this) {
		clickedBox.classList.remove("border");
	}
	clickedBox = this;
	this.classList.add("border");

	if (clickedName) check();

	ifNoMoves();
}

function disablePair (message) {
	clickedBox.innerHTML = message;
	clickedBox.classList.remove("border");
	clickedBox.removeEventListener("click", boxFunc);
	clickedBox = undefined;
	clickedName.classList.remove("border");
	clickedName.classList.add("disabled-box");
	clickedName.removeEventListener("click", nameFunc);
	clickedName = undefined;
	disabledNum++;
}

function check () {
	if (clickedBox.style.backgroundColor === clickedName.innerText) {
		disablePair("&check;");
	} else {
		disablePair("&cross;");
	}
}

function shuffle (array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[ array[i], array[j] ] = [ array[j], array[i] ];
	}
}

function randomColor () {
	const r = Math.floor(Math.random() * 256);
	const g = Math.floor(Math.random() * 256);
	const b = Math.floor(Math.random() * 256);
	return `rgb(${r}, ${g}, ${b})`;
}

function generateColors (num) {
	const colors = [];
	for (let i = 0; i < num; i++) {
		colors[i] = randomColor();
	}
	return colors;
}

function onClick (btn, level) {
	btn.addEventListener("click", function () {
		startGame(level);
		currentLevel = level;
		disabledNum = 0;
		easyBtn.classList.remove("active");
		mediumBtn.classList.remove("active");
		hardBtn.classList.remove("active");
		extremeBtn.classList.remove("active");
		this.classList.add("active");
	});
}

function ifNoMoves () {
	if (disabledNum === colors.length) {
		for (let i = 0; i < boxes.length; i++) {
			names[i].classList.remove("disabled-box");
			names[i].style.backgroundColor = boxes[i].style.backgroundColor;
			names[i].innerText = boxes[i].style.backgroundColor;
		}
		newBtn.innerText = "Play Again?";
	}
}
