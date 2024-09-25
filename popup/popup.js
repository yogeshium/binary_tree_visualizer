class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

/*
The idea behind adjustFontSize:
  This function is triggered on every input.
  It starts by setting an initial font size = radius of that circle.
  A temporary invisible span element is used to measure the width of the typed text.
  If the text width exceeds the box (in cicle) width, the font size is reduced.
  The process continues until the text fits within the box (in circle) or the font size reaches a minimum limit.
*/

function adjustFontSize(radius, value) {
  let fontSize = radius;
  const maxWidth = 2 * (radius - radius / 10);
  // Create a temporary span to measure text width
  const tempSpan = document.createElement("span");
  tempSpan.style.visibility = "hidden";
  tempSpan.style.position = "absolute";
  tempSpan.style.fontSize = fontSize + "px";
  document.body.appendChild(tempSpan);

  // Set the span's text to the same as the node value
  tempSpan.textContent = value;

  // Decrease font size if text is too wide for the box
  while (tempSpan.offsetWidth > maxWidth && fontSize > 2) {
    fontSize -= 1;
    tempSpan.style.fontSize = fontSize + "px";
  }

  // Remove the temporary span
  document.body.removeChild(tempSpan);

  return fontSize;
}

//Function for Drawing .
function drawTree(ctx, node, x, y, xSpace, ySpace, radius) {
  if (node === null) return;

  // Draw the circle for node
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();

  //Adjusting Font size
  const fontSize = adjustFontSize(radius, node.value.toString());

  ctx.font = fontSize + "px Roboto";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(node.value, x, y);

  //calculating horizontal ,vertical space and radius for child nodes
  const xSpaceNew = xSpace / 2;
  const ySpaceNew = ySpace - ySpace / 5;
  const childRadius =
    radius - radius / 5 >= xSpaceNew ? xSpaceNew : radius - radius / 5;

  // Draw left child
  if (node.left) {
    const childX = x - xSpace;
    const childY = y + ySpace;
    ctx.beginPath();
    //drawing line from point on current node circle at bottom middle -
    ctx.moveTo(x, y + radius);
    // to the point on child node circle at top middle
    ctx.lineTo(childX, childY - childRadius);
    ctx.stroke();

    //recursive call for left child
    drawTree(ctx, node.left, childX, childY, xSpaceNew, ySpaceNew, childRadius);
  }

  // Draw right child
  if (node.right) {
    const childX = x + xSpace;
    const childY = y + ySpace;
    ctx.beginPath();
    //drawing line from point on current node circle at bottom middle -
    ctx.moveTo(x, y + radius);
    // to the point on child node circle at top middle
    ctx.lineTo(childX, childY - childRadius);
    ctx.stroke();

    //recursive call for right child
    drawTree(
      ctx,
      node.right,
      childX,
      childY,
      xSpaceNew,
      ySpaceNew,
      childRadius
    );
  }
}

//Creating the tree
function createTree(input) {
  const arr = input.trim().split(" ");

  /* Checking If given tree is valid or not: It is checking
  whether given counts of nodes and nulls are valid.
  Here childCount is empty positions where child nodes can
  deploy.
*/
  let childCount = 2;
  for (let i = 1; i < arr.length; i++) {
    if (childCount <= 0) return null;
    childCount--;
    if (arr[i] !== "N") childCount += 2;
  }

  //Creating Tree - level order wise
  let queue = [];
  const root = new TreeNode(arr[0]);
  queue.push(root);
  let i = 1;
  while (i < arr.length) {
    let node = queue.shift();
    if (i < arr.length && arr[i] !== "N") {
      node.left = new TreeNode(arr[i]);
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== "N") {
      node.right = new TreeNode(arr[i]);
      queue.push(node.right);
    }
    i++;
  }

  return [root, arr.length];
}


/*
  Regex for ensuring : 
    only one 'N' can be there followed by space, it means, we can't type multiple 'N' like this : 'XXX' 
    there should be space between numerical digits and 'N'
    first numerical digits will come followed by 'N'
    there should be only one space between any entity (no multiple space consecutively)
    pattern should be like : numbers + space + (numbes or null) + space ...
*/
const regex =
  /^(?!.*XX)(?!.*[0-9]N)(?!.*N[0-9])(?!.*\s\s)[0-9]+(?:\s+[0-9]+|\s+N|\s+)*$/;

const inputField = document.getElementById("inputField");
const canvas = document.getElementById("treeCanvas");
canvas.width = Math.min(window.innerHeight, window.innerWidth);
canvas.height = canvas.width;
const ctx = canvas.getContext("2d");
const errorMessage = document.getElementById("errorMessage");

// This whole thing work for every input ->
inputField.addEventListener("input", (e) => {
  inputField.style.height = "auto"; // Reset the height
  inputField.style.height = this.scrollHeight + "px"; // Adjust height to content
  if (!regex.test(e.target.value)) {
    //Showing error message 
    inputField.classList.add("invalid");
    errorMessage.classList.remove("hide");
    errorMessage.classList.add("show");
  } else {
    const [root, totalNodes] = createTree(e.target.value);
    if (!root) {
       //Showing error message 
      inputField.classList.add("invalid");
      errorMessage.classList.remove("hide");
      errorMessage.classList.add("show");
    } else {
       //Hiding error message
      inputField.classList.remove("invalid");
      errorMessage.classList.remove("show");
      errorMessage.classList.add("hide");

/* Now we start making tree in canvas: */

      //clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let x = canvas.width / 2,
        y = canvas.getBoundingClientRect().top + window.scrollY,
        xspace = canvas.width / 4,
        yspace = canvas.height / 8;
      radius = canvas.width / 30;

      //draw tree in canvas:
      drawTree(ctx, root, x, y, xspace, yspace, radius);
    }
  }
});
