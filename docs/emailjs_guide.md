Overview
Email communication is a fundamental part of many applications, whether for user inquiries, feedback forms, or notifications. However, setting up an email-sending system often requires a backend server, authentication setup, and complex configurations. This is where EmailJS simplifies the process—allowing you to send emails directly from your application without managing a backend.

The best way to understand how EmailJS works is by building something practical. This Contact Form tutorial will walk you through the entire process of integrating EmailJS into your web application, enabling you to send form submissions straight to your inbox. Whether you're creating a simple inquiry form or an advanced email workflow, the concepts covered here will give you a solid foundation.

#What You'll Learn
In this tutorial, we will cover the following key steps:

Adding an email service – Setting up an email provider to handle outgoing messages
Creating an email template – Defining the structure and content of your emails
Preparing an Auto-Reply template – Setting up automated responses for user submissions
Building an HTML form – Designing the user interface for collecting input
Sending emails using the EmailJS SDK – Connecting everything to send emails effortlessly
#Why Use EmailJS?
Whether you're a hobbyist developing your own page, a startup looking to move fast, or a company optimizing resources, time is a critical factor. Building even a basic email-sending system takes effort—not just in development but in ongoing maintenance. Keeping up with evolving email security standards, deliverability challenges, and system updates can quickly turn into a continuous workload.

This applies to any service that offers a ready-made solution, not just EmailJS. When a tool can eliminate unnecessary development time, reduce maintenance, and ensure reliable performance, it becomes an obvious choice.

With EmailJS, you can focus on building your application rather than managing email infrastructure.
Now, let's get started by adding an email service.

Add an email service
Integrating an email service is a crucial step in setting up EmailJS, as it connects the platform with your email provider. This integration enables seamless email delivery directly from your application, without the need for a dedicated backend.

To get started, navigate to the Email Services(opens new window) page and open the Select Service dialog. Here, you will see two distinct sections: Personal Services and Transactional Services. Each serves a different purpose, depending on the scale and nature of the emails you intend to send.

Personal email services allow integration with providers like Gmail, Zoho, and Outlook 365. These services are best suited for low-volume email sending, such as personal notifications or testing purposes. However, they come with limitations—exceeding the provider's daily sending limit can lead to account restrictions, and sending unsolicited bulk emails may result in spam flagging. For this reason, personal email services are recommended primarily for development or small-scale usage.

Transactional email services are designed for high-volume email sending. These providers specialize in handling large numbers of emails efficiently, ensuring better deliverability and reputation management. Unlike personal email accounts, transactional services minimize the risk of emails being marked as spam and provide greater scalability, making them the preferred choice for production environments.

For this tutorial, we will use Gmail as our email service, but you can choose any provider that suits your needs. To set it up, we assign it the name "Contact Service" and the Service ID contact_service. The next step is to connect the selected email account by clicking "Connect account", followed by pressing "Add Service" to finalize the integration. Once completed, the "Contact Service" is set as the "Default" email service, ready to handle outgoing emails.

Create an email template
With the Contact Service email service in place, the next step is to create an email template. This template defines the subject, content, recipient, and other important details of the emails we send.

To begin, we navigate to the Email Templates(opens new window) page, where we can create a new template. For this example, selecting the "Contact Us" template provides a structured starting point. While not required, setting the Template ID to contact_form in the settings can make it easier to reference in our tutorial.

The template's content consists of a subject line, a content editor, and various email fields. One of the key features of EmailJS templates is the ability to use dynamic variables, which allow us to insert values programmatically.

For instance, our template will include the following placeholders:

{{name}}
{{time}}
{{message}}
Here, name represents the sender's name, time captures the current timestamp, and message contains the actual message content. These variables ensure that each email is personalized based on the data provided at the time of sending.

The next step is defining the email fields.

To Email field specifies the recipient's email address—in this case. In the tutorial, our personal email (e.g., contact@emailjs.com).
From Name field is optional but can be set to the sender's name for clarity.
From Email field determines the sender's email address as it appears to the recipient. If the default email address checkbox is enabled, EmailJS will automatically use the email associated with the selected email service.
Reply-To field ensures that any responses go to the correct sender, typically set to {{email}}, representing the user's email address.
Additionally, the Bcc and Cc fields allow sending copies of the email to different recipients. While CC (Carbon Copy) makes recipients visible to each other, BCC (Blind Carbon Copy) keeps addresses hidden. For this example, these fields can remain empty.
Once the template is configured, saving it finalizes the setup. Returning to the Email Templates page, we can now see the newly created Contact Us template, ready for integration into our application. With this in place, sending automated and personalized emails through EmailJS becomes seamless and efficient.

Prepare an Auto-Reply template
Now that we have our email service and primary template set up, we've met the minimum requirements for sending emails through EmailJS. However, it's always a good idea to acknowledge users when they contact us. Sending an automatic reply reassures them that their message has been received and sets expectations for a response.

To set this up, navigate to Email Templates(opens new window), and create a new template using the "Auto-Reply" bre-built template.

Just like in the previous step, we're using dynamic variables to personalize the message. This isn't required but will make things more convenient in the next steps.

Since this email needs to go directly to the user, we set the To Email field to {{email}}. Additionally, to ensure we receive replies from the user, we can enter our email address in the Reply-To field.

The template is ready. Don't forget to press on the Save button to save the template.

#Free vs. Paid Features
The "Auto-Reply" template includes some paid features, such as embedded images for branding (e.g., logos). Users who want to include these elements can consider upgrading to a paid plan. Alternatively, they can simply edit the template and remove any premium features while keeping the core functionality intact.

#Linking the Auto-Reply to Our Contact Us
Next, we return to our main "Contact Us" template, navigate to the Auto-Reply tab, and select our newly created auto-reply template from the list. After saving the changes, our setup is complete!

With the EmailJS dashboard configured, it's time to move to the next step—adding the code to our website.

Create a contact form
Now that we have our Contact Service and Contact Us email template set up, the final step is to create a simple HTML contact form and send its content via email using EmailJS.

<!DOCTYPE html>
<html>
<head>
    <title>Contact Form</title>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
    <script type="text/javascript">
        (function() {
            // https://dashboard.emailjs.com/admin/account
            emailjs.init({
              publicKey: "YOUR_PUBLIC_KEY",
            });
        })();
    </script>
    <script type="text/javascript">
        window.onload = function() {
            document.getElementById('contact-form').addEventListener('submit', function(event) {
                event.preventDefault();
                // these IDs from the previous steps
                emailjs.sendForm('contact_service', 'contact_form', this)
                    .then(() => {
                        console.log('SUCCESS!');
                    }, (error) => {
                        console.log('FAILED...', error);
                    });
            });
        }
    </script>
</head>
<body>
    <form id="contact-form">
        <!-- To simplify the tutorial, the value is static. -->
        <input type="hidden" name="time" value="Mar 10 2025 08:46">
        <label>Name</label>
        <input type="text" name="name" required>
        <label>Email</label>
        <input type="email" name="email" required>
        <label>Subject</label>
        <input type="text" name="title" required>
        <label>Message</label>
        <textarea name="message" required></textarea>
        <input type="submit" value="Send">
    </form>
</body>
</html>
#Getting Your Public Key
You can obtain your public key from the Account(opens new window) page in the EmailJS dashboard. Once set up, fill in the form fields and hit "Send"—your email should arrive in your inbox. If you don't see it, check the spam folder.

#What Did We Just Do?
First, we load our EmailJS SDK

<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js">
</script>

Second, we initialize the SDK with our public key

emailjs.init({
publicKey: 'YOUR_PUBLIC_KEY',
});
Third, we submit our contact form and send it through EmailJS

emailjs.sendForm('contact_service', 'contact_form', this);
#That’s it!
You now have a fully functional contact form that sends messages directly to your inbox via EmailJS.
Simple, efficient, and no backend required!
Connecting email services
EmailJS is not sending the emails directly. Instead, it allows users to connect their email services, through which the emails will be sent. We support a long list of email services, both personal services and transactional email services.

Personal email services allow connecting personal email providers that offer basic email functionality – an email address and an inbox. These include providers like Gmail, Fastmail, Outlook 365, etc'. Personal email services are useful in EmailJS when you need to send a small number of emails to yourself, or need to send emails to other people from your personal email account. Note, your personal email account could be blocked if you go over the daily limit of the email provider, and your email address could be flagged as spam if you send unsolicited emails to multiple recipients. Our general recommendation is to use personal email services only for development purposes or for very low volume usage.

Transactional email services allow connecting dedicated transactional email providers that were designed to send out a large number of emails to a large number of recipients. These providers are usually more robust, can handle higher volumes, and provide a better email reputation (which means fewer chances your emails will end up in the spam folder). We strongly recommend you use one of these providers for your production environment.

To connect an email service:

Open Email Services(opens new window) page in EmailJS dashboard
Choose from the list of supported services and click on the service
Fill out the service details
Test the email service and make sure you receive the test email
That's it! You have now connected your EmailJS account to at least 1 email service, and we can now move on to creating the email templates.

Creating email templates
Email templates are a fundamental part of EmailJS, allowing you to define the settings and content of every email your application sends.

Each email template consists of key fields such as the subject, email body, recipient address, and other important details. These fields determine the core structure of the email, while dynamic variables allow for personalization by inserting data from your application at runtime. This makes it possible to create highly customized messages without manually crafting each one.

#Adding Dynamic Content
One of the most powerful aspects of EmailJS templates is their ability to use dynamic variables. These variables are replaced with real values when the email is sent, making it possible to insert a user's name, order details, or any other relevant information. For example, instead of writing a static greeting like "Hello, user," you can use a variable to personalize it:

Hello, {{name}}
When sending the email, your application provides the actual data, making each message feel more relevant to the recipient. More details on how to implement this can be found in our guide on Dynamic Variables in Templates.

#Building and Testing Your Template
Creating a new email template in EmailJS is a straightforward process. The Email Templates(opens new window) section in the dashboard allows you to set up a new template by choosing a pre-built template, which you can then edit or fully customize to suit your needs.

EmailJS offers multiple ways to test your templates:

The "Test It" dialog allows you to preview and send a sample email.
The auto-generated JSFiddle provides a hands-on environment where you can see how the template interacts with actual data and test email delivery.
This streamlined approach helps developers and non-technical users alike validate their templates before integrating them into their applications.

#Template Size and Content Guidelines
While email templates are flexible, they do have some limitations.

Each template can accommodate up to 50,000 characters, which should be sufficient for most use cases. Excessively large templates will be ignored by the system to maintain performance and reliability.

For emails that require images, embedding them directly into the template is not recommended. Instead, EmailJS supports embedded attachments, which allow images to be included without bloating the template size.

#Conclusion
Email templates in EmailJS provide a structured and efficient way to manage transactional and automated emails. With support for dynamic content, testing tools, and flexible formatting, they offer a reliable solution for businesses and developers alike. By following best practices—such as keeping templates concise, using variables effectively, and embedding images properly—you can create high-performing emails that enhance user communication.

Pre-built email templates
Creating well-designed, professional emails can be time-consuming, especially without prior experience in email design. To make the process easier, EmailJS provides ready-to-use email templates that allow users to quickly set up and send polished emails with minimal effort. These templates serve as a starting point, offering different styles and use cases while remaining fully customizable.

EmailJS pre-built templates have been tested across popular email clients to ensure consistent formatting and appearance. While minor variations may occur across different email services, our templates are optimized for the best possible display.

Some templates may include premium features, such as embedded images for branding (e.g., logos) or suppressions list for unsubscribing. Users wishing to utilize these features can consider upgrading to a paid plan or, alternatively, remove premium elements while retaining the template's core functionality.

#Dynamic and Static Placeholders
To make customization even easier, each template includes placeholders that help personalize and structure the email content. There are two types of placeholders:

Dynamic Variables – Automatically populate with user-specific data, such as names or order details. This allows for more personalized emails without manual input for each recipient.
Static Placeholders – Indicated by straight brackets (e.g., [Company Name], [Website Link]), these fields require manually enter of information that remains constant for the organization.
Before sending an email, ensure that all placeholders are properly updated to maintain professionalism and prevent incomplete messages.

#"Contact Us" Template
Designed for contact form submissions, this template presents the email as a structured appeal, ensuring clear and complete inquiry details.

#Placeholders Used
title – The subject of the email, representing the nature of the inquiry.
name – The sender's name.
email – The sender's email address, allowing for easy reply.
message – The main body containing the inquiry details.
time – The timestamp when the message was submitted.
This template does not include static placeholders, meaning no manual modifications are required before sending.

#"Auto-Reply" Template
Used for automatic responses, this template is ideal for acknowledging inquiries, such as those submitted through the "Contact Us" template. However, it can be adapted for various scenarios.

#Placeholders Used
Static Placeholders:

Website Link – A clickable link in the logo, directing recipients to the company's website.
Company Name – The organization's name.
Dynamic Variables:

title – References the inquiry's subject, making the response more relevant.
name – The name of the person who submitted the inquiry.
email – The email address of the person being contacted.
#Using a Logo in the Email
This template also includes a static attachment feature for displaying a company logo. To ensure the logo appears correctly in the email:

Save the template.
Navigate to the Attachments tab.
Upload the logo file named "logo.png". For more details check embedding images in emails.
#"Welcome" Template
A template designed to greet new users and introduce them to your service.

#Placeholders Used
Static Placeholders:

Website Link – A clickable link in the logo.
Company Name – The name of the organization.
Company Email – The company's official email address.
Dynamic Variables:

name – The recipient's name.
email – The recipient's email address.
#Using a Logo in the Email
The process is the same as in the Auto-Reply template.

#"Password Reset" Template
This template helps users securely regain access to their accounts.

#Placeholders Used
Static Placeholders:

Website Link – Clickable link in the logo.
Company Name – The organization's name.
Dynamic Variables:

link – The unique password recovery link generated for the user.
email – The recipient's email address.
#Using a Logo in the Email
Same process as in the Auto-Reply template.

#"One-Time Password (OTP)" Template
Designed for sending authentication codes, ensuring secure login verification or transaction approval.

#Placeholders Used
Static Placeholders:

Website Link – Clickable link in the logo.
Company Name – The organization's name.
Dynamic Variables:

passcode – The unique one-time code for authentication.
time – The expiration time of the passcode.
email – The recipient's email address.
#Using a Logo in the Email
Same process as in the Auto-Reply template.

#"Order Confirmation" Template
A detailed order summary template that dynamically generates an itemized breakdown of a customer's purchase.

#Placeholders Used
Static Placeholders:

Website Link – Clickable link in the logo.
Dynamic Variables:

email – The recipient's email.
order_id – The unique order number.
cost – An object containing pricing details:
shipping – Shipping cost.
tax – Total tax amount.
total – Final total cost of the order.
orders – A list of purchased items:
name – Item name.
units – Quantity ordered.
price – Price per unit.
image_url – Public URL of the product image.
#Displaying Product Images
By default, image_url uses external links to images. However, some email clients do not display external images until the recipient manually allows them. To ensure images always displayed, embed them directly into the email using dynamic attachments:

Go to the Attachments tab.
Add a Dynamic Variable Attachment:
Filename: Use a generic name (e.g., item.png).
Parameter Name: Define a parameter (e.g., items).
Modify the orders list to include an embedded image reference:
Instead of using external URLs in image*url, store them in the items variable in the same order as the products in the orders list.
In the image_url parameter, reference the image using Content ID (CID) formatting:
Use the "cid:items*[index]" value, where the index corresponds to the product's index in the orders (e.g., "cid:items_0", "cid:items_1").
Ensure that images are publicly accessible so that EmailJS can download and embed them properly.
#Using a Logo in the Email
Same as in the Auto-Reply template

#"Feedback Request" Template
Designed for gathering customer feedback, this template enables recipients to rate their experience from the email.

#Placeholders Used
Static Placeholders:

Website Link – Clickable link in the logo.
Company Name – The business's name.
Company Email – The company's official email.
Company Phone – The company's contact number.
Dynamic Variables:

email – The recipient's email.
#Using a Logo in the Email
Same as in the Auto-Reply template

#Unsubscribe From Email
To enable the Unsubscribe link, make sure to activate it in the template settings by selecting "Allow unsubscribing from emails." For more details, visit Suppressions List.

#Conclusion
EmailJS pre-built templates provide a fast and efficient way to create professional emails without the hassle of manual design. Whether for inquiries, transactions, or authentication, these templates are fully customizable, ensuring seamless communication across various use cases.
Dynamic variables in templates
All template fields (except for Settings) can contain dynamic variables, which are added by inserting the variable name, surrounded by double (or triple) curly brackets. For example: {{name}} or {{email}}. The dynamic variables are replaced with the values passed through the parameters object of the SDK or API call. If the value of a certain variable is not passed, it will be replaced with an empty string.

Variables added with double brackets are escaped by default, so if you pass "<b>bold</b>" as "message" variable, {{message}} will be replaced with "&lt;b&gt;bold&lt;/b&gt;". If you want the variable to be injected without escaping (if HTML code is passed, for instance) use 3 brackets syntax, like this {{{my_html}}}. However, keep in mind that these variables are unsafe and can be abused.

You can also use one of our built-in variables: user_os, user_ip, user_platform, user_browser, user_version, user_country, and user_referrer.
Have a suggestion for additional built-in variables? Let us know!

The IP address (user_ip) is personal data and is protected by the GDPR compliance requirement. Therefore, the IP addresses are hashed by the md5 algorithm.

The user's country (user_country) is an estimated location and cannot be guaranteed 100% accuracy.

#Restrictions
Please note that the total size of the dynamic variables cannot exceed 50kb except for attachment variables, whose total size is limited by the subscription plan.

Requests that exceed this threshold won't be processed. Feel free to pop up your questions.

#Conditional Rendering
If the template variable has falsy value, the section won't be rendered.

Template Params

{
hasData: false,
}
Template

{{#hasData}}
The "if" section.
This section won't be rendered!
{{/hasData}}

{{^hasData}}
The "else" section. Optional.
This section will be rendered.
{{/hasData}}
#Nested Object
JavaScript's dot notation can be used to access keys that are properties of objects.

Template Params

{
name: {
first: 'Bob',
last: 'Fanky',
},
}
Template

{{name.first}} {{name.last}}
#Loop
If the variable's value is a list, the section will be repeated several times for each item.

The dot can be used to indicate an item of the array.

Template Params

{
names: ['Bob', 'Larry', 'Alice'],
}
Template

{{#names}}
Render names {{.}}
{{/names}}
For the list of objects, the object property can be used instead of a dot.

Template Params

{
persons: [
{ name: 'Bob' },
{ name: 'Larry' },
{ name: 'Alice' },
],
}
Template

{{#persons}}
Hi {{name}}!
{{/persons}}

Adding CAPTCHA verification
CAPTCHA images are used to make sure that a human is submitting the form, and it’s a good way to prevent spam emails and automated form submissions. EmailJS supports integration with the free reCaptcha(opens new window) service by Google, by requiring a CAPTCHA test to be solved in order for an email to be sent.

Only the second version of reCaptcha is supported

To add CAPTCHA support:

Create reCaptcha(opens new window) account or login to the existing account.
Register a new site and add your site domain to the list of domains. If you want to test the template in JSFiddle, please also add jsfiddle.net to the list.
Follow the "client-side integration" instructions as specified in the reCaptcha dashboard. If you are using the send method, please pass the reCaptcha token in the g-recaptcha-response property.
Open your template in the EmailJS template editor, go to Settings tab, and check Enable reCAPTCHA V2 verification checkbox.
Specify the secret key obtained from reCaptcha dashboard.
After the above steps have been completed it won’t be possible to send out an email based on this template without solving a CAPTCHA test first. No additional changes are required – we will automatically send the solved CAPTCHA result along with the send email request.

Try it!

Auto-Reply
It’s possible to turn on automatic reply for each email sent with EmailJS. The auto-reply emails are configured per template.

To add the auto-reply email, please follow the next steps:

Open the template you want to add the auto-reply to.
Navigate to the Auto-Reply tab and link any template from your templates collection.
Save template
That’s it! Each time you send an email using this template, we will automatically send another email with the template in the Auto-Reply section.

Auto-Reply will consume an additional request quota.

#Linked Template
"Linked Template" is a new implementation of auto-replies that replaces the previous feature and allows you to link two templates. The linked template will also be processed and sent every time the main template is called.

Main advantages

One template instead of configuring the auto-reply into each template.
A "real" template where attachments and other settings can be set up.
Shared dynamic attachments for both templates will be counted as one attachment.
An independent record in the Email History for the linked template.
Some limitations

No chain. If the linked template also has the "Linked Template" setting, this link will be ignored.
Cannot link to itself.
reCaptcha verification will not be performed for the linked template if this setting is set.

Collecting contacts
Each email sent through EmailJS can automatically create a new contact (if the contact does not already exist). To enable this feature please follow the next steps:

Open your template - Contacts tab.
Check Save Contacts checkbox.
Fill out the values for the fields (Contact Email field is required, the rest are optional). Usually, the values for the contact will be passed through the template params. So, for example, if you're passing customer_name variable which you want to use as the name of the contact, put {{customer_name}} inside the name field.
Save your template.
After which every time the template is used for an email, EmailJS will automatically check if a contact for the email already exists, and if not – a new contact will be created according to the contact parameters.

#Viewing and exporting contacts
All the created contacts are available under the Contacts(opens new window) section. All the contacts are displayed by default, but it’s possible to filter the displayed contacts by the template that created them. Exporting a CSV file of all contacts is possible via the Export to CSV button.

File attachments
Adding file attachments is possible in two ways – by passing the attachment content programmatically through the emailjs.send() call, or by allowing the user to upload a file. The latter is done by creating a form with a file input field, and sending the email via emailjs.sendForm(). To get started with either option first open your template editor - Attachments tab, and add an attachment.

#Static Attachments
Static attachments have no dynamic parameters but are loaded as static files. This attachment will be automatically sent with every email sent for your current template.

#Dynamic Attachments
Dynamic attachments are used to send attachments from your code.

#Attachment type
Choose Form File Attachment if you want to allow the visitors of your site to upload files and attach them to your email.
Choose Variable Attachment if you want to create an attachment programmatically, for example, a canvas image.
#Filename
Specifies the file name of the attachment (e.g. "image.png"). Can be a string or dynamic variable.

#Content type
Specifies the content type of the attachment (e.g. "PNG").

#Parameter name
Specifies the name of the input field for the file upload if you use Form File Attachment type. The input should be of type "file" and be part of the form passed to the emailjs.sendForm() call.

For the attachments of type Variable Attachment, this is the name of the template parameter. This field contains the content of the attachment encoded in Base64 or URL.

#Code Example
Below you can find examples for dynamic attachments.

#Form File Attachment
Here’s a simple front-end example of sending an email with one attachment, added via file upload:

function formSubmit(event) {
event.preventDefault();
emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this);
}

<form enctype="multipart/form-data" method="post" onsubmit="formSubmit()">
    <label>Attach file:</label>
    <input type="file" name="my_file"> 
    <input type="submit" value="Submit">
</form>
To run this example create a template with the attachment of type Form File Attachment, and set the parameter name as my_file.

#Variable Attachment
Here’s an example of sending canvas image as attachment.

function sendCanvasAsAttachment(canvas) {
var base64 = canvas.toDataURL();
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
content: base64
});
}
To run this example create a template with an attachment of type Variable Attachment, and set the parameter name as content.

Note that the content should be passed in base64 format or URL. In the example above the toDataURL() method returns data encoded already to base64. To encode arbitrary content to base64 use btoa() method.

Embedded images
There is a constant need to insert a picture into content, for example, showing a logo, sharing a screenshot, and so on. In these cases, the Content ID (CID) applies, which is supported by static and dynamic attachments.

Please note that only images can be embedded into the content.

To add an embedded image, simply insert the img tag and provide the CID for the src attribute.

<img src="cid:YOUR_ATTACHMENT_CID" alt="attachment">
#Static Attachments Embedded
Every time a static attachment is uploaded to the cloud, it will get the CID. For static attachments, Content-ID is the full file name, except that the CID cannot contain spaces and is character sensitive.

#Example
In order to add a company logo to outgoing emails, it is best to use Static Attachments. As an example, we will create a file with our logo and name it logo.png. Once the image is uploaded and we have a new logo.png static attachment, go to the Content tab and open the code source (<> button) for editing the HTML code. Insert that company logo where it's supposed to be. In this scenario, the actual code of the embedded image should look like this:

<img src="cid:logo.png" alt="Logo">
The company logo has been added. Save the template and test the result.

#Dynamic Attachments Embedded
For dynamic attachments, the Content ID is Parameter Name. Note that the image will always be in the template, even if the content isn't presented in a dynamic variable.

#Example
There is not much difference from Static Attachments. Say, we want to email the result of some drawings on canvas. Create a dynamic attachment with the Parameter Name: canvas. The HTML code for this example should look as below:

<img src="cid:canvas" alt="My Impression">
Then save the template and test it.

Multi-Factor Authentication
Multi-Factor Authentication (MFA) is a best practice that adds an extra layer of protection on top of your email and password. With MFA enabled, when you sign in to an EmailJS dashboard, you will be prompted for your email and password (the first factor), as well as for an authentication code from your MFA device (the second factor). Taken together, these multiple factors provide increased security for your EmailJS account settings and resources.

To enable MFA for your EmailJS account, please follow the next steps:

Open the Personal Settings.
Navigate to the Security tab, and press Enable MFA.
Fill out the details of the MFA.
Activate MFA
EmailJS does not charge any additional fees for using MFA.

#Virtual MFA Applications
Applications for your smartphone can be installed from the application store that is specific to your phone type.

Authy
LastPass Authenticator
Microsoft Authenticator
Google Authenticator
Other apps that are compliant with RFC 6238, a standards-based TOTP (time-based one-time password) algorithm
#Change MFA device
You can have only one MFA device assigned to you at a time. If you need to replace it for any reason, you must first deactivate the old device, then you can add the new device.

Multi-user access
Multi-user login allows you to grant access to other users for your EmailJS account, helping you manage account effectively and securely. You can grant different levels of permissions to multiple users, who will be able to then access your EmailJS account while logged into their own personal dashboard.

#How it works
When you create your account, you will receive the full set of permissions for your account by default. As a result, you can grant different permissions to other EmailJS users.

To grant access to other users for your EmailJS account, go to Team Members.

You have to be logged in with an Account Access permission in order to grant other users access to your account.

#Access permissions
We offer four different access permissions for users, depending on what you want other users to be able to do on your ad account.

Account Access: User has full access to the EmailJS account, including the ability to add and remove users, as well as change their permissions. This access automatically adds the entire set of other access permissions for the user.

Service Access: User can add, edit, and delete email services. And also view their credentials and set up default service. Other features will be in the Read-Only access.

Template Access: User can add, edit, clone, and delete email templates. Other features will be in the Read-Only access.

Read-Only Access: User cannot edit or delete any information for the account, except for Personal Settings. Team management and services credentials won't be available for viewing. The user can view account settings such as API keys, download invoices, etc.

#Setting up multi-user access
Make sure you have Account Access permission and the required plan tier.

Log into your EmailJS dashboard(opens new window).
In the left panel, navigate to Team Members.
Click "Invite Teammate".
Enter name and email address.
Set the desired access permissions.
Click "Send Invitation".
The user will receive an email with further instructions to activate personal access.

Suppressions List
When a user unsubscribes from your emails, EmailJS automatically adds the email address to the suppressions list.

The suppressions list contains all the addresses to which you cannot send emails. It can be on the scope of your specific templates or your account in general.

You’ll find all the addresses on the suppressions list in the Suppressions menu to the left. The list contains the data for all your templates. If an email address was suppressed for more than one template, it appears multiple times on the list.

Note that EmailJS verifies whether an email is present on a suppressions list before sending the email. If an address is found, the email will automatically be rejected with unsubscribed status. However, the API will return a successful status since no errors occurred.

This feature is available from the Professional plan or higher.

#How it works
All templates are marked as mandatory by default, and users cannot unsubscribe from them. To allow unsubscribing from a specific template, please visit its settings and check the appropriate checkbox.

In rare cases, some email agents do not support automatic one-click unsubscribe. In this case, the mail agent will send a mail report to the email address specified in the template unsubscribe settings. This recipient has to be unsubscribed manually.

After changing these settings, add an unsubscribe link to the template content.

If you're using the Design Editor, press "Insert/edit link", and set the URL input field to {{user_unsubscribe}} in the opened pop-up.
For the Code Editor, add an A tag with the value {{user_unsubscribe}} in the href attribute.

<a href="{{user_unsubscribe}}" target="_blank" rel="noopener">Unsubscribe</a>
The recipient will have the option to unsubscribe from this specific template or all non-mandatory templates.

#How to forcefully send a suppressed email?
The email can be resent without suppression from the Email History page. However, this option should only be used in exceptional cases, as it may seriously impact your sender's reputation.

#What about multi-recipients?
All suppressed addresses will be automatically removed from the list of recipients, and the request will be marked as successful. If one of the recipients wants to unsubscribe from emails, he will need to enter his email address since auto-detection of the address will not work in this case.

#Why is Cc or Bcc still receiving emails?
The addresses specified in the Cc or the Bcc fields are not the direct recipients of the emails and, according to generally accepted practice, cannot unsubscribe from them.

It would be better not to use the Cc or the Bcc fields to email your clients.
Since they can't unsubscribe, they will likely mark these emails as spam.

Installation
This guide goes through the various methods used to install EmailJS SDK.

#Package manager
If you are using modern frameworks or another way to bundle your application, then you can use one of package managers to install EmailJS SDK.

Install EmailJS SDK using npm(opens new window):

$ npm install --save @emailjs/browser
Alternatively, you can also install the SDK via Yarn(opens new window):

$ yarn add @emailjs/browser
#Browser script
In order to get started using EmailJS on your website just paste the following code snippet before closing tag, with the correct public key:

<script type="text/javascript"
        src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js">
</script>
<script type="text/javascript">
   (function(){
      emailjs.init({
        publicKey: "YOUR_PUBLIC_KEY",
      });
   })();
</script>

You can obtain your public key from the Account(opens new window) page in the EmailJS dashboard.

Options
Learn more about how to configure the SDK. These options are set when the SDK is initialized and passed to the init() function as an object.
You can also customize or overwrite it when the SDK method is called to process the request.

#publicKey
The public key is required to identify your account and is a required variable. You can obtain your public key from the Account(opens new window) page in the EmailJS dashboard.

Browser JavaScript Node.js Flutter React Native

#privateKey
Additionally, a private key can be used for authorization if such an option is enabled on the Account - Security(opens new window) page.

Node.js Flutter

#blockHeadless
When enabled, the SDK will not process request in headless browsers.

This option is turned off by default.

For headless browsers an error 451 - "Unavailable For Headless Browser" will be returned.

Browser JavaScript

#blockList
An object. This configuration controls whether requests are blocked for certain values in the variable. When the variable specified in watchVariable contains a value from the list, then requests won't be sent to EmailJS.

Name Type Description
list String[] The list of strings contains suspended values
watchVariable String A name of the variable to be watched
This option is turned off if one of the properties is not set.

If the value is in the list, the request method will return an error 403 - "Forbidden".

Browser JavaScript Node.js React Native Flutter

#limitRate
An object. This option allows SDK to process requests no more often than specified in the throttle. / The rate limit is per page by default. To override the behavior, an id can be set. This ID can be useful in setting the throttle for each page, group, or whole application.

Name Type Description
id String (optional) Sets the throttle ID
throttle Number (ms) After how many milliseconds a next request is allowed
This option is turned off if throttle is 0 or not set.

Error 429 - "Too Many Requests" will be returned when the rate limit blocks the request.

Browser JavaScript Node.js React Native Flutter

emailjs.init
This method allows the setup of Options for the application globally. The configuration should happen before any send email method is called.

#Syntax
emailjs.init(options);
#Code Example
emailjs.init({
publicKey: 'YOUR_PUBLIC_KEY',
// Do not allow headless browsers
blockHeadless: true,
blockList: {
// Block the suspended emails
list: ['foo@emailjs.com', 'bar@emailjs.com'],
// The variable contains the email address
watchVariable: 'userEmail',
},
limitRate: {
// Set the limit rate for the application
id: 'app',
// Allow 1 request per 10s
throttle: 10000,
},
});

emailjs.send
The basic method to send an email with EmailJS.

#Syntax
emailjs.send(serviceID, templateID, templateParams, options);
#Rate Limit
1 request per second

#Parameters
NAME TYPE DESCRIPTION
serviceID String Service ID of the service through which the email should be sent. Reserved keyword default_service is supported, and should be used to use the default service, which can be set and changed via EmailJS dashboard
templateID String Template ID of the email
templateParams Object Template parameters of the template
options Options (optional) Locally setting or overriding options. It’s not required if init() method is used
#Result
The method returns the Promise. Where response is object what contains the status and the text properties.

#Code Example
var templateParams = {
name: 'James',
notes: 'Check this out!',
};

emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams).then(
(response) => {
console.log('SUCCESS!', response.status, response.text);
},
(error) => {
console.log('FAILED...', error);
},
);

emailjs.sendForm
If you are using EmailJS to send form details, sendForm will automatically collect the values of the form and pass them to the specified template. The form should have a distinct ID, and the name attribute of each field should correspond to the variable name used in the template.

#Syntax
emailjs.sendForm(serviceID, templateID, form, options);
#Rate Limit
1 request per second

#Parameters
NAME TYPE DESCRIPTION
serviceID String Service ID of the service through which the email should be sent. Reserved keyword default_service is supported, and should be used to use the default service, which can be set and changed via EmailJS dashboard
templateID String Template ID of the email
form String, HTMLFormElement It can be HTMLFormElement or query selector
options Options (optional) Locally setting or overriding options. It’s not required if init() method is used
#Result
The method returns the Promise. Where response is object what contains the status and the text properties.

#Code Example
emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', '#myForm').then(
(response) => {
console.log('SUCCESS!', response.status, response.text);
},
(error) => {
console.log('FAILED...', error);
},
);

/send
Sends an email based on the specified email template and the passed dynamic parameters. The email is sent via the specified email service or via the default service if default_service keyword is passed.

#Resource URL
POST https://api.emailjs.com/api/v1.0/email/send
#Request Information
Content type is 'application/json'

#Rate Limit
1 request per second

#Parameters
NAME REQUIRED DESCRIPTION
service_id Yes Service ID of the service through which the email should be sent. Reserved keyword default_service is supported, and should be used to use the default service, which can be set and changed via EmailJS dashboard.
template_id Yes Template ID of the email
user_id Yes Public Key of the account
template_params No Template parameters of the template
accessToken No Private Key of the account
#Response Information
Response formats is JSON or Text

#Example Response
Success status:

200 "OK"
Failure status:

400 "The user_id parameter is required"
#Code Example
For this example we will use jQuery library. It has ajax and supports very old browsers.

// code fragment
var data = {
service_id: 'YOUR_SERVICE_ID',
template_id: 'YOUR_TEMPLATE_ID',
user_id: 'YOUR_PUBLIC_KEY',
template_params: {
'username': 'James',
'g-recaptcha-response': '03AHJ_ASjnLA214KSNKFJAK12sfKASfehbmfd...'
}
};

$.ajax('https://api.emailjs.com/api/v1.0/email/send', {
type: 'POST',
data: JSON.stringify(data),
contentType: 'application/json'
}).done(function() {
alert('Your mail is sent!');
}).fail(function(error) {
alert('Oops... ' + JSON.stringify(error));
});
// code fragment

/send-form
Sends an email based on the specified email template and the passed form data. The email is sent via the specified email service or via the default service if default_service keyword is passed.

#Resource URL
POST https://api.emailjs.com/api/v1.0/email/send-form
#Request Information
Content type is 'multipart/form-data'

#Rate Limit
1 request per second

#Parameters
NAME REQUIRED DESCRIPTION
service_id Yes Service ID of the service through which the email should be sent. Reserved keyword default_service is supported, and should be used to use the default service, which can be set and changed via EmailJS dashboard.
template_id Yes Template ID of the email
user_id Yes Public Key of the account
accessToken No Private Key of the account
#Response Information
Response formats is JSON or Text

#Example Response
Success status:

200 "OK"
Failure status:

400 "The user_id parameter is required"
#Code Example
For this example we will use jQuery library. It has ajax and supports very old browsers.

// code fragment
// the form id is myForm
$('#myForm').on('submit', function(event) {
event.preventDefault(); // prevent reload

    var formData = new FormData(this);
    formData.append('service_id', 'YOUR_SERVICE_ID');
    formData.append('template_id', 'YOUR_TEMPLATE_ID');
    formData.append('user_id', 'YOUR_PUBLIC_KEY');

    $.ajax('https://api.emailjs.com/api/v1.0/email/send-form', {
        type: 'POST',
        data: formData,
        contentType: false, // auto-detection
        processData: false // no need to parse formData to string
    }).done(function() {
        alert('Your mail is sent!');
    }).fail(function(error) {
        alert('Oops... ' + JSON.stringify(error));
    });

});
// code fragment

/history
Get a list of history records

#Resource URL
GET https://api.emailjs.com/api/v1.1/history
#Rate Limit
1 request per second

#Parameters
NAME REQUIRED DESCRIPTION
user_id Yes Public Key of the account
accessToken Yes Private Key of the account
page No A current page
count No Records in one page
errors_only No Get only failed records
#Response Information
Response formats is JSON or Text

#Example Response
Success status:

{
"is_last_page": true, // we don't have more records
"rows": [
{
"id": "email_0537496c6cf98417e10eb2d8",
"user_id": "YOUR_PUBLIC_KEY",
"result": 1, // 1 is success
"error": null,
"provider": "Yandex",
"service_id": "default_service",
"original_service_id": "yandex",
"template_id": "example_template",
"template_params": "{\"user_os\":\"macOS Mojave\"}", // your stringify template params
"files": "[]", // attachments list
"retry_count": 0,
"created_at": "2019-10-24T16:55:17.000Z",
"updated_at": "2019-10-24T16:55:17.000Z"
},
{
"id": "email_f1cb808c2545161b1a5fa4c4",
"user_id": "YOUR_PUBLIC_KEY",
"result": 2, // 2 is error,
"error": "Zoho: Invalid login: 535 Authentication Failed", // error message
"provider": "Zoho",
"service_id": "zoho",
"original_service_id": "zoho",
"template_id": "example_template",
"template_params": null,
"files": "[]",
"retry_count": 0,
"created_at": "2019-09-26T13:08:05.000Z",
"updated_at": "2019-09-26T13:08:05.000Z"
}
]
}
Failure status:

400 "The user_id parameter is required"
#Code Example
GET https://api.emailjs.com/api/v1.1/history?user_id=YOUR_PUBLIC_KEY&accessToken=YOUR_PRIVATE_KEY&page=1&count=50

Example:
React
React(opens new window) is a JavaScript library for building user interfaces. EmailJS works with all modern frameworks, and React is no exception.

Below we show how to create the contact form components, ContactUs.js:

import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';

export const ContactUs = () => {
const form = useRef();

const sendEmail = (e) => {
e.preventDefault();

    emailjs
      .sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form.current, {
        publicKey: 'YOUR_PUBLIC_KEY',
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );

};

return (
<form ref={form} onSubmit={sendEmail}>
<label>Name</label>
<input type="text" name="user_name" />
<label>Email</label>
<input type="email" name="user_email" />
<label>Message</label>
<textarea name="message" />
<input type="submit" value="Send" />
</form>
);
};
