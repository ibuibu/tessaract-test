import { createWorker } from "tesseract.js";
import p5 from "p5/lib/p5.min";

const worker = createWorker({
  logger: (m) => console.log(m),
});

(async () => {
  await worker.load();
  await worker.loadLanguage("eng");
  await worker.initialize("eng");

  await worker.setParameters({
    tessedit_char_whitelist: "0123456789",
  });
})();

const chk = async () => {
  const cv = document.querySelector("canvas");
  const png = cv.toDataURL();

  const {
    data: { text },
  } = await worker.recognize(png);
  if (text === "") {
    document.getElementById("result").textContent = "?";
  } else {
    document.getElementById("result").textContent = text;
  }
};

const ocr = (p: p5) => {
  p.setup = () => {
    p.resizeCanvas(150, 150);
    p.background(245);
  };
  let tempX,
    tempY = 0;
  p.draw = () => {
    p.strokeWeight(7);
    p.fill(0);
    if (p.mouseIsPressed) {
      if (!tempX) {
        tempX = p.mouseX;
        tempY = p.mouseY;
        return;
      }
      p.line(tempX, tempY, p.mouseX, p.mouseY);
      tempX = p.mouseX;
      tempY = p.mouseY;
    } else {
      tempX = null;
      tempY = null;
    }
  };
  p.keyPressed = (key) => {
    if (key.key === "s") {
      p.background(245);
    }
  };
  p.mouseClicked = chk;
};

new p5(ocr, "p5");
