import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { InstagramComponent } from "./instagram.component";

@NgModule({
	imports: [
		IonicModule.forRoot({scrollAssist: true}),
		FormsModule,
		CommonModule,
		HttpClientModule,
		RouterModule.forChild([{path: "", component: InstagramComponent}])
	],
	declarations: [InstagramComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
}) export class InstagramModule {}