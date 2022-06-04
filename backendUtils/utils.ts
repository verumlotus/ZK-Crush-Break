import axios from "axios";
import fs from "fs";
import path from "node:path"
import sha256 from "crypto-js/sha256";
import prisma from "./dbAccess";

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
    fs.writeFileSync(FILE_PATH, JSON.stringify(dataToWrite), 'utf-8')
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
    fs.writeFileSync(FILE_PATH, JSON.stringify(dataToWrite), 'utf-8')  
}

async function createRainbowTable() {
    const FIRST_NAME_PATH = path.resolve(__dirname, "firstNames.json");
    const LAST_NAME_PATH = path.resolve(__dirname, "lastNames.json");
    const firstNames = JSON.parse(fs.readFileSync(FIRST_NAME_PATH, 'utf-8'))['firstNames']
    const lastNames = JSON.parse(fs.readFileSync(LAST_NAME_PATH, 'utf-8'))['lastNames']
    let dataToWrite: {hash: string, name: string}[] = []
    let counter = 0;
    let BATCH_SIZE = 1e5;
    for (const firstName of firstNames) {
        for (const lastName of lastNames) {
            const fullName = `${firstName.toLowerCase()} ${lastName.toLowerCase()}`
            const hash = sha256(fullName).toString()
            dataToWrite.push({
                hash: hash, 
                name: fullName
            })
            counter += 1
            if (counter == BATCH_SIZE) {
                counter = 0
                prisma.rainbowTable.createMany({
                    data: dataToWrite,
                    skipDuplicates: true
                })
                dataToWrite = []
            }
        }
    }
    // Tail end of DB write (since counter is probably not perfectly divisible by BATCH_SIZE)
    prisma.rainbowTable.createMany({
        data: dataToWrite,
        skipDuplicates: true
    })
}

createRainbowTable().finally(async () => {
    await prisma.$disconnect();
})