const fs = require("fs");
const pdf = require("pdf-parse");

const pdfFiles = fs.readdirSync("./").filter(filename => {
  if (filename.split(".")[1] === "pdf") {
    return filename;
  }
});

pdfFiles.forEach(filename => {
  extractData(filename);
  fs.rmSync(filename);
})

function extractData(filename) {
  let dataBuffer = fs.readFileSync(filename);

  pdf(dataBuffer).then(function (data) {
    const dataArr = data.text.split("\n");

    dataArr.forEach((value, index) => {
      if (value.includes("CASH DEPOSIT")) {
        const splitValues = value.split(" ")

        fs.appendFileSync(
          filename.replace(".pdf", ".csv"),
          `${splitValues[1].replace("DEPOSIT", "")}, ${dataArr[index - 3]
            .replace(",", "")
            .replace(".00", "")}\n`
        );
      }

      if (
        value.includes("FUND TRANSFER") &&
        !value.replace("FUND TRANSFER", "").includes(".00")
      ) {
        const splitValues = value.split(" ").filter(value => value !== "")
        
        fs.appendFileSync(
          filename.replace(".pdf", ".csv"),
          `${splitValues[0].replace("FUND", "")}, ${dataArr[index - 3]
            .replace(",", "")
            .replace(".00", "")}\n`
        );
      }
    });
  });
}