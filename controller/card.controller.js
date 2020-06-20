const cv = require('opencv4nodejs');
const fs = require('fs');
const path = require('path');
const tesseract = require("node-tesseract-ocr");
let nameData = fs.readFileSync('name.txt').toString('utf8');
let nameLine = nameData.split('\n');
let nameSet = new Set(nameLine);

exports.scan = function (req, res) {
    console.log(req.file);
    let fileName = req.file.filename;
    let pathPreImg = 'preimg/'+fileName+'.png';
    const cvImg = cv.imread(req.file.path).bgrToGray();
    const threshold = cvImg.threshold(0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);
    cv.imwrite(pathPreImg, threshold);
    const config = {
        lang: 'eng',
        psm: 3,
    };
    tesseract.recognize(pathPreImg, config)
        .then(text => {
            const phone = [];
            const email = [];
            const website = [];
            let nameMax = {name: '', currentPercental: 0};
            console.log(text);
            text.split('\n')
                .map(item => {
                    return item.replace(/  /g, '').replace(/[^a-zA-Z0-9 @.]/g, '').trim();
                })
                .filter(item => item.split(' ').length >= 2)
                .forEach(text => {
                    let phoneMatch = phoneNumberPattern(text);
                    if (phoneMatch) {
                        phone.push(phoneMatch[0].replace(/ /g, ''));
                    }

                    let emailMatch = emailPattern(text.replace(/ /g, ''));
                    if (emailMatch) {
                        let email0 = emailMatch[0].toLowerCase().replace(/ /g, '').replace('email','');
                        email.push(email0);
                        website.push(email0.split('@')[1]);
                    }

                    let name = namePattern(text);
                    if (name.percental > nameMax.currentPercental) {
                        nameMax.name = name.name;
                        nameMax.currentPercental = name.percental;
                    }

                });
            res.send({success: true, info: {name: nameMax.name, phone: phone, email: email, website: website}});
        })
        .catch(error => {
            console.log(error.message);
            res.send({success: false, msg: 'Có lỗi gì đó, vui lòng thử lại'});
        });

};

function namePattern(text) {
    let name = [];
    let data = text.split(' ');
    data.map(str => {
        if(str !== '' && nameSet.has(str.toLowerCase())) name.push(str.toLowerCase().capitalize());
    });

    return {name: name.join(' '), percental: name.length / data.length};
}

function phoneNumberPattern(text) {
    let newText = text.replace(/-/,'').replace(/./,'').replace(/{+}/,'');
    console.log(newText);
    return newText.match(/(0|84)[0-9\s.-]{9,13}/);
}

function emailPattern(text) {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    return text.match(expression);
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};