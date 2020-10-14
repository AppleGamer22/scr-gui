import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema() export class User {
	@Prop({unique: true, required: true}) username: string;
	@Prop({required: true}) hash: string;
	@Prop({required: true}) joined: Date;
	@Prop({required: true}) network: "instagram" | "vsco";
	@Prop({required: true}) instagram: boolean;
}
export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

@Schema() export class History  {
	@Prop({required: true}) _id: string;
	@Prop({required: true}) urls: string[];
	@Prop({required: true}) U_ID: string;
	@Prop({required: true}) network: "instagram" | "vsco";
}
export type HistoryDocument = History & Document;
export const HistorySchema = SchemaFactory.createForClass(History);