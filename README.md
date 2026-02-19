⚙️ Setup Guide
1️⃣ Clone the Repository
git clone https://github.com/jagan2506/careerforge-ai-resume-tool/tree/main
cd careerforge-ai-resume-tool

2️⃣ Install Dependencies

Make sure Node.js  is installed.

node -v


Then install packages:

npm install

3️⃣ Environment Variables (If Using AI API)

Create a .env file in the root directory:

OPENAI_API_KEY=your_api_key_here
PORT=3000

4️⃣ Run the Project
npm start


Or for development:

npm run dev


Server will start at:

http://localhost:#port number

📄 PDF Generation (Puppeteer)

If PDF fails or shows blank:

Ensure Puppeteer is installed:

npm install puppeteer


Make sure backend uses:

waitUntil: "networkidle0"


Use this header to force download:

"Content-Disposition": "attachment; filename=resume.pdf"

📁 Project Structure
.
├── server.js
├── package.json
├── .env
├── public/
└── README.md

🧪 Quick Test

Start server

Open app

Analyze resume

Click Download PDF

File should download automatically
