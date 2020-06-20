# Nodejs - Express - Scancard visit with openCV and tesseract OCR
## Description
This project build for learn how to apply openCV and tesseract OCR to detected card visit from image.

You can using API to upload and get some infomation of card visit back such as name, email, phone number, website.
## Installation
### Install OpenCV Manual
https://www.npmjs.com/package/opencv4nodejs#how-to-install
### Install Tesseract Ocr Manual
https://github.com/tesseract-ocr/tesseract/wiki
### Install and run project
Step 1: Clone project
```
git clone https://github.com/namttdh/express-scan-card-visit.git
cd express-scan-card-visit
```
Step 2: Install node_modules
```
yarn
or
npm i
```
Step 3: Run project
```
yarn start
or
npm run start
```
### Usage
API Upload card visit and get infomation
```
Method: POST
PATH: /card/scan
BODY: uploaded_file
FORM TYPE: FORM-DATA
```
API register:
```
Method: POST
PATH: /register
BODY: name, email, password
```
API Login:
```
Method: POST
PATH: /login
BODY: email, password
```
API Change password:
```
Method: POST
PATH: /change_pass
BODY: password, new_password
HEADER: 'Authorization: Bearer token_get_from_login'
```
API sync from local to online (In progress)
```
Method: POST
PATH: /sync
HEADER: 'Authorization: Bearer token_get_from_login'
```
