import { Injectable, HttpStatus, HttpException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "@scr-gui/server-schemas";
import { beginScrape } from "@scr-gui/server-interfaces";
import { Model, Types } from "mongoose";
import { hash, compare } from "bcryptjs";
import { InstagramService } from "../instagram/instagram.service";

@Injectable() export class AuthService {
	constructor(
		@InjectModel("Users") private readonly userCollection: Model<User>,
		private readonly jwt: JwtService,
		private readonly instagramService: InstagramService
	) {}
	async signUpInstagram(username: string, password: string): Promise<User> {
		try {
			const possibleUser = await this.userCollection.findOne({username}).exec();
			if (possibleUser) throw new HttpException( "Username already exists.", HttpStatus.CONFLICT);
			return await new this.userCollection({
				username,
				hash: await hash(password, 10),
				joined: new Date(),
				network: "instagram",
				instagram: false,
				_id: new Types.ObjectId()
			}).save();
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	async signInInstagram(username: string, password: string): Promise<string | undefined> {
		try {
			const possibleUser = await this.userCollection.findOne({username}).exec();
			if (!possibleUser) throw new HttpException("Authentication failed", HttpStatus.UNAUTHORIZED);
			const isRealUser = await compare(password, possibleUser.hash);
			if (!isRealUser) throw new HttpException("Authentication failed", HttpStatus.UNAUTHORIZED);
			const webToken = await this.jwt.signAsync({username, U_ID: possibleUser._id});
			const {page} = await beginScrape(possibleUser._id);
			if (isRealUser) {
				if (await this.instagramService.signIn(page, username, password)) {
					possibleUser.instagram = true;
					await possibleUser.save();
					return webToken;
				}
			}
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}