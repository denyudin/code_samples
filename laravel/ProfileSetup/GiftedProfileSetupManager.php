<?php

namespace App\ProfileSetup;

use App\ProfileSetup\ProfileSetupManager;

class GiftedProfileSetupManager extends ProfileSetupManager
{
    protected $lookup = [
        'kids' => 'account.step-2',
        'account' => 'account.step-3',
        'shipping' => 'account.step-4',
        'billing' => 'account.step-5',
        'claimed' => 'my-meals',
    ];

    /**
     * Get account setup flow next step
     * @return string
     */
    public function nextStepUrl()
    {
        if (! $this->user->kids()->count()) {
            return url()->route('account.step-1');
        }

        return url()->route(
            collect($this->lookup)->get($this->user->giftCards()->first()->status)
        );
    }
}
