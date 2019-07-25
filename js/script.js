imgUploaded = null;
result = null;
rawEle = null;
cenEle = null;
imgSrc = null;
emoji = document.getElementsByClassName('overlay');
function callbackLoad() {
    console.log('callback after face detection model is loaded!');
}

// callback after prediction
function callbackPredict(err, results) {
    result = results;
    cenEle = document.getElementById('censoredImage');
    cenEle.setAttribute('src', imgSrc);
    cenEle.classList.remove("hide");
    for(i=0;i<results['outputs'].length;i++){
        overlay = document.createElement("i");
        overlay.classList.add('overlay','em','hide');
        x = result["outputs"][i].box.x;
        y = result["outputs"][i].box.y;
        h = result["outputs"][i].box.height;
        w = result["outputs"][i].box.width;
        overlay.style.transform="translate("+x+"px,"+y+"px)";
        overlay.style.height = h+'px';
        overlay.style.width = w+'px';
        overlay.classList.remove("hide");
        document.getElementById('container').appendChild(overlay);
    }
    clickListener();
}
function clickListener(){
    for(i=0; i<emoji.length; i++){
        emoji[i].addEventListener("click",function(){
            this.classList.toggle("em-angry");
        });
    }
}
async function detectFaces(){
    await stackml.init({'accessKeyId': '15e4d1331af8253eaa30c13b65ba7252'});
    // load face detection model
    const model = await stackml.faceDetection(callbackLoad);

    // make prediction with the image
    model.detect(rawEle, callbackPredict);
}

function uploadImage(){
    uploadedImage = document.getElementById('uploadImage');
    if (uploadedImage.files && uploadedImage.files[0]) {
        var reader = new FileReader();

        reader.onload = imageIsLoaded;
        reader.readAsDataURL(uploadedImage.files[0]);
    }else{
        console.log("no files");
    }
    detectFaces();
}

function imageIsLoaded(e) {
    rawEle = document.getElementById('rawImage');
    imgSrc = e.target.result;
    imageResizer();
};

function imageResizer(){
    var img = new Image();
    img.src = imgSrc;
    img.onload = function(){
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = 400;
        canvas.height = canvas.width * (img.height/img.width);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        imgSrc = canvas.toDataURL('image/png');
        rawEle.setAttribute('src', imgSrc);
        rawEle.classList.remove("hide");
    };
}