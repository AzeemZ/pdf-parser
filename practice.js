const fs = require("fs");
const PDFParser = require("pdf2json");

const pdfParser = new PDFParser(this, 1);
let amount = "",
  accNo = "";

pdfParser.on("pdfParser_dataError", (errData) =>
  console.error(errData.parseError)
);
pdfParser.on("pdfParser_dataReady", (pdfData) => {
  let count = 0;
  pdfParser.data.Pages.forEach(({ Texts }, index) => {
    Texts.forEach((text, textIndex) => {
      const value = decodeURIComponent(text.R[0].T);
      const rawValue = text.R[0].T;

      // if (index === 0) {
      // if (!isNaN(value) && value.includes(".00")) {
      //   amount += `${value}\n`;
      // }

      // if (!isNaN(rawValue) && parseInt(rawValue) !== 0 && rawValue.length >= 4) {
      //   accNo += `${rawValue}\n`;
      // }
      if (value === "CASH DEPOSIT") {
        fs.appendFileSync(
          "./content.csv",
          `${decodeURIComponent(
            Texts[textIndex + 1].R[0].T
          )}, ${decodeURIComponent(Texts[textIndex - 4].R[0].T)}\n`,
          "utf-8"
        );
      }

      if (value === "FUND TRANSFER" && index < 34) {
        fs.appendFileSync(
          "./content.csv",
          `${decodeURIComponent(
            Texts[textIndex - 1].R[0].T
          )}, ${decodeURIComponent(Texts[textIndex - 6].R[0].T)}\n`,
          "utf-8"
        );
      }
      // }
    });
  });

  // pdfParser.data.Pages.map(({ Texts }) => {
  //   Texts.map(({ R }) => {
  //     const value = R[0].T;

  //     if (!isNaN(value) && parseInt(value) !== 0 && value.length >= 4) {
  //       count++;
  //       fs.appendFileSync("./content.csv", `${value}\n`, "utf-8");
  //     }

  //     // if (isNaN(value) && value.includes("%20") && value.includes("%2C")) {
  //     //   const decodedValue = decodeURIComponent(value);
  //     //   if (!isNaN(parseFloat(decodedValue))) {
  //     //     fs.appendFileSync("./content.csv", `${value}\n`, "utf-8");
  //     //   }
  //     // }
  //   });
  // });
  // console.log(count);
});

pdfParser.loadPDF("./pdf-file.pdf");
