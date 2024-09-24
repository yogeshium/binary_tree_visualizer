class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

//Function for Drawing .
function drawTree(ctx, node, x, y, xSpace, ySpace, radius) {
  if (node === null) return;

  // Draw the circle for node
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();

  //need to workon better logic for fontsize synchronize
  const fontSize = Math.max(radius - 1.1*node.value.toString().length,1)

  ctx.font = fontSize.toString() + "px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(node.value, x, y);

  const xSpaceNew = xSpace/2;
  const ySpaceNew = (ySpace-(ySpace/5))
  const childRadius=(radius-(radius/5))>=xSpaceNew? xSpaceNew: (radius-(radius/5));

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
    drawTree(ctx, node.left, childX, childY, xSpaceNew, ySpaceNew,childRadius);
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
    drawTree(ctx, node.right, childX, childY, xSpaceNew, ySpaceNew,childRadius);
  }
}


//Creating the tree
function createTree(input) {
  const arr = input.trim().split(" ");

/* Checking If given tree is valid or not: It is checking
  whether given counts of nodes and nulls are valid.
*/
  let childCount = 2;
  for (let i = 1; i < arr.length; i++) {
    if (childCount <= 0) return null;
    if (arr[i] === "X") childCount--;
    else childCount += 2;
    /*
      There is a problem in this logic. 
      If a not null node found, you are doing: childCount+=2 but
      you are placing a node to child so, you have taken a
      empty position. It means you have added two new child positions,
      but also taken one child position too. 
      
      I think this should be here : childCount+=1 
    */
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

  return [root, arr.length];
}


/*
  Need to handle invalid cases
*/
const inputField = document.getElementById("inputField");
const regex =
  /^(?!.*XX)(?!.*[0-9]X)(?!.*X[0-9])(?!.*\s\s)[0-9]+(?:\s+[0-9]+|\s+X|\s+)*$/;

inputField.addEventListener("input", (e) => {
  inputField.style.height = "auto"; // Reset the height
  inputField.style.height = this.scrollHeight + "px"; // Adjust height to content
  if (!regex.test(e.target.value)) {
    console.log("wrong");
  } else {
    const [root, totalNodes] = createTree(e.target.value);
    if (!root) console.log("wrong");
    else {
      const canvas = document.getElementById("treeCanvas");
      canvas.width = Math.min(window.innerHeight, window.innerWidth);
      canvas.height = Math.min(window.innerHeight, window.innerWidth);

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // start
      let x = canvas.width / 2,
        y = canvas.getBoundingClientRect().top + window.scrollY,
        xspace = canvas.width / 4,
        yspace = canvas.height / 8;
        radius = canvas.width / 30;

      drawTree(ctx,root,x,y,xspace,yspace,radius);
    }
  }
});
