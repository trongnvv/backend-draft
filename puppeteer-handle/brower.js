const puppeteer = require('puppeteer')
class Browser {
    constructor() {
        this.browser = null;
        this.init();
    }
    async init(options = {}) {
        try {
            this.options = options
            const args = [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--ignore-certificate-errors',
                '--allow-file-access-from-files',
                '--disable-gesture-requirement-for-media-playback',
                '--use-fake-ui-for-media-stream',
                '--use-fake-device-for-media-stream',
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--no-first-run',
                '--no-zygote',
                '--single-process',

            ]
            if (options.fakeAudio) {
                args.push('--use-file-for-fake-audio-capture=' + options.fakeAudio)
            }
            if (options.fakeVideo) {
                args.push('--use-file-for-fake-video-capture=' + options.fakeVideo)
            }
            // headless: false
            // Object.assign(options, { args })
            this.browser = await puppeteer.launch(Object.assign(options, { args }));
            this.page = await this.open("localhost");
        } catch (error) {
            console.log(error);
        }
    }
    async open(url, options) {
        const page = await this.browser.newPage()
        await page.goto(url, options)
        return page
    }

    async close() {
        if (!this.browser) return false
        await this.browser.close()
        this.browser = null
    }

    async getStats() {
        if (!this.browser) {
            console.error('browser is not open')
            return null
        }
        let obj = await this.page.evaluate(() =>
            JSON.stringify(
                {}
            )
        )
        return obj
    }
}


new Browser()
