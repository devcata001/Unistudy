import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Post,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { AdminService } from "./admin.service";
import { AdminAuthService } from "./admin-auth.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AdminGuard } from "../auth/guards/admin.guard";

@ApiTags("admin")
@Controller("admin")
export class AdminController {
  constructor(
    private adminService: AdminService,
    private adminAuthService: AdminAuthService
  ) {}

  @Post("login")
  @ApiOperation({ summary: "Admin login" })
  async adminLogin(@Body() body: { username: string; password: string }) {
    return this.adminAuthService.login(body.username, body.password);
  }

  @Post("change-password")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Change admin password" })
  async changePassword(
    @Body() body: { oldPassword: string; newPassword: string }
  ) {
    return this.adminAuthService.changePassword(
      body.oldPassword,
      body.newPassword
    );
  }

  @Get("dashboard/stats")
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get admin dashboard statistics" })
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get("users")
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all users with pagination and filters" })
  async getAllUsers(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("search") search?: string,
    @Query("role") role?: string
  ) {
    const pageNum = parseInt(page || "1") || 1;
    const limitNum = parseInt(limit || "20") || 20;
    return this.adminService.getAllUsers(pageNum, limitNum, search, role);
  }

  @Get("users/:id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user details by ID" })
  async getUserById(@Param("id") id: string) {
    return this.adminService.getUserById(id);
  }

  @Patch("users/:id/role")
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update user role" })
  async updateUserRole(@Param("id") id: string, @Body("role") role: string) {
    return this.adminService.updateUserRole(id, role);
  }

  @Patch("users/:id/status")
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Ban or unban a user" })
  async updateUserStatus(
    @Param("id") id: string,
    @Body("isActive") isActive: boolean
  ) {
    return this.adminService.updateUserStatus(id, isActive);
  }

  @Delete("users/:id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a user" })
  async deleteUser(@Param("id") id: string) {
    return this.adminService.deleteUser(id);
  }

  @Get("analytics/users")
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user growth analytics" })
  async getUserAnalytics() {
    return this.adminService.getUserAnalytics();
  }

  @Get("analytics/courses")
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get course analytics" })
  async getCourseAnalytics() {
    return this.adminService.getCourseAnalytics();
  }

  @Get("analytics/quizzes")
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get quiz analytics" })
  async getQuizAnalytics() {
    return this.adminService.getQuizAnalytics();
  }
}
