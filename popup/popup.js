class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function drawTree(ctx, node, x, y, horizontalSpacing) {
  if (node === null) return;

  // Draw the node
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, 2 * Math.PI);
  ctx.stroke();

  // Draw the value
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(node.value, x, y);

  // Draw left child
  if (node.left) {
    const childX = x - horizontalSpacing;
    const childY = y + 60;
    ctx.beginPath();
    ctx.moveTo(x, y + 20);
    ctx.lineTo(childX, childY - 20);
    ctx.stroke();
    drawTree(ctx, node.left, childX, childY, horizontalSpacing / 2);
  }

  // Draw right child
  if (node.right) {
    const childX = x + horizontalSpacing;
    const childY = y + 60;
    ctx.beginPath();
    ctx.moveTo(x, y + 20);
    ctx.lineTo(childX, childY - 20);
    ctx.stroke();
    drawTree(ctx, node.right, childX, childY, horizontalSpacing / 2);
  }
}

function createTree(input) {
  const arr = input.trim().split(" ");

  let childCount = 2;
  for (let i = 1; i < arr.length; i++) {
    if(childCount<=0) return null;
    if (arr[i] === "X") childCount--;
    else childCount += 2;
  }

  //Creating Tree - level order wise
  let queue = [];
  const root = new TreeNode(arr[0]);
  queue.push(root);
  let i = 1;
  while (i < arr.length) {
    let node = queue.shift();
    if (i < arr.length && arr[i] !== "X") {
      node.left = new TreeNode(arr[i]);
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== "X") {
      node.right = new TreeNode(arr[i]);
      queue.push(node.right);
    }
    i++;
  }

  return root;
}

const inputField = document.getElementById("inputField");
const regex =
  /^(?!.*XX)(?!.*[0-9]X)(?!.*X[0-9])(?!.*\s\s)[0-9]+(?:\s+[0-9]+|\s+X|\s+)*$/;

inputField.addEventListener("input", (e) => {
  inputField.style.height = "auto"; // Reset the height
  inputField.style.height = this.scrollHeight + "px"; // Adjust height to content
  if (!regex.test(e.target.value)) {
    console.log("wrong");
  } else {
    const root = createTree(e.target.value);
    if (!root) console.log("wrong");
    else {
      const canvas = document.getElementById("treeCanvas");
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawTree(ctx, root, canvas.width / 2, 50, canvas.width / 4);
    }
  }
});

