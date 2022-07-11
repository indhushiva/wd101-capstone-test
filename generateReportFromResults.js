let fs = require("fs");

let generateFeedback = (results) => {
  return Object.keys(results)
    .map((key) => {
      let status = results[key];
      let statusSymbol = status == "passed" ? "✓" : "✗";
      return `${statusSymbol} ${key}`;
    })
    .join("\n\n");
};

const writeReport = (data) => {
  console.log(data);
  let reportFile = "./report.json";
  fs.writeFileSync(reportFile, JSON.stringify(data));
};

const readFile = async (filePath) => {
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    return data;
  } catch (err) {
    console.log("File not found | Grading Skipped");
  }
};

readFile("results.json").then((data) => {
  if (data) {
    let results = JSON.parse(data);
    let feedback = generateFeedback(results[Object.keys(results)[0]]);
    writeReport({
      version: 0,
      grade: results["totals"]["failed"] == 0 ? "accept" : "reject",
      status: results["totals"]["failed"] == 0 ? "success" : "failure",
      feedback: feedback,
      report: feedback,
    });
  } else {
    writeReport({
      version: 0,
      grade: "skip",
      status: "failure",
      feedback:
        "We are unable to test your submission, please retry with a valid submission.",
      report: "Unable to generate report due to missing results.json",
    });
  }
});
