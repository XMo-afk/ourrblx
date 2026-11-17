# Our Reviews — Moderated publishing setup

This website uses Google Sheets + Google Apps Script to receive reviews. **Every new review is saved as `PENDING` and stays invisible on the website until you approve it.** Visitors do not need an account.

## 1. Create the private review spreadsheet
1. Sign in to Google and create a Google Spreadsheet, for example `Pie x Ryf Reviews`.
2. Keep this spreadsheet private. Do not share it publicly.
3. Open **Extensions → Apps Script**.

## 2. Add the backend
1. Open `google-apps-script/Code.gs` from this website package.
2. Copy all its contents into the Apps Script editor, replacing the starter code.
3. Save the project.

## 3. Deploy as a Web App
1. Click **Deploy → New deployment**.
2. Select **Web app** as the deployment type.
3. Set **Execute as** to **Me**.
4. Set **Who has access** to **Anyone** so website visitors can submit reviews.
5. Click **Deploy**, authorize access if Google asks, and copy the Web App URL ending in `/exec`.

The spreadsheet is private; only the web app endpoint is public. Do not publish or share the spreadsheet itself.

## 4. Connect the website
1. Open `assets/js/main.js`.
2. Find this line near the Our Reviews code:

   `const REVIEWS_API_URL = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';`

3. Replace the placeholder with your copied `/exec` URL. Keep the quotation marks.
4. Save and upload the updated website files to your GitHub Pages repository.

## 5. Review and approve submissions
1. Open your private Google Spreadsheet. The script creates a tab named **Reviews** after the first request.
2. New submissions appear with status **PENDING**.
3. Read the name, rating, and message.
4. To publish a review, change its Status cell from `PENDING` to `PUBLISHED`.
5. To reject a review, leave it as `PENDING` or delete that row.
6. To remove a review that was already published, delete its row or change its status back to `PENDING`.
7. Refresh the website. Only rows marked `PUBLISHED` are shown (up to the latest 100).

## Important notes
- New reviews are **not displayed immediately**; you must approve them in the spreadsheet.
- The submission form has name/message length limits and a hidden honeypot field, but this is basic spam protection, not a full anti-spam system.
- Do not ask visitors to include passwords, private information, or sensitive personal details.
- The site uses a no-CORS form submission, so the page cannot verify the server's response directly. The confirmation shown after submit means the browser sent the request; check the spreadsheet if you need to confirm that it arrived.
- If you change the Apps Script code after deployment, open **Deploy → Manage deployments → Edit**, select a new version, and deploy the update.
