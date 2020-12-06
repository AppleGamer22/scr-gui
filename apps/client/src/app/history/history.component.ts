// tslint:disable-next-line: nx-enforce-module-boundaries
import { History } from "@scr-web/server-schemas";
import { Component, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { FileType } from "@scr-web/server-schemas";
import { environment } from "../../environments/environment";
import { ToastService } from "../toast.service";

@Component({
	selector: "scr-web-history",
	templateUrl: "./history.component.html",
	styleUrls: ["./history.component.scss"],
})
export class HistoryComponent {
	processing = false;
	type: FileType | "all" = "all";
	histories: History[];
	constructor(
		private readonly http: HttpClient,
		readonly toast: ToastService,
		@Inject(DOCUMENT) private document: Document,
		route: ActivatedRoute,
		private router: Router,
	) {
		this.type = route.snapshot.queryParamMap.get("type") as FileType | "all";
		this.filterHistories();
	}
	/**
	 * Get all of the activity history
	 */
	async getHistories() {
		this.processing = true;
		try {
			const token = localStorage.getItem("instagram");
			if (token) {
				const headers = new HttpHeaders({"Authorization": token});
				this.histories = await this.http.get<History[]>(`${environment.server}/api/history/all`, { headers }).toPromise();
				this.histories = this.histories.map(history => {
					history.urls = history.urls.map(url => `${environment.server}/api/${url}`);
					return history;
				});
				this.processing = false;
			} else {
				this.processing = false;
				await this.toast.showToast("You are not authenticated.", "danger");
			}
		} catch (error) {
			this.processing = false;
			console.error((error as Error).message);
			this.toast.showToast((error as Error).message, "danger");
		}
	}
	/**
	 * Deletes a requested URL from a history item
	 * @param history history item
	 * @param urlToDelete a URL for deletion
	 */
	async editHistory(history: History, urlToDelete: string) {
		this.processing = true;
		try {
			const token = localStorage.getItem("instagram");
			if (token) {
				const headers = new HttpHeaders({"Authorization": token});
				await this.http.patch(`${environment.server}/api/history/`, { history, urlToDelete }, { headers }).toPromise();
				this.histories = await this.http.get<History[]>(`${environment.server}/api/history/${this.type}`, { headers }).toPromise();
				this.histories = this.histories.map(history2 => {
					history2.urls = history2.urls.map(url => `${environment.server}/api/${url}`);
					return history2;
				});
			} else {
				await this.toast.showToast("You are not authenticated.", "danger");
			}
		} catch (error) {
			console.error((error as Error).message);
			this.toast.showToast((error as Error).message, "danger");
		}
		this.processing = false;
	}
	/**
	 * Get the history for a particular resource type
	 */
	async filterHistories() {
		this.processing = true;
		try {
			const token = localStorage.getItem("instagram");
			if (token) {
				await this.router.navigate(["/history"], {queryParams: {type: this.type}, queryParamsHandling: "merge"});
				const headers = new HttpHeaders({"Authorization": token});
				this.histories = await this.http.get<History[]>(`${environment.server}/api/history/${this.type}`, { headers }).toPromise();
				this.histories = this.histories.map(history => {
					history.urls = history.urls.map(url => `${environment.server}/api/${url}`);
					return history;
				});
			} else {
				await this.toast.showToast("You are not authenticated.", "danger");
			}
		} catch (error) {
			console.error((error as Error).message);
			this.toast.showToast((error as Error).message, "danger");
		}
		this.processing = false;
	}
}
