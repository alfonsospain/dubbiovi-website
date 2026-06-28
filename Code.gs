/**
 * Google Apps Script Web App for DubbiOvi Download Registration
 * Handles HTTP POST requests containing user registration data.
 */
function doPost(e) {
  Logger.log("doPost() triggered.");

  var response;
  
  try {
    // 1. Parsing the incoming payload (urlencoded format)
    Logger.log("STEP 1: Reading incoming urlencoded payload from e.parameter...");
    Logger.log("Parameters received: " + JSON.stringify(e.parameter));
    Logger.log("STEP 1 COMPLETE: Parameter object accessed successfully.");

    // 2. Extracting variables
    Logger.log("STEP 2: Starting to extract variables from parameters...");
    var firstName = e.parameter.firstName;
    var lastName = e.parameter.lastName;
    var institution = e.parameter.institution;
    var country = e.parameter.country;
    var email = e.parameter.email;
    var platform = e.parameter.platform;
    var softwareVersion = e.parameter.softwareVersion;
    var timestamp = e.parameter.timestamp;
    Logger.log("STEP 2 COMPLETE: Variables extracted successfully from parameters. Registered email: " + email + ", Platform: " + platform);

    // 3. Writing to Google Sheets
    Logger.log("STEP 3: Starting to write registration data to Google Sheets...");
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      timestamp, 
      firstName, 
      lastName, 
      email, 
      institution, 
      country, 
      platform, 
      softwareVersion
    ]);
    Logger.log("STEP 3 COMPLETE: Appended registration row to Google Sheets successfully.");

    // 4. Sending the administrator email
    Logger.log("STEP 4: Starting to send the administrator notification email...");
    var adminEmail = "rodriguezalfonso@uniovi.es"; // Hard-coded address
    var adminSubject = "New DubbiOvi Registration - " + firstName + " " + lastName;
    var adminBody = "A new user has registered to download DubbiOvi.\n\n" +
                    "Name: " + firstName + " " + lastName + "\n" +
                    "Email: " + email + "\n" +
                    "Institution: " + institution + "\n" +
                    "Country: " + country + "\n" +
                    "Platform: " + platform + "\n" +
                    "Version: " + softwareVersion + "\n" +
                    "Time: " + timestamp;
    GmailApp.sendEmail(adminEmail, adminSubject, adminBody);
    Logger.log("STEP 4 COMPLETE: Administrator notification email sent to: " + adminEmail);

    // 5. Constructing the HTML email
    Logger.log("STEP 5: Starting to construct the HTML email for the user...");
    var htmlBody = "<!DOCTYPE html>" +
                   "<html>" +
                   "<head>" +
                   "    <style>" +
                   "        body { font-family: Arial, sans-serif; line-height: 1.6; color: #111827; }" +
                   "        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 12px; }" +
                   "        .header { text-align: center; margin-bottom: 20px; }" +
                   "        .logo { display: inline-block; width: 32px; height: 32px; background: linear-gradient(135deg, #009E52 0%, #00C853 100%); color: #FFFFFF; font-weight: bold; border-radius: 8px; text-align: center; line-height: 32px; font-size: 14px; }" +
                   "        .title { font-size: 20px; font-weight: bold; color: #111827; margin-top: 10px; }" +
                   "        .content { margin-bottom: 20px; }" +
                   "        .button { display: inline-block; padding: 12px 24px; background-color: #00C853; color: #FFFFFF !important; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 15px; }" +
                   "        .footer { font-size: 12px; color: #6B7280; text-align: center; border-top: 1px solid #E5E7EB; padding-top: 15px; margin-top: 20px; }" +
                   "        a { color: #00C853; text-decoration: none; }" +
                   "        a:hover { text-decoration: underline; }" +
                   "    </style>" +
                   "</head>" +
                   "<body>" +
                   "    <div class='container'>" +
                   "        <div class='header'>" +
                   "            <div class='logo'>DO</div>" +
                   "            <div class='title'>Welcome to DubbiOvi!</div>" +
                   "        </div>" +
                   "        <div class='content'>" +
                   "            <p>Dear " + firstName + ",</p>" +
                   "            <p>Thank you for registering to download <strong>DubbiOvi</strong> (version " + softwareVersion + "), the academic audiovisual translation and dubbing platform developed at the University of Oviedo.</p>" +
                   "            <p>Your platform installer download should have started automatically. If it didn't, please use the links below to download the installer directly:</p>" +
                   "            <ul>" +
                   "                <li><strong>Windows</strong>: <a href='https://github.com/alfonsospain/DubbiOvi/releases/download/v1.3.7/DubbiOvi.Setup.1.3.7.exe'>Download for Windows (.exe)</a></li>" +
                   "                <li><strong>macOS</strong>: <a href='https://github.com/alfonsospain/DubbiOvi/releases/download/v1.3.7/DubbiOvi-1.3.7-universal.dmg'>Download for macOS (.dmg)</a></li>" +
                   "            </ul>" +
                   "            <p>To help you get started with the platform, we highly recommend checking out our official documentation:</p>" +
                   "            <p style='text-align: center;'>" +
                   "                <a href='https://dubbiovi.com/usermanual/' class='button'>Access User Manual</a>" +
                   "            </p>" +
                   "            <p>If you have any questions or feedback, feel free to reply to this email.</p>" +
                   "            <p>Best regards,<br/>The DubbiOvi Team<br/>University of Oviedo</p>" +
                   "        </div>" +
                   "        <div class='footer'>" +
                   "            &copy; 2026 Alfonso C. Rodríguez Fernández-Peña. All rights reserved.<br/>" +
                   "            Distributed under the MIT License." +
                   "        </div>" +
                   "    </div>" +
                   "</body>" +
                   "</html>";
    Logger.log("STEP 5 COMPLETE: HTML email body constructed successfully.");

    // 6. Constructing the plain-text email
    Logger.log("STEP 6: Starting to construct the plain-text email for the user...");
    var plainTextBody = "Dear " + firstName + ",\n\n" +
                         "Thank you for registering to download DubbiOvi (version " + softwareVersion + "), the academic audiovisual translation and dubbing platform developed at the University of Oviedo.\n\n" +
                         "Your platform installer download should have started automatically. If it didn't, please use the links below to download the installer directly:\n\n" +
                         "- Windows: https://github.com/alfonsospain/DubbiOvi/releases/download/v1.3.7/DubbiOvi.Setup.1.3.7.exe\n" +
                         "- macOS: https://github.com/alfonsospain/DubbiOvi/releases/download/v1.3.7/DubbiOvi-1.3.7-universal.dmg\n\n" +
                         "To help you get started with the platform, we highly recommend reading the official User Manual at:\n" +
                         "https://dubbiovi.com/usermanual/\n\n" +
                         "If you have any questions or feedback, feel free to reply to this email.\n\n" +
                         "Best regards,\n" +
                         "The DubbiOvi Team\n" +
                         "University of Oviedo";
    Logger.log("STEP 6 COMPLETE: Plain-text email body constructed successfully.");

    // 7. Test sending a second email in the same execution
    Logger.log("STEP 7: Preparing to send the second test email to verify multiple dispatches...");
    GmailApp.sendEmail(
      "rodriguezalfonso@uniovi.es",
      "TEST 2",
      "Hello. This is a second email generated during the same doPost execution."
    );
    Logger.log("STEP 7 COMPLETE: Second test email sent successfully.");

    response = {
      status: "success",
      message: "Registration recorded and download triggered successfully."
    };

  } catch (outerError) {
    Logger.log("OUTER EXCEPTION: doPost() transaction failed. Details: " + outerError.toString());
    response = {
      status: "error",
      message: outerError.toString()
    };
  }

  Logger.log("doPost() complete. Returning response: " + JSON.stringify(response));
  return ContentService.createTextOutput(JSON.stringify(response))
                       .setMimeType(ContentService.MimeType.JSON);
}
