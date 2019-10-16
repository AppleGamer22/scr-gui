import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { User } from "@scr-gui/server-schemas";
import { AuthGuard } from "./auth.guard";

describe("AuthGuard", () => {
	let guard: AuthGuard;
	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				JwtModule.register({secret: "x7txX%eP8de3&Q4Y&J9bF$^4w2iEm"}),
			],
			providers: [
				AuthGuard,
				{
					provide: getModelToken("Users"),
					useValue: (dto: User) => {
						this.data = dto;
						this.save  = async () => this.data;
					}
				}
			]
		}).compile();

		guard = module.get<AuthGuard>(AuthGuard);
	});

	it("should be defined", () => {
		expect(guard).toBeDefined();
	});
});