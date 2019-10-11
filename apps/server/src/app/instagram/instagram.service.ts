import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { userAgent } from "@scr-gui/server-interfaces";
import * as puppeteer from "puppeteer";
import { randomBytes } from "crypto";

declare global {
	interface Window {
		_sharedData: any
	}
}

@Injectable() export class InstagramService {
	async getPostFiles(id: string, browser: puppeteer.Browser, page: puppeteer.Page): Promise<string[]> {
		try {
			await page.goto(`https://www.instagram.com/p/${id}`, {waitUntil: "domcontentloaded"});
			if ((await page.$("div.error-container")) !== null) {
				console.error(`Failed to find post ${id}`);
				await browser.close();
				throw new HttpException(`Failed to find post ${id}`, HttpStatus.NOT_FOUND);
			}
			const sources = await page.evaluate(() => {
				return window._sharedData.entry_data.PostPage[0].graphql.shortcode_media;
			});
			var urls: string[] = [];
			if (sources.edge_sidecar_to_children) {
				for (let edge of sources.edge_sidecar_to_children.edges) {
					if (!edge.node.is_video) urls.push(edge.node.display_url);
					if (edge.node.is_video) urls.push(edge.node.video_url);
				}
			} else {
				if (!sources.is_video) urls.push(sources.display_url);
				if (sources.is_video) urls.push(sources.video_url);
			}
			return urls;
		} catch (error) { console.error(error.message); }
	}
	async signIn(page: puppeteer.Page, username: string, password: string): Promise<boolean> {
		try {
			await page.setUserAgent(userAgent());
			await page.goto("https://www.instagram.com/accounts/login/");
			await page.waitForSelector(`input[name="username"]`);
			await page.type(`input[name="username"]`, username);
			await page.type(`input[name="password"]`, password);
			await page.click(`button[type="submit"]`);
			await page.waitForResponse("https://www.instagram.com/");
			return true
		} catch (error) {
			console.error(error.message);
			return false;
		}
	}
	async signOut(page: puppeteer.Page): Promise<boolean> {
		try {
			await page.setUserAgent(userAgent());
			await page.goto(`https://www.instagram.com/${randomBytes(5).toString("hex")}/`);
			const profileButton = "#link_profile > a";
			await page.waitForSelector(profileButton);
			await page.click(profileButton);
			const settingsButton = "#react-root > section > main > div > header > section > div.nZSzR > div > button";
			await page.waitForSelector(settingsButton);
			await page.click(settingsButton);
			const logOutButton = "body > div.RnEpo.Yx5HN > div > div > div > button:nth-child(8)";
			await page.waitForSelector(logOutButton);
			await page.click(logOutButton);
			await page.waitForResponse("https://www.instagram.com/");
			return true;
		} catch (error) {
			console.error(error.message);
			return false;
		}
	}
}