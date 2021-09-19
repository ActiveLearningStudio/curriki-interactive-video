# Advance Interactive Video

## Installation

To install the additional features such as the Kaltura, Youtube and Vimeo Pro playlist follow the below instructions.

```
# For Kaltura Generated API Client integration For Backend :-
Following are the steps to follow:

1: install composer package by typing 'composer require kaltura/api-client-library' on terminal (Reference Link: 	 		https://packagist.org/packages/kaltura/api-client-library)

2: Require Kaltura Credentials For Kaltura Session Method ('secret', partnerId, expiry, privileges and sessionType) 

3: Create API endpoint to access the Kaltura generated api client from backend

4: Paste that created API endpoint inside scripts/kaltura/config.js

#For Youtube and Vimeo Pro Integration:-

Open scripts/kaltura/config.js file and add your youtube API key
and channel Id. Whereas, for Vimeo pro you need to add token and channel ID.

```