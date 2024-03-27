import { Controller, Post, Body, Delete, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegisterInputDto, VerifyEmailInputDto, ChangePasswordInputDto, ChangeEmailInputDto, UpdateUserInputDto, LoginInputDto } from './dto/UserInput.dto';
import { AuthService } from '../auth/auth.service';
import { CurrentUser } from '../decorator/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/JwtAuth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() input: UserRegisterInputDto) {
    return await this.userService.register(input);
  }

  @Post('verify-email')
  verifyEmail(@Body() input: VerifyEmailInputDto) {
    return this.userService.verifyEmail(input);
  }

  @Post('login')
  async login(@Body() input: LoginInputDto) {
    const user = await this.userService.login(input);
    const token = this.authService.signToken(user);
    return { token };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteUser(@CurrentUser() user: CurrentUserType) {
    return this.userService.deleteUser(user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  changePassword(@Body() input: ChangePasswordInputDto, @CurrentUser() user: CurrentUserType) {
    return this.userService.changePassword(input, user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-email')
  changeEmail(@Body() input: ChangeEmailInputDto, @CurrentUser() user: CurrentUserType) {
    return this.userService.changeEmail(input, user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  updateUser(@Body() input: UpdateUserInputDto, @CurrentUser() user: CurrentUserType) {
    return this.userService.updateUser(input, user._id);
  }
}
