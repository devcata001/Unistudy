import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { UniversitiesService } from "./universities.service";
import { Public } from "../auth/decorators/auth.decorators";

@ApiTags("universities")
@Controller("universities")
export class UniversitiesController {
  constructor(private universitiesService: UniversitiesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Get all Nigerian universities" })
  @ApiQuery({
    name: "type",
    required: false,
    enum: ["Federal", "State", "Private"],
    description: "Filter by university type",
  })
  @ApiQuery({ name: "state", required: false, description: "Filter by state" })
  @ApiQuery({
    name: "search",
    required: false,
    description: "Search by name or acronym",
  })
  @ApiResponse({ status: 200, description: "List of universities" })
  getAll(
    @Query("type") type?: "Federal" | "State" | "Private",
    @Query("state") state?: string,
    @Query("search") search?: string
  ) {
    return this.universitiesService.getAll({ type, state, search });
  }

  @Public()
  @Get("stats")
  @ApiOperation({ summary: "Get statistics about Nigerian universities" })
  @ApiResponse({ status: 200, description: "University statistics" })
  getStats() {
    return this.universitiesService.getStats();
  }
}
