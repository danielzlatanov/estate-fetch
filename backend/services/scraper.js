const puppeteer = require('puppeteer');
const { performance } = require('perf_hooks');
const moment = require('moment');
const lowMs = 1000;
const mediumMs = 3000;
const highMs = 5000;

async function scrapeRealEstateData() {
	try {
		const start = performance.now();
		console.log('started scraping...');

		// const browser = await puppeteer.launch({ headless: false, slowMo: 250 });
		const browser = await puppeteer.launch({ headless: 'true' });
		const page = await browser.newPage();

		await page.goto('https://www.imot.bg/pcgi/imot.cgi');
		await page.click('.fc-button-label');
		await page.click('.mapBtnProdajbi');
		await page.click('input[type="button"][value="Т Ъ Р С И"]');
		await delay(mediumMs);

		const totalPages = await getTotalPages(page);
		console.log(`${totalPages} total pages will be scraped:`);
		if (totalPages === 0) {
			console.error("total pages weren't retrieved");
			return null;
		}

		const pageLinks = generatePageLinks(totalPages);
		console.log('page links constructed:', pageLinks);

		let pageCount = 0;
		const realEstateData = [];

		for (const pageLink of pageLinks) {
			pageCount++;
			console.log(`scraping page ${pageCount} of ${totalPages} with link: ${pageLink}...`);

			await page.goto(pageLink);
			await delay(mediumMs);

			const listingUrls = await page.$$eval('a.lnk3', links => links.map(link => link.href));
			const validListingUrls = listingUrls.filter(url => !url.startsWith('javascript:'));
			const pageData = await scrapeDataFromUrls(validListingUrls, page);
			realEstateData.push(...pageData);
		}

		await browser.close();
		const end = performance.now();
		const totalTimeInMinutes = Math.floor((end - start) / 60000);
		const remainingSeconds = ((end - start) % 60000) / 1000;

		console.log(
			`finished scraping:\nscraping took ${totalTimeInMinutes} minutes and ${remainingSeconds.toFixed(2)} seconds`
		);

		return realEstateData;
	} catch (error) {
		console.error('error scraping real estate data:', error);
		return null;
	}
}

async function getTotalPages(page) {
	await page.waitForSelector('.pageNumbersInfo');
	const pagesInfo = (await page.$eval('.pageNumbersInfo', el => el.textContent)).trim();

	if (pagesInfo.includes('от')) {
		return Number(pagesInfo.split('от')[1].trim());
	}
	return 0;
}

function generatePageLinks(totalPages) {
	const pageLinks = [];
	for (let i = 1; i <= totalPages; i++) {
		pageLinks.push(`https://www.imot.bg/pcgi/imot.cgi?act=3&slink=9x0t6p&f1=${i}`);
	}
	return pageLinks;
}

async function scrapeDataFromUrls(validListingUrls, page) {
	const pageData = [];
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
			const phone = (await page.$eval('.phone', el => el.textContent)).trim();
			let area = (await page.$eval('.adParams div:first-child', el => el.textContent)).trim();
			let floor = (await page.$eval('.adParams div:nth-child(2)', el => el.textContent)).trim();
			let construction = (await page.$eval('.adParams div:nth-child(3)', el => el.textContent)).trim();
			let description = await page.$eval('#description_div', el => el.textContent);
			const realtor = (await page.$eval('.AG .name', el => el.textContent)).trim();
			const realtorLogo = (await page.$eval('.AG .logo img', el => el.src)).trim();
			const realtorAddress = (await page.$eval('.AG .adress', el => el.textContent)).trim();
			const info = (await page.$eval('.adPrice .info', el => el.textContent)).trim();

			const infoSentences = info.split(/\.\s+/);
			const dateSentence = infoSentences[0];
			const dateAndTimePattern = /(\d+:\d+) на (\d+ [а-я]+, \d+ год)/;
			const dateAndTimeMatches = dateSentence.match(dateAndTimePattern);
			const time = dateAndTimeMatches[1];
			const date = dateAndTimeMatches[2];
			const dateStr = `${date} ${time}`;
			moment.locale('bg');
			const inputFormat = 'D MMMM, YYYY [год] HH:mm';
			const parsedDate = moment(dateStr, inputFormat).toDate();

			const viewsSentence = infoSentences[1];
			const views = Number(viewsSentence.match(/\d+/));

			description = description.replace('Виж по-малко... Виж повече', '');
			description = removeEmojis(description).trim();

			const exchangeRate = 1.96;
			let priceNoCurrency = Number(
				price
					.match(/[\d\s,.]+/)[0]
					.replace(/\s/g, '')
					.trim()
			);

			if (price.includes('лв')) {
				priceNoCurrency /= exchangeRate;
				priceNoCurrency = Math.ceil(priceNoCurrency);
			}

			if (construction.includes(':')) {
				construction = construction.split(':')[1].trim();
				if (construction.length <= 2) {
					console.log(`construction unavailable, skipping...`);
					continue;
				}
			}

			if (area.includes(':')) {
				const areaParts = area.split(':');
				if (areaParts.length >= 2) {
					const numericPart = areaParts[1].trim().split(' ')[0];
					area = Number(numericPart);
				}
			}

			if (floor.includes(':')) {
				floor = floor.split(':')[1].trim();
				if (floor.length <= 2) {
					console.log(`floor unavailable, skipping...`);
					continue;
				}
			}

			const sqm = Math.ceil(priceNoCurrency / area);

			const scrapedInfo = {
				title,
				location,
				price: priceNoCurrency,
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
				date: parsedDate,
				views,
			};
			console.log('DATA:', scrapedInfo);
			pageData.push(scrapedInfo);
		} catch (error) {
			console.error(`error scraping pageData for listing: ${url}`, error);
		}
	}
	return pageData;
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

function removeEmojis(string) {
	const regex =
		/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
	return string.replace(regex, '');
}

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
	scrapeRealEstateData,
	scrapeDataWithRetry,
};
