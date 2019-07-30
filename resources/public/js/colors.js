function calculateChannelValue(n, k, d) {
	var sinArg = Math.PI * k * (n / d);
	return Math.floor(Math.sin(sinArg) * Math.sin(sinArg) * 256);
}

function moveFollower(e) {
	var follower = document.getElementById("follow");
	var width = window.innerWidth;
	var height = window.innerHeight;
	var hor = e.pageX + "px";
	var ver = e.pageY + "px";
	var followerWidth = width / 5;
	var followerHeight = height / 10;

  	if (e.pageX > window.innerWidth / 2) {
    		follower.style.left = e.pageX - followerWidth + "px";
  	}
  	else {
    		follower.style.left = hor;
  	}
  				
	if (e.pageY > window.innerHeight / 2) {
    		follower.style.top = e.pageY - followerHeight + "px";
  	}
	else {
		follower.style.top = ver;
	}
  				
	document.getElementById("rgb-vals").innerHTML=
		"rgb=" + calculateChannelValue(e.pageX, 0.5, width) + 
		   " " + calculateChannelValue(e.pageY, 0.5, height) + 
		   " " + calculateChannelValue(width - e.pageX, 0.5, width);
}

function drawBackground(e) {
	var width = window.innerWidth;
	var height = window.innerHeight;

	document.getElementById("cvs").width = width;
	document.getElementById("cvs").height = height;

	var ctx = document.getElementById("cvs").getContext('2d');   
	var id = ctx.createImageData(width, height);   

	var d = id.data; // Create a reference to the color information for the pixel
	var x, y = 0;

	for (var i = 0; i < width*height; i++) {
		x = i % width;
		y = i / width; // this does not work right, although it's close

		d[(i*4)+0] = calculateChannelValue(x, 0.5, width) ; // Red
		d[(i*4)+1] = calculateChannelValue(y, 0.5, height); // Green
		d[(i*4)+2] = calculateChannelValue(width - x, 0.5, width); // Blue
		d[(i*4)+3] = 0xff; // Alpha          
	}

	ctx.putImageData(id, 0, 0); // Places image 'id' at coordinates 1, 1
}

function showForm(e) {
	var form = document.getElementById("form-div");
	var follower = document.getElementById("follow");
	var width = window.innerWidth;
	var height = window.innerHeight;

	if (formVisibilityFlag) {
		form.style.display = "none";
		follower.style.display = "block";
		formVisibilityFlag = false;	
	}

	else {
		form.style.display = "block";
		follower.style.display = "none";
		formVisibilityFlag = true;
		document.getElementById("red").value = calculateChannelValue(e.pageX, 0.5, width);
		document.getElementById("green").value = calculateChannelValue(e.pageY, 0.5, height); 
		document.getElementById("blue").value = calculateChannelValue(width - e.pageX, 0.5, width);
	}
}
			
var formVisibilityFlag = false;

window.addEventListener("load", drawBackground);
window.addEventListener("resize", drawBackground);
window.addEventListener("click", showForm);
document.getElementById("follower").addEventListener("mousemove", moveFollower);
