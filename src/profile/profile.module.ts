import { Module, forwardRef } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileUpdate } from './profile.update';
import { GeneralModule } from 'src/general/general.module';
import { UsersModule } from 'src/users/users.module';
import { ListenersModule } from 'src/listeners/listeners.module';

@Module({
  imports: [
    forwardRef(() => GeneralModule),
    UsersModule,
    forwardRef(() => ListenersModule),
  ],
  providers: [ProfileService, ProfileUpdate],
  exports: [ProfileService],
})
export class ProfileModule {}
