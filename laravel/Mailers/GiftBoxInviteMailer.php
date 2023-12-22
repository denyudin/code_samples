<?php

namespace App\Mailers;

use App\Jobs\SendEmail;
use App\Mailers\Mailer;

class GiftBoxInviteMailer extends Mailer
{
    /**
     * Send gift box invite email
     * @param  GiftBoxInvite $invite
     * @return void
     */
    public function sendInitialInvite($invite)
    {
        $to = $invite->email;
        $user = $invite->user;
        $subject = "$user->first_name has gifted you a free box of Nurture Life meals";
        $view = 'mail.users.gift-boxes.initial-invite';

        $data['gifterName'] = $user->full_name;
        $data['customMessage'] = $invite->message;
        $data['code'] = $invite->giftBox->promoCode->code;
        $data['daysUntilExpire'] = $invite->daysUntilExpire();
        $data['amount'] = $invite->giftBox->promoCode->amount;

        dispatch(new SendEmail($view, $data, $to, $subject));
    }

    public function sendFirstReminder($invite)
    {
        $to = $invite->email;

        $subject = 'Your gift of a free box of Nurture Life meals expires soon';
        $view = 'mail.users.gift-boxes.first-reminder';

        $data['code'] = $invite->giftBox->promoCode->code;
        $data['amount'] = $invite->giftBox->promoCode->amount;

        dispatch(new SendEmail($view, $data, $to, $subject));
    }

    public function sendLastChanceReminder($invite)
    {
        $to = $invite->email;

        $subject = 'Your free box of Nurture Life meals expires in one week';
        $view = 'mail.users.gift-boxes.last-chance-reminder';

        $data['gifterName'] = $invite->user->full_name;
        $data['code'] = $invite->giftBox->promoCode->code;
        $data['amount'] = $invite->giftBox->promoCode->amount;

        dispatch(new SendEmail($view, $data, $to, $subject));
    }
}
