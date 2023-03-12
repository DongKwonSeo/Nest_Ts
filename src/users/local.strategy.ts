import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
  ) {
    super({
      secretOrKey: 'hello',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload) {
    const { name } = payload;
    const user: User = await this.userRepository.findOne({
      where: {
        name,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
