// a. Name of Playlist,view
// b. Total No of videos : 792
// c. actual No of videos :783
// d. Total length of playlist : 12 hours, 9 minutes, 12 seconds
// At 1.25x : 9 hours, 43 minutes, 21 seconds

// At 1.50x : 8 hours, 6 minutes, 8 seconds
// At 1.75x : 6 hours, 56 minutes, 41 seconds
// At 2.00x : 6 hours, 4 minutes, 36 seconds
// Average length of video : 29 minutes, 10 seconds

// e. console.table of video number,name,time



// Current Task : name of playlist ,views,total videos, //#description

const { title } = require("process");
const puppeteer = require("puppeteer");
let page;
(async function fn() {
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized"],
    })
    page = await browser.newPage();
    await page.goto("https://www.youtube.com/playlist?list=PLzkuLC6Yvumv_Rd5apfPRWEcjf9b1JRnq");
    await page.waitForSelector('h1[id="title"]');
    //first element
    let element = await page.$('h1[id="title"]');

    let value = await page.evaluate(function cb(elements) {
        return elements.textContent;
    }, element)
    console.log("Title", value);
    let someList = await page.$$(".style-scope.ytd-playlist-sidebar-primary-info-renderer");
    value = await page.evaluate(
        function(elements) {
            return elements.textContent;
        },
        someList[5]);
    console.log("Videos", value);
    //no of views -> playlist
    value = await page.evaluate(
        function(elements) {
            return elements.textContent;
        },
        someList[6]);
    console.log("Views", value);


    //list first 100 videos console.table => of video number,name,//time
    let timeList = await page.$$("span[id ='text']");
    console.log(timeList.length);
    let videoNameElementList = await page.$$("a[id ='video-title']");
    console.log("Video List", videoNameElementList.length);
    let videosArr = [];
    for (let i = 0; i < timeList.length; i++) {
        let timeAndTileObj = await page.evaluate(getTimeAndTitle, timeList[i], videoNameElementList[i]);
        videosArr.push(timeAndTileObj);
    }
    console.table(videosArr);

})();

function getTimeAndTitle(element1, element2) {
    return {
        time: element1.textContent.trim(),
        title: element2.textContent.trim()
    }
}