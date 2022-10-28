const Course = require("../models/courseDefModel");

var makeKMPTable = function (word) {
    if (Object.prototype.toString.call(word) == '[object String]') {
        word = word.split('');
    }
    var results = [];
    var pos = 2;
    var cnd = 0;

    results[0] = -1;
    results[1] = 0;
    while (pos < word.length) {
        if (word[pos - 1] == word[cnd]) {
            cnd++;
            results[pos] = cnd;
            pos++;
        } else if (cnd > 0) {
            cnd = results[cnd];
        } else {
            results[pos] = 0;
            pos++;
        }
    }
    return results;
};

var KMPSearch = function (string, word) {
    if (Object.prototype.toString.call(string) == '[object String]') {
        string = string.split('');
    }
    if (Object.prototype.toString.call(word) == '[object String]') {
        word = word.split('');
    }

    var index = -1;
    var m = 0;
    var i = 0;
    var T = makeKMPTable(word);

    while (m + i < string.length) {
        if (word[i] == string[m + i]) {
            if (i == word.length - 1) {
                return m;
            }
            i++;
        } else {
            m = m + i - T[i];
            if (T[i] > -1) {
                i = T[i];
            } else {
                i = 0;
            }
        }
    }
    return index;
};

//This is under development
let getSimilarWordsWithRegex = async function (foundCourses, courseName) {
    let firstLetterOfCourseName = courseName[0];
    let anotherLetterOfCourseName = courseName[Math.floor(courseName.length / 2)];
    let lastLetterOfCourseName = courseName[courseName.length - 1];
    let regexStatement = courseName.length > 2 ? `(^(?=[a-zA-Z]*))(${firstLetterOfCourseName}\\w*${anotherLetterOfCourseName}\\w*${lastLetterOfCourseName})` : `(^(?=[a-zA-Z]*))(${firstLetterOfCourseName}.*)`

    let regex = new RegExp(regexStatement, 'i');
    let course = await Course.find({ course: { $regex: regex } }).exec();
    let courseFound = false;
    if (course.length > 0) {
        for (let i = 0; i < foundCourses.length && !courseFound && course.length != 0; i++) {
            if (foundCourses[i].course == (course[0].course)) {
                courseFound = true;
            }
        }
        course.length == 0 ? null : courseFound ? null : foundCourses.concat(course);
    }
}


const levenshteinDistance = (str1 = '', str2 = '') => {
    const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i += 1) {
       track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
       track[j][0] = j;
    }
    for (let j = 1; j <= str2.length; j += 1) {
       for (let i = 1; i <= str1.length; i += 1) {
          const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
          track[j][i] = Math.min(
             track[j][i - 1] + 1, // deletion
             track[j - 1][i] + 1, // insertion
             track[j - 1][i - 1] + indicator, // substitution
          );
       }
    }
    return track[str2.length][str1.length];
 };


module.exports = { KMPSearch, getSimilarWordsWithRegex, levenshteinDistance};