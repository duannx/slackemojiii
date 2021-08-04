require('dotenv').config()

const puppeteer = require('puppeteer');
const fs = require('fs');

const gotoOption = {
    waitUntil: 'domcontentloaded'
}

const workSpaceName = process.env.WORK_SPACE_NAME
const userName = process.env.USER_NAME
const password = process.env.PASS_WORD
const directory = process.env.npm_config_directory || process.env.DIRECTORY

const addButtonSelector = '[data-qa="customize_emoji_add_button"]'
const uploadImageSelector = 'input[data-qa="customize_emoji_add_dialog_file_input"]'
const saveButtonSelector = '[data-qa="customize_emoji_add_dialog_go"]'
const closeModalSelector = '[data-qa="sk_close_modal_button"]'


const addEmoji = async (page, url) => {
    // Wait and click add button
    await page.waitForSelector(addButtonSelector)
    await page.click(addButtonSelector)
    // Wait and click button upload file
    await page.waitForSelector(uploadImageSelector)
    const inputFile = await page.$(uploadImageSelector);
    await inputFile.uploadFile(url);
    // Click save button
    await page.click(saveButtonSelector);
    try {
        // Wait the modal disapear to complete upload
        await page.waitForSelector(saveButtonSelector, { hidden: true, timeout: 5000 })
        console.log('\x1b[36m%s\x1b[0m', `Uploaded: ${url}`)
    } catch (error) {
        // If the modal is not disapeared. There are some error. Skip this upload by clicking the close button
        console.log('\x1b[33m%s\x1b[0m', `Upload failed: ${url}`)
        await page.click(closeModalSelector)
    }
}

const main = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--disable-notifications', '--start-maximized'],
        });
        const page = await browser.newPage();
        page.setViewport({
            width: 1280,
            height: 720
        });
        await page.goto(`https://${workSpaceName}.slack.com/customize/emoji`, gotoOption);

        // Sign in
        await page.focus('#email')
        await page.keyboard.type(userName)
        await page.focus('#password')
        await page.keyboard.type(password)
        await page.click('#signin_btn')

        // Wait add emoji screen
        await page.waitForSelector(addButtonSelector)
        // Add custom css to hide toast (Toast can overlay the  button and we can not click it)
        await page.addStyleTag({ content: '.ReactModal__Overlay.ReactModal__Overlay--before-close{display: none!important}' })


        // get all file in directory
        const files = fs.readdirSync(directory)
        console.log('\x1b[36m%s\x1b[0m', `Uploading ${files.length} images from ${directory}`)
        for (let i = 0; i < files.length; i++) {
            const filePath = `${directory}/${files[i]}`
            await addEmoji(page, filePath)
        }
        console.log('DONE')
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', `Error: ${error.message}`)
        console.log('Press Ctrl+C to terminate')
    }
}
main()

