# URL Shortening Service Create or Lookup an Entry

> API service used to create an entry or to also lookup an entry from the Backend. Application form is used to submit a long url for a specific client and a shorturl gets created. The Service will return a json response of the entry. 

# Install dependencies
npm install

# To Launch or Run App
node app.js

# Starting Url
http://localhost:4000/

# Getting it all to work
This service needs to be run in conjunction with the redirect service -->  https://github.com/kearneyp2000/url-shortening-service-redirect
The shorturl returned in the json response of this service, can be pasted into the browser window to test redirect functionality