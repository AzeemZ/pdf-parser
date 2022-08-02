const fs = require("fs");
const PDFParser = require("pdf2json");

const pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", (errData) =>
  console.error(errData.parseError)
);
pdfParser.on("pdfParser_dataReady", (pdfData) => {
  // fs.writeFile("./content.txt", pdfParser.getRawTextContent(), () => {
  //   console.log("Done.");
  // });
  let count = 0;
  pdfParser.data.Pages.map(({ Texts }) => {
    Texts.map(({ R }) => {
      const value = R[0].T;

      if (!isNaN(value) && parseInt(value) !== 0 && value.length >= 4) {
        count++;
        fs.appendFileSync("./content.csv", `${value}\n`, "utf-8");
      }

      // if (isNaN(value) && value.includes("%20") && value.includes("%2C")) {
      //   const decodedValue = decodeURIComponent(value);
      //   if (!isNaN(parseFloat(decodedValue))) {
      //     fs.appendFileSync("./content.csv", `${value}\n`, "utf-8");
      //   }
      // }
    });
  });
  console.log(count);
});

pdfParser.loadPDF("./pdf-file.pdf");
