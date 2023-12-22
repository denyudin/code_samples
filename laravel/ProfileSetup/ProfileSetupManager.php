<?php

namespace App\ProfileSetup;

use App\ProfileSetupStatus;
use App\User;

class ProfileSetupManager
{
    protected $user;

    protected $routesLookup = [
        'kids' => 'account.step-1',
        'account' => 'account.step-2',
        'shipping' => 'account.step-3',
        'payment' => 'account.step-4',
        'done' => 'account.step-5',
    ];

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Determine next profile setup status
     * @return App\ProfileSetupStatus
     */
    public function getNextStatus()
    {
        $currentStatus = $this->user->profileSetupStatus;

        return ProfileSetupStatus::whereOrder(++$currentStatus->order)->first();
    }
    /**
     * Determine next profile setup status
     * @return App\ProfileSetupStatus
     */
    public function getPreviousStatus()
    {
        $currentStatus = $this->user->profileSetupStatus;

        return ProfileSetupStatus::whereOrder(--$currentStatus->order)->first();
    }

    /**
     * Check if status can be updated to the given desired status
     * @param  App\ProfileSetupStatus $desiredProfileStatus
     * @return boolean
     */
    public function canUpdateToStatus(ProfileSetupStatus $desiredProfileStatus)
    {
        return $desiredProfileStatus->order > $this->user->profileSetupStatus->order;
    }

    /**
     * Get account setup flow next step
     * @return string
     */
    public function nextStepUrl()
    {
        $nextStatus = $this->getNextStatus();

        if (! $nextStatus) {
            return url()->route('my-meals');
        }

        return url()->route(collect($this->routesLookup)->get($nextStatus->name));
    }

    public function previousStepUrl()
    {
        $previousStep = $this->getPreviousStatus();

        if (! $previousStep) {
            return url()->route('account.step-1');
        }

        return url()->route(collect($this->routesLookup)->get($previousStep->name));
    }

    /**
     * Get current profile setup status step  url
     * @return string
     */
    public function getCurrentStepUrl()
    {
        $kids = $this->user->kids()->count();

        return url()->route(collect($this->routesLookup)->get(($kids || session('kids')) ? $this->user->profileSetupStatus->name : 'kids'));
    }

}
