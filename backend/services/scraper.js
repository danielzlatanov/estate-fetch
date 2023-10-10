const puppeteer = require('puppeteer');

async function scrapeRealEstateData() {
	try {
		console.log('started scraping...');
		// const browser = await puppeteer.launch({ headless: false, slowMo: 250 });
		// const browser = await puppeteer.launch();

		const browser = await puppeteer.launch({ headless: 'new' });
		const page = await browser.newPage();

		await page.goto('https://www.imot.bg/pcgi/imot.cgi');
		await page.click('.fc-button-label');
		await page.click('.mapBtnProdajbi');
		await page.click('input[type="button"][value="Т Ъ Р С И"]');
		await delay(5000);

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
			const pageLink = `https://www.imot.bg/pcgi/imot.cgi?act=3&slink=9u9dut&f1=${i}`;
			pageLinks.push(pageLink);
		}
		let pageCount = 0;

		console.log('page links constructed:', pageLinks);

		for (const pageLink of pageLinks) {
			pageCount++;
			console.log(`scraping page ${pageCount} of ${totalPages} with link: ${pageLink}...`);
			await page.goto(pageLink);
			await delay(3000);
			await page.screenshot({ path: `page${pageCount}.png`, fullPage: true });

			const listingUrls = await page.$$eval('a.lnk3', links => links.map(link => link.href));
			const validListingUrls = listingUrls.filter(url => !url.startsWith('javascript:'));

			const realEstateData = [];

			for (const url of validListingUrls) {
				try {
					await page.goto(url);

					const isPriceUnavailable = await page.evaluate(() => {
						const textToCheck = 'При запитване';
						return document.body.textContent.includes(textToCheck);
					});

					if (isPriceUnavailable) {
						console.log(`price unavailable for URL: ${url}, skipping...`);
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
						images.push(imgUrl);
					}

					await page.waitForSelector('.title');
					await page.waitForSelector('.location');
					await page.waitForSelector('#cena');
					await page.waitForSelector('#cenakv');
					await page.waitForSelector('#bigPictureCarousel');
					await page.waitForSelector('.phone');
					await page.waitForSelector('.adParams div:first-child');
					await page.waitForSelector('.adParams div:nth-child(2)');
					await page.waitForSelector('.adParams div:nth-child(3)');
					await page.waitForSelector('#description_div');
					await page.waitForSelector('.AG');
					await page.waitForSelector('.AG .name');
					await page.waitForSelector('.AG .logo img');
					await page.waitForSelector('.AG .adress');

					const title = (await page.$eval('.title', el => el.textContent)).trim();
					const titleNoPrice = extractTitleWithoutPrice(title);

					const location = (await page.$eval('.location', el => el.textContent)).trim();
					const price = (await page.$eval('#cena', el => el.textContent)).trim();
					let sqm = (await page.$eval('#cenakv', el => el.textContent)).trim();
					const phone = (await page.$eval('.phone', el => el.textContent)).trim();
					let area = (await page.$eval('.adParams div:first-child', el => el.textContent)).trim();
					let floor = (await page.$eval('.adParams div:nth-child(2)', el => el.textContent)).trim();
					let construction = (await page.$eval('.adParams div:nth-child(3)', el => el.textContent)).trim();
					const description = (await page.$eval('#description_div', el => el.textContent)).trim();
					const realtor = (await page.$eval('.AG .name', el => el.textContent)).trim();
					const realtorLogo = (await page.$eval('.AG .logo img', el => el.src)).trim();
					const realtorAddress = (await page.$eval('.AG .adress', el => el.textContent)).trim();

					if (construction.includes(':')) {
						construction = construction.split(':')[1].trim();
						if (construction.length <= 3) {
							console.log('construction.length was less than 3, skipping...');
							continue;
						}
					}

					if (area.includes(':')) {
						area = area.split(':')[1].trim();
					}
					if (floor.includes(':')) {
						floor = floor.split(':')[1].trim();
					}

					if (sqm.includes('(')) {
						sqm = sqm.replace(/\(|\)/g, '');
					}

					const scrapedInfo = {
						title: titleNoPrice,
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

			await delay(3000);
		}
	}

	console.error('max retries reached, scraping failed...');
	return null;
}

function extractTitleWithoutPrice(title) {
	const titleParts = title.split(' EUR');

	if (titleParts.length >= 2) {
		let titleWithoutPrice = titleParts.slice(1).join('').trim();

		if (titleWithoutPrice.includes('кв.м')) {
			titleWithoutPrice = titleWithoutPrice.replace('на кв.м', '').trim();
		}

		return titleWithoutPrice;
	} else {
		return title;
	}
}

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
	scrapeRealEstateData,
	scrapeDataWithRetry,
};
