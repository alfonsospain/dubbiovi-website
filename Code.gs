/**
 * Google Apps Script Web App for DubbiOvi 2.0 Download Registration
 * Handles HTTP POST requests containing user registration data.
 * Distributed under the EUPL-1.2 License.
 */
function doPost(e) {
  Logger.log("doPost() triggered.");

  var response;
  
  try {
    // 1. Parsing the incoming payload
    Logger.log("STEP 1: Reading incoming payload...");
    Logger.log("Parameters received: " + JSON.stringify(e.parameter));
    if (e.postData && e.postData.contents) {
      Logger.log("Post data contents received: " + e.postData.contents);
    }
    
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        Logger.log("Error parsing JSON body: " + err.toString());
      }
    }
    Logger.log("STEP 1 COMPLETE: Payload parsed successfully.");

    // 2. Extracting variables
    Logger.log("STEP 2: Starting to extract variables...");
    var firstName = data.firstName || e.parameter.firstName;
    var lastName = data.lastName || e.parameter.lastName;
    var institution = data.institution || e.parameter.institution;
    var country = data.country || e.parameter.country;
    var email = data.email || e.parameter.email;
    var platform = data.platform || e.parameter.platform;
    var softwareVersion = data.softwareVersion || e.parameter.softwareVersion;
    var timestamp = data.timestamp || e.parameter.timestamp;
    
    var privacyAccepted = data.privacyAccepted !== undefined ? data.privacyAccepted : e.parameter.privacyAccepted;
    var updatesConsent = data.updatesConsent !== undefined ? data.updatesConsent : e.parameter.updatesConsent;
    
    // Normalize to boolean
    privacyAccepted = (privacyAccepted === true || privacyAccepted === "true");
    updatesConsent = (updatesConsent === true || updatesConsent === "true");
    
    Logger.log("STEP 2 COMPLETE: Variables extracted. Email: " + email + ", Platform: " + platform + ", Privacy Accepted: " + privacyAccepted + ", Updates Consent: " + updatesConsent);

    // 3. Writing to Google Sheets
    Logger.log("STEP 3: Starting to write registration data to Google Sheets...");
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      timestamp, 
      firstName, 
      lastName, 
      institution, 
      country, 
      email, 
      platform, 
      softwareVersion,
      privacyAccepted,
      updatesConsent
    ]);
    Logger.log("STEP 3 COMPLETE: Appended registration row to Google Sheets successfully.");

    // 4. Sending the administrator email
    Logger.log("STEP 4: Starting to send the administrator notification email...");
    var adminEmail = "rodriguezalfonso@uniovi.es"; // Hard-coded address
    var adminSubject = "New DubbiOvi 2.0 Registration - " + firstName + " " + lastName;
    var adminBody = "A new user has registered to download DubbiOvi 2.0.\n\n" +
                    "Name: " + firstName + " " + lastName + "\n" +
                    "Email: " + email + "\n" +
                    "Institution: " + institution + "\n" +
                    "Country: " + country + "\n" +
                    "Platform: " + platform + "\n" +
                    "Version: " + softwareVersion + "\n" +
                    "Time: " + timestamp + "\n\n" +
                    "GDPR Consent & Preferences:\n" +
                    "- Privacy Policy & DMP Accepted: " + (privacyAccepted ? "Yes" : "No") + "\n" +
                    "- Consented to occasional email updates: " + (updatesConsent ? "Yes" : "No");
    GmailApp.sendEmail(adminEmail, adminSubject, adminBody);
    Logger.log("STEP 4 COMPLETE: Administrator notification email sent to: " + adminEmail);

    response = {
      status: "success",
      message: "Registration recorded successfully."
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
