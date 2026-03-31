import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ALLOWED_IPS } from '../shared/constants/allowed-ips';

@Injectable()
export class IpGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    return ALLOWED_IPS.includes(request.ip);
  }
}
