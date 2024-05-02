const img = document.querySelector("#image");
const fileInput = document.querySelector("#file");
const downloadBtn = document.querySelector("#download");
const previewBtn = document.querySelector("#preview");
const container = document.querySelector(".container");
const outputCanvas = document.querySelector("#output-canvas");
const postContainer = document.querySelector("#post-upload-container");

let cvReady = false;
let fileName = "";

function openCvReady() {
    cv["onRuntimeInitialized"] = () => {
        cvReady = true;
    };
}

fileInput.onchange = () => {
    let reader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.onload = () => {
        img.setAttribute("src", reader.result);
        container.classList.add("hide");
        postContainer.classList.remove("hide");
    }
    fileName = fileInput.files[0].name.split(".")[0];
}

const imgApply = () => {
    const mat = cv.imread(img);
    const newImage = new cv.Mat();
    cv.cvtColor(mat, newImage, cv.COLOR_BGR2GRAY, 0);
    const edges = new cv.Mat();
    cv.adaptiveThreshold(
        newImage,
        edges,
        255,
        cv.ADAPTIVE_THRESH_MEAN_C,
        cv.THRESH_BINARY,
        9,
        9
    );
    const color = new cv.Mat();
    cv.bilateralFilter(newImage, color, 9, 250, 250, cv.BORDER_DEFAULT);
    cv.cvtColor(mat, color, cv.COLOR_RGBA2RGB, 0);

    const cartoon = new cv.Mat();
    cv.bitwise_and(color, color, cartoon, edges);
    cv.imshow("output-canvas", cartoon);
    mat.delete();
    newImage.delete();
    edges.delete();
    cartoon.delete();
}
previewBtn.addEventListener("click", () => {
    if (cvReady) {
        imgApply();
        downloadBtn.classList.remove("hide");
        let imgData = outputCanvas.toDataURL("image/png");
        downloadBtn.href = imgData;
        downloadBtn.download = `${fileName}.png`;
    } else {
        alert("Something went wrong.Please try again");
    }
})