const axios = require("axios")
const cheerio = require("cheerio")
const dayjs = require("dayjs")
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')
var isoWeek = require('dayjs/plugin/isoWeek')
dayjs.extend(isoWeek)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault("Europe/London")

function getURL(studentID, weekNumber) {
    let url = "https://timetable.dundee.ac.uk:8085/reporting/textspreadsheet?objectclass=student+set&idtype=id&identifier=" + studentID + "/1&days=1-7&weeks=" + weekNumber + "&periods=1-28&template=SWSCUST+student+set+textspreadsheet"
    return url
}

async function getTimetable(studentID, weekNumber = -999) {
    if(weekNumber===-999){
        sysWeekNumber = dayjs().isoWeek() - 27
    }
    else{
        sysWeekNumber = parseInt(weekNumber) + 11
    }
    
    const url = getURL(studentID, sysWeekNumber)
    const res = await axios.get(url, { timeout: 10000 })
    const $ = cheerio.load(res.data)

    var cnt = 0;

    const data = {}
    data.today = dayjs().isoWeekday()
    data.week = sysWeekNumber - 11
    data.id = studentID

    $("table[class=spreadsheet]").each((i, table) => {
        const weekDay = $(table).prev().find("span").text()
        const schedule = [];

        $(table).find("tr").not(".columnTitles").each((j, row) => {
            const td = $(row).find("td")
            var online = false
            if($(td[8]).text().includes("Online") || $(td[8]).text().includes("online")){
                online = true
            }
            schedule.push({
                "event_code": $(td[0]).text().replace(/\s+/g, ' ').trim(),
                "module_code": $(td[0]).text().match(/(\w+)/g)[0].trim(),
                "module": $(td[1]).text().replace(/\s+/g, ' ').trim(),
                "type": $(td[2]).text().replace(/\s+/g, ' ').trim(),
                "start": $(td[3]).text().replace(/\s+/g, ' ').trim(),
                "end": $(td[4]).text().replace(/\s+/g, ' ').trim(),
                "staff": $(td[7]).text().replace(/\s+/g, ' ').trim(),
                "location": $(td[8]).text().replace(/\s+/g, ' ').trim(),
                "online": online,
                "count": cnt
            })
            cnt++
        })
        data[weekDay] = schedule
    })
    return data;   
}

module.exports = { getTimetable }