import { HttpStatus, HttpException } from "@nestjs/common";
import { homedir } from "os";
import { Request } from "express";
import { Schema } from "mongoose";
import * as puppeteer from "puppeteer";

export function chromeUserDataDirectory(U_ID: string): string {
	if (U_ID === "") return `${homedir()}/.scr/`;
	return `${homedir()}/.scr-gui/${U_ID}/`;
}

export interface ScrapeRequest extends Request {
	user?: {
		username: string,
		U_ID: Schema.Types.ObjectId | string
	}
}

export function chromeExecutable(): string {
	switch (process.platform) {
		case "darwin":
			return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
		case "win32":
			return "C:/Program\ Files\ (x86)/Google/Chrome/Application/chrome.exe";
		default:
			return puppeteer.executablePath();
	}
}

export function userAgent(): string {
	switch (process.platform) {
		case "darwin":
			return "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36";
		case "win32":
			return "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36";
		default:
			return "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/71.0.3559.6 Chrome/71.0.3559.6 Safari/537.36";
	}
}

export async function beginScrape(U_ID: string): Promise<{browser: puppeteer.Browser, page: puppeteer.Page}> {
	try {
		const browser = await puppeteer.launch({
			headless: true,
			executablePath: chromeExecutable(),
			userDataDir: chromeUserDataDirectory(U_ID),
			args: ["--disable-gpu" , "--no-sandbox", "--disable-dev-shm-usage"]
		});
		const page = (await browser.pages())[0];
		await page.setUserAgent(userAgent());
		return {browser, page};
	} catch (error) {
		throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}