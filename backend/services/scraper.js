const puppeteer = require('puppeteer');
const lowMs = 1000;
const mediumMs = 3000;
const highMs = 5000;

async function scrapeRealEstateData() {
	try {
		console.log('started scraping...');
		// const browser = await puppeteer.launch({ headless: false, slowMo: 250 });

		const browser = await puppeteer.launch({ headless: 'true' });
		const page = await browser.newPage();

		await page.goto('https://www.imot.bg/pcgi/imot.cgi');
		await page.click('.fc-button-label');
		await page.click('.mapBtnProdajbi');
		await page.click('input[type="button"][value="Т Ъ Р С И"]');
		await delay(mediumMs);

		await page.waitForSelector('.pageNumbersInfo');
		const pagesInfo = (await page.$eval('.pageNumbersInfo', el => el.textContent)).trim();
		let totalPages;

		if (pagesInfo.includes('от')) {
			totalPages = Number(pagesInfo.split('от')[1].trim());
			console.log(`${totalPages} total pages will be scraped:`);
		} else {
			console.error("Total pages weren't retrieved");
		}

		const pageLinks = [];
		for (let i = 1; i <= totalPages; i++) {
			const pageLink = `https://www.imot.bg/pcgi/imot.cgi?act=3&slink=9vty6h&f1=${i}`;
			pageLinks.push(pageLink);
		}
		console.log('page links constructed:', pageLinks);

		let pageCount = 0;
		const realEstateData = [];

		for (const pageLink of pageLinks) {
			pageCount++;
			console.log(`scraping page ${pageCount} of ${totalPages} with link: ${pageLink}...`);
			await page.goto(pageLink);
			await delay(mediumMs);

			// await page.screenshot({ path: `page${pageCount}.png`, fullPage: true });

			const listingUrls = await page.$$eval('a.lnk3', links => links.map(link => link.href));
			const validListingUrls = listingUrls.filter(url => !url.startsWith('javascript:'));

			for (const url of validListingUrls) {
				try {
					await page.goto(url);

					const isPriceUnavailable = await page.evaluate(() => {
						const textToCheck = 'При запитване';
						return document.body.textContent.includes(textToCheck);
					});

					if (isPriceUnavailable) {
						console.log(`price unavailable, skipping...`);
						continue;
					}

					const images = [];

					const hasMultipleImages = await page.evaluate(() => {
						const divIm = document.querySelector('div.im');
						return divIm !== null;
					});

					if (hasMultipleImages) {
						const imageSelectors = await page.$$eval('div.im a', els => els.map(el => el.dataset.link));
						images.push(...imageSelectors.map(imgUrl => imgUrl.trim()));
					} else {
						const imgUrl = (await page.$eval('#bigPictureCarousel', el => el.src)).trim();

						if (imgUrl !== '../images/picturess/nophoto_660x495.svg') {
							images.push(imgUrl);
						} else {
							console.log('default no photo image, skipping...');
							continue;
						}
					}

					if (images.length == 0) {
						console.log(`image/s unavailable, skipping...`);
						continue;
					}

					await Promise.all([
						page.waitForSelector('.advHeader .title', { timeout: lowMs }),
						page.waitForSelector('.location', { timeout: lowMs }),
						page.waitForSelector('#cena', { timeout: lowMs }),
						page.waitForSelector('#cenakv', { timeout: lowMs }),
						page.waitForSelector('#bigPictureCarousel', { timeout: highMs }),
						page.waitForSelector('.phone', { timeout: lowMs }),
						page.waitForSelector('.adParams div:first-child', { timeout: lowMs }),
						page.waitForSelector('.adParams div:nth-child(2)', { timeout: lowMs }),
						page.waitForSelector('.adParams div:nth-child(3)', { timeout: lowMs }),
						page.waitForSelector('#description_div', { timeout: lowMs }),
						page.waitForSelector('.AG', { timeout: lowMs }),
						page.waitForSelector('.AG .name', { timeout: lowMs }),
						page.waitForSelector('.AG .logo img', { timeout: mediumMs }),
						page.waitForSelector('.AG .adress', { timeout: lowMs }),
					]);

					const title = (await page.$eval('.advHeader .title', el => el.textContent)).trim();
					const location = (await page.$eval('.location', el => el.textContent)).trim();
					const price = (await page.$eval('#cena', el => el.textContent)).trim();
					let sqm = (await page.$eval('#cenakv', el => el.textContent)).trim();
					const phone = (await page.$eval('.phone', el => el.textContent)).trim();
					let area = (await page.$eval('.adParams div:first-child', el => el.textContent)).trim();
					let floor = (await page.$eval('.adParams div:nth-child(2)', el => el.textContent)).trim();
					let construction = (await page.$eval('.adParams div:nth-child(3)', el => el.textContent)).trim();
					let description = (await page.$eval('#description_div', el => el.textContent)).trim();
					const realtor = (await page.$eval('.AG .name', el => el.textContent)).trim();
					const realtorLogo = (await page.$eval('.AG .logo img', el => el.src)).trim();
					const realtorAddress = (await page.$eval('.AG .adress', el => el.textContent)).trim();

					description = description.replace('Виж по-малко... Виж повече', '').trim();

					if (construction.includes(':')) {
						construction = construction.split(':')[1].trim();
						if (construction.length <= 2) {
							console.log(`construction unavailable, skipping...`);
							continue;
						}
					}

					if (area.includes(':')) {
						area = area.split(':')[1].trim();
					}

					if (floor.includes(':')) {
						floor = floor.split(':')[1].trim();
						if (floor.length <= 2) {
							console.log(`floor unavailable, skipping...`);
							continue;
						}
					}

					if (sqm.includes('(')) {
						sqm = sqm.replace(/\(|\)/g, '');
					}

					const scrapedInfo = {
						title,
						location,
						price,
						sqm,
						images,
						phone,
						area,
						floor,
						construction,
						description,
						url,
						realtor,
						realtorLogo,
						realtorAddress,
					};
					console.log('DATA:', scrapedInfo);

					realEstateData.push(scrapedInfo);
				} catch (error) {
					console.error(`Error scraping full data for listing: ${url}`, error);
				}
			}
		}

		await browser.close();
		console.log('finished scraping!');
		return realEstateData;
	} catch (error) {
		console.error('Error scraping real estate data:', error);
		return null;
	}
}

async function scrapeDataWithRetry() {
	const maxRetries = 3;
	let retryCount = 0;

	while (retryCount < maxRetries) {
		try {
			const realEstateData = await scrapeRealEstateData();

			if (realEstateData) {
				console.log(`data scraped at attempt ${++retryCount}`);
				return realEstateData;
			} else {
				retryCount++;
			}
		} catch (error) {
			console.error(`error scraping real estate data (attempt ${retryCount + 1}):`, error);
			retryCount++;

			await delay(mediumMs);
		}
	}

	console.error('max retries reached, scraping failed...');
	return null;
}

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
	scrapeRealEstateData,
	scrapeDataWithRetry,
};
