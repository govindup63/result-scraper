# DSCE End Semester Results Scraper

This script scrapes all the end-semester results from the DSCE result portal and processes the data into downloadable PDFs.

## Features
- Fetches and downloads results for all students based on their USNs.
- Saves the result PDFs into organized directories based on branch codes.
- Simple and quick to set up.

---

## Prerequisites
- [Node.js](https://nodejs.org) (v14 or above recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure the Environment Variables**:
   - Rename `.env.example` to `.env`.
   - Update the `USN` variable in `.env` with the correct DSCE result URL.

   Example `.env` file:
   ```env
   USN='http://XX.XX.XXX.XXX:8080/birt/frameset?__report=mydsi/exam/Exam_Result_Sheet_dsce.rptdesign&__format=pdf'
   ```

4. **Run the Script**:
   ```bash
   npm run dev
   ```

---

## How It Works
1. The script reads the URL from the `.env` file.
2. It makes requests to the DSCE result portal to fetch individual PDFs for each student.
3. Results are saved in directories organized by branch codes and student USNs.

---

## Notes
- Ensure the URL provided in the `.env` file is valid and accessible.
- The script assumes the DSCE portal follows a consistent format for USNs and branches.

---

## Troubleshooting
- If the script fails to fetch data:
  - Verify that the URL in the `.env` file is correct and reachable.
  - Check your internet connection and portal access permissions.
- If the output directory is not created:
  - Ensure the script has write permissions to the project folder.

---

## License
This project is licensed under the MIT License. Feel free to use, modify, and share!

---

### Contribution
If you'd like to contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request. 😊

---

Happy scraping! 🚀
