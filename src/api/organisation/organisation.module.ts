import { Module } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { OrganisationController } from './organisation.controller';

@Module({
  providers: [OrganisationService],
  controllers: [OrganisationController]
})
export class OrganisationModule {}
