import { Component } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
// tslint:disable-next-line: nx-enforce-module-boundaries
import { User } from "@scr-web/server-schemas";
import { ToastService } from "../toast.service";

@Component({
	selector: "scr-web-auth",
	templateUrl: "./auth.component.html",
	styleUrls: ["./auth.component.scss"],
}) export class AuthComponent {
	authOption: "sign-up" | "sign-in" | "sign-out" = "sign-up";
	platform = "instagram";
	usernameField: string;
	passwordField: string;
	processing = false;
	constructor(private readonly http: HttpClient, readonly toast: ToastService) {}

	async signUp(username: string, password: string) {
		this.processing = true;
		try {
			if (username && password) {
				const body = { username, password };
				const user = await this.http.patch<User>("http://localhost:4100/api/auth/sign_up/instagram", body).toPromise();
				this.processing = false;
				if (user !== undefined) {
					console.log("Signed-up.");
					this.toast.showToast("Signed-up.", "success");
					await this.signIn(username, password);
					this.processing = false;
				} else {
					this.processing = false;
					console.error("Authentication failed.");
					this.toast.showToast("Authentication failed.", "danger");
				}
			}
		} catch (error) {
			this.processing = false;
			console.error((error as Error).message);
			this.toast.showToast((error as Error).message, "danger");
		}
	}

	async signIn(username: string, password: string) {
		this.processing = true;
		try {
			if (username && password) {
				const body = { username, password };
				const { token } = await this.http.patch<{token: string}>("http://localhost:4100/api/auth/sign_in/instagram", body).toPromise();
				if (token !== undefined) {
					localStorage.setItem("instagram", token);
					console.log("Authenticated successfully.");
					this.toast.showToast("Authenticated successfully.", "success");
					this.processing = false;
					location.reload();
				} else {
					this.processing = false;
					console.error("Authentication failed.");
					this.toast.showToast("Authentication failed.", "danger");
				}
			}
		} catch (error) {
			this.processing = false;
			console.error((error as Error).message);
			this.toast.showToast((error as Error).message, "danger");
		}
	}
	async signOut() {
		try {
			const token = localStorage.getItem("instagram");
			if (token !== undefined) {
				const headers = new HttpHeaders({"Authorization": token});
				const { status } = await this.http.patch<{status: boolean}>("http://localhost:4100/api/auth/sign_out/instagram", {}, { headers }).toPromise();
				if (!status) {
					localStorage.removeItem("instagram");
					this.toast.showToast("Deauthenticationed successfully.", "success");
					location.reload();
				} else {
					this.processing = false;
					console.error("Deauthentication failed.");
					this.toast.showToast("Deauthentication failed.", "danger");
				}
			}
		} catch (error) {
			this.processing = false;
			console.error((error as Error).message);
			this.toast.showToast((error as Error).message, "danger");
		}
	}
}
