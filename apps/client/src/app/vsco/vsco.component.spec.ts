import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";
import { IonicModule } from "@ionic/angular";
import { URLsModule } from "../urls/urls.module";
import { VSCOComponent } from "./vsco.component";
import { ToastService } from "../toast.service";

describe("VSCOComponent", () => {
	let component: VSCOComponent;
	let fixture: ComponentFixture<VSCOComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [
				IonicModule,
				FormsModule,
				RouterTestingModule,
				HttpClientModule,
				URLsModule
			],
			providers: [ToastService],
			declarations: [VSCOComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(VSCOComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => expect(component).toBeTruthy());
});
