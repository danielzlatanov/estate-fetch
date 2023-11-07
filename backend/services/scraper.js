const chalk = require('chalk');
const puppeteer = require('puppeteer');
const { performance } = require('perf_hooks');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const axios = require('axios');
const moment = require('moment');
const lowMs = 1000;
const mediumMs = 3000;
const highMs = 5000;

async function scrapeRealEstateData() {
	try {
		const start = performance.now();
		console.log(chalk.blue('started scraping...'));

		// const browser = await puppeteer.launch({ headless: false, slowMo: 250 });
		const browser = await puppeteer.launch({ headless: 'new' });
		const page = await browser.newPage();

		await page.goto('https://www.imot.bg/pcgi/imot.cgi');
		await page.click('.fc-button-label');
		await page.click('.mapBtnProdajbi');
		await page.click('input[type="button"][value="Т Ъ Р С И"]');
		await delay(mediumMs);

		let dynamicUrl = getDynamicUrl(page);
		console.log(chalk.blue('dynamic URL retrieved:', dynamicUrl));

		const totalPages = await getTotalPages(page);
		console.log(chalk.blue(`${totalPages} total pages will be scraped...`));

		if (totalPages === 0) {
			throw new Error('total pages not available, cannot continue...');
		}

		const pageLinks = generatePageLinks(dynamicUrl, totalPages);

		const maxConcurrentRequests = 10;
		const realEstateData = [];

		for (let i = 0; i < pageLinks.length; i += maxConcurrentRequests) {
			const batch = pageLinks.slice(i, i + maxConcurrentRequests);
			const batchResults = await Promise.all(
				batch.map(async pageLink => {
					const browser = await puppeteer.launch({ headless: 'new' });
					const page = await browser.newPage();

					await page.goto(pageLink);
					await delay(mediumMs);

					const validLinks = await page.evaluate(() => {
						const links = Array.from(document.querySelectorAll('a.lnk3'));
						const validLinks = links.map(link => link.href).filter(url => !url.startsWith('javascript:'));
						return validLinks;
					});

					const pageData = await scrapeDataFromUrls(validLinks);

					await browser.close();

					return pageData;
				})
			);

			realEstateData.push(...batchResults.flat());
		}

		await browser.close();
		const end = performance.now();
		const totalTimeInMinutes = Math.floor((end - start) / 60000);
		const remainingSeconds = ((end - start) % 60000) / 1000;

		console.log(
			chalk.blue(
				`finished:\nscraping took ${totalTimeInMinutes} minutes and ${remainingSeconds.toFixed(2)} seconds`
			)
		);

		return realEstateData;
	} catch (error) {
		console.error(chalk.red('error scraping data from pageLinks:', error));
		return null;
	}
}

async function getTotalPages(page) {
	await page.waitForSelector('.pageNumbersInfo');
	const pagesInfo = (await page.$eval('.pageNumbersInfo', el => el.textContent)).trim();

	if (pagesInfo && pagesInfo.includes('от')) {
		return Number(pagesInfo.split('от')[1].trim());
	}
	return 0;
}

function generatePageLinks(dynamicUrl, totalPages) {
	const pageLinks = [];
	for (let i = 1; i <= totalPages; i++) {
		pageLinks.push(`${dynamicUrl}&f1=${i}`);
	}
	return pageLinks;
}

function getDynamicUrl(page) {
	let url = page.url();
	const f1Index = url.indexOf('&f1');
	if (f1Index !== -1) {
		url = url.substring(0, f1Index);
		return url;
	} else {
		throw new Error('dynamic URL not retrieved, cannot continue...');
	}
}

async function scrapeDataFromUrls(validLinks) {
	const pageData = [];
	for (const url of validLinks) {
		try {
			const response = await axios.get(url, { responseType: 'arraybuffer' });
			const htmlBuffer = response.data;
			const encoding = 'windows-1251';
			const html = iconv.decode(htmlBuffer, encoding);

			const $ = cheerio.load(html);

			const images = [];
			const hasMultipleImages = $('div.im').length > 0;
			if (hasMultipleImages) {
				$('div.im a').each((i, el) => {
					const imgUrl = $(el).attr('data-link').trim();
					images.push(imgUrl);
				});
			} else {
				const imgUrl = $('#bigPictureCarousel').attr('src').trim();

				if (imgUrl && imgUrl !== '../images/picturess/nophoto_660x495.svg') {
					images.push(imgUrl);
				} else {
					console.log(chalk.yellow('default no photo image, skipping...'));
					continue;
				}
			}

			if (images.length == 0) {
				console.log(chalk.yellow('image/s unavailable, skipping...'));
				continue;
			}

			const title = $('.advHeader .title').text().trim();
			const location = $('.location').text().trim();
			const price = $('#cena').text().trim();
			const phone = $('.phone').text().trim();
			let area = $('.adParams div:first-child').text().trim();
			let floor = $('.adParams div:nth-child(2)').text().trim();
			let construction = $('.adParams div:nth-child(3)').text().trim();
			let description = $('#description_div').text();
			const realtor = $('.AG .name').text().trim();
			const realtorLogo = $('.AG .logo img').attr('src').trim();
			const realtorInfo = $('.AG .adress').text().trim();
			const info = $('.adPrice .info').text().trim();

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

			if (price && price.includes('лв')) {
				priceNoCurrency /= exchangeRate;
				priceNoCurrency = Math.ceil(priceNoCurrency);
			}

			const constructionMatch = construction.match(/Строителство:\s*(.*)/i);
			if (constructionMatch && constructionMatch.length > 1) {
				construction = constructionMatch[1].trim();
			} else {
				console.log(chalk.yellow('construction unavailable, skipping...'));
				continue;
			}

			if (area && area.includes(':')) {
				const areaParts = area.split(':');
				if (areaParts.length >= 2) {
					const numericPart = areaParts[1].trim().split(' ')[0];
					area = Number(numericPart);
				}
			}

			if (floor && floor.includes(':')) {
				floor = floor.split(':')[1].trim();
				if (floor.length <= 2) {
					console.log(chalk.yellow('floor unavailable, skipping...'));
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
				realtorInfo,
				date: parsedDate,
				views,
			};

			// console.log('DATA:', scrapedInfo);

			console.log(chalk.blue('scraped successfully:', url));
			pageData.push(scrapedInfo);
		} catch (error) {
			console.error(chalk.red(`error scraping pageData from URL: ${url}`, error));
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
				console.log(chalk.blue(`data scraped at attempt ${++retryCount}`));
				return realEstateData;
			} else {
				retryCount++;
			}
		} catch (error) {
			console.error(chalk.red(`error while retrying to scrape data (attempt ${retryCount + 1}):`, error));

			retryCount++;
			await delay(mediumMs);
		}
	}

	console.error(chalk.red('max retries reached, scraping failed...'));
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
