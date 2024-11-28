import axios from "axios";
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import dotenv from "dotenv";
dotenv.config();

// Branch data with branch codes and the last USN
const branchData: Record<string, number> = {
  AE: 68,
  AI: 63,
  AU: 63,
  BT: 63,
  CB: 63,
  CD: 63,
  CG: 63,
  CH: 52,
  CS: 264,
  CV: 182,
  CY: 63,
  EC: 255,
  EE: 126,
  EI: 63,
  ET: 126,
  IC: 63,
  IS: 191,
  MD: 63,
  ME: 125,
  RI: 63,
};

// Function to fetch and save the result PDF for a single USN
async function fetchResultPDF(
  usn: string,
  branchCode: string,
  parentDirectory: string,
) {
  try {
    const url = `${process.env.USN}&USN=${usn}`;

    // Create the branch directory inside the parent directory if it doesn't exist
    const branchDirectory = path.join(
      parentDirectory,
      branchCode.toUpperCase(),
    );
    if (!fs.existsSync(branchDirectory)) {
      fs.mkdirSync(branchDirectory);
    }

    // Download the PDF temporarily to read it
    const tempFilePath = path.join(branchDirectory, `${usn}_temp.pdf`);
    const response = await axios.get<any>(url, {
      responseType: "arraybuffer", // Fetch as arraybuffer to work with binary data
    });
    fs.writeFileSync(tempFilePath, response.data);

    // Read and parse the PDF to extract the student's name
    const dataBuffer = fs.readFileSync(tempFilePath);
    const data = await pdfParse(dataBuffer);

    // Extract student's name from the PDF content
    const nameMatch = data.text.match(/Name of the Student:\s*(.+)/);
    let studentName = usn; // Default name to USN if no name is found
    if (nameMatch && nameMatch[1]) {
      studentName = nameMatch[1].trim();
    }

    // Sanitize the student's name to be file-system safe
    const sanitizedStudentName = studentName.replace(/[<>:"/\\|?*]+/g, "");

    // Define the final file path based on the student's name
    const finalFilePath = path.join(
      branchDirectory,
      `${sanitizedStudentName}.pdf`,
    );

    // Check if the file already exists
    if (fs.existsSync(finalFilePath)) {
      console.log(
        `File for ${sanitizedStudentName} already exists. Skipping download.`,
      );
      fs.unlinkSync(tempFilePath); // Delete the temporary file
      return;
    }

    // Rename the temporary PDF file to the student's name if it doesn't already exist
    fs.renameSync(tempFilePath, finalFilePath);

    console.log(
      `Result PDF saved as ${sanitizedStudentName}.pdf for USN ${usn}`,
    );
  } catch (error: any) {
    console.error(
      `Error fetching or processing the PDF for ${usn}:`,
      error.message,
    );
  }
}

// Function to generate USNs based on the branch code and last USN number
function generateUSNs(branchCode: string, lastUsn: number) {
  const usns = [];
  const prefix = `1DS23${branchCode.toUpperCase()}`; // Ensure branch code is uppercase

  for (let i = 1; i <= lastUsn; i++) {
    // Format the number to be three digits with leading zeros (e.g., 001, 002)
    const number = String(i).padStart(3, "0");
    usns.push(`${prefix}${number}`);
  }

  return usns;
}

// Function to iterate over all USNs for a branch and fetch results
async function fetchResultsForBranch(
  branchCode: string,
  lastUsn: number,
  parentDirectory: string,
) {
  const usns = generateUSNs(branchCode, lastUsn); // Get all USNs for the branch

  for (const usn of usns) {
    await fetchResultPDF(usn, branchCode, parentDirectory); // Fetch result for each USN
  }
}

// Function to create the parent directory and start fetching results
function startFetchingResults() {
  const parentDirectory = path.join(__dirname, "../", "Results_PDF"); // Create a folder for all results
  if (!fs.existsSync(parentDirectory)) {
    fs.mkdirSync(parentDirectory);
  }

  // Fetch results for all branches
  Object.keys(branchData).forEach(async (branchCode) => {
    const lastUsn = branchData[branchCode];
    await fetchResultsForBranch(branchCode, lastUsn, parentDirectory);
  });
}

// Start the fetching process
startFetchingResults();
