import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { HealthService } from "./health.service";
import { Public } from "../auth/decorators/auth.decorators";

@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Health check endpoint" })
  async check() {
    return this.healthService.check();
  }
}
