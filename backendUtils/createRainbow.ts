import axios from "axios";
import fs from "fs";
import path from "node:path"

async function scrapeFirstNames() {
    const URL = "https://www.usna.edu/Users/cs/roche/courses/s15si335/proj1/files.php%3Ff=names.txt&downloadcode=yes";
    const response = await axios.get(URL);
    // Now let's break by new line and store this all in a json file
    let firstNames = []
    firstNames = response.data.split(/\r?\n/)
    // Delete our firstNames.json File if it exists
    const FILE_PATH = path.resolve(__dirname, "firstNames.json");
    if (fs.existsSync(FILE_PATH)) {
        fs.unlinkSync(FILE_PATH)
    }
    // Write to our file now 
    const dataToWrite = {
        "firstNames": firstNames
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(dataToWrite))
}

async function scrapeLastNames() {
    const URL = "https://www2.census.gov/topics/genealogy/1990surnames/dist.all.last"
    const response = await axios.get(URL)
    // We need to retrieve just the last Names
    // First, break each line up by white space (first elem will be the last name)
    let lastNames = []
    const splitByLine = response.data.split(/\r?\n/)
    for (const line of splitByLine) {
        const lineData = line.split(/\s+/)
        lastNames.push(lineData[0])
    }
    // Delete our lastNames.json File if it exists
    const FILE_PATH = path.resolve(__dirname, "lastNames.json");
    if (fs.existsSync(FILE_PATH)) {
        fs.unlinkSync(FILE_PATH)
    }
    // Write to our file now 
    const dataToWrite = {
        "lastNames": lastNames
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(dataToWrite))  
}

scrapeLastNames()