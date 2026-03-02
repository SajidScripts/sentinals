import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SubscriptionService } from './subscription.service';

@ApiTags('subscriptions')
@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) { }

    @Get()
    @ApiOperation({ summary: 'Get current subscription status' })
    async getSubscription(@CurrentUser('id') userId: string) {
        return this.subscriptionService.getSubscription(userId);
    }

    @Get('plans')
    @ApiOperation({ summary: 'List available subscription plans' })
    async listPlans() {
        return this.subscriptionService.listPlans();
    }

    @Post('checkout')
    @ApiOperation({ summary: 'Create checkout session (Stripe placeholder)' })
    async createCheckout(
        @CurrentUser('id') userId: string,
        @Body('planId') planId: string,
    ) {
        return this.subscriptionService.createCheckoutSession(userId, planId);
    }
}
