const fs = require("fs");
const pdf = require("pdf-parse");

let dataBuffer = fs.readFileSync("pdf-file.pdf");

pdf(dataBuffer).then(function (data) {
  try {
    fs.rmSync("parsed-data.csv");
  } catch (err) {
    console.error("File does not exit!");
  }

  const dataArr = data.text.split("\n");

  dataArr.forEach((value, index) => {
    if (value.includes("CASH DEPOSIT")) {
      fs.appendFileSync(
        "parsed-data.csv",
        `${value.replace("CASH DEPOSIT", "")}, ${dataArr[index - 3]
          .replace(",", "")
          .replace(".00", "")}\n`
      );
    }

    if (
      value.includes("FUND TRANSFER") &&
      !value.replace("FUND TRANSFER", "").includes(".00")
    ) {
      fs.appendFileSync(
        "parsed-data.csv",
        `${value.replace("FUND TRANSFER", "")}, ${dataArr[index - 3]
          .replace(",", "")
          .replace(".00", "")}\n`
      );
    }
  });
});
