<?php

namespace App\Users;

use App\OrderWeek;
use Carbon\Carbon;
use App\CompedAccount;
use App\CompedAccountSchedule;
use App\Users\NullCompedAccount;

trait HasCompedAccount
{
    /**
     * CompedAccount relationship
     * @return Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function compedAccount()
    {
        return $this->hasOne(CompedAccount::class);
    }

    /**
     * Get instance of CompedAccount
     * @return mixed
     */
    public function getCompedAccount()
    {
        return $this->compedAccount()->first() ?: new NullCompedAccount($this);
    }

    /**
     * CompedAccountSchedule Relationship
     * @return Illuminate\Database\Eloquent\Relations\HasOne
     */

    public function compedAccountSchedule()
    {
        return $this->hasOne(CompedAccountSchedule::class);
    }

    /**
     * Get attribute
     * @return bool
     */
    public function getIsCompedAccountAttribute()
    {
        return $this->isCompedAccount();
    }

    /**
     * Get attribute
     * @return double
     */
    public function getCompedAmountAttribute()
    {
        return $this->compedAmount();
    }

    /**
     * Get attribute
     * @return integer
     */
    public function getNumberOfWeeksCompedAttribute()
    {
        return $this->numberOfWeeksComped();
    }

    /**
     * Get attribute
     * @return integer
     */
    public function getWithBannerAttribute()
    {
        return $this->showCompedBanner();
    }

    /**
     * Get attribute
     * @return integer
     */
    public function getCompedWeeksUsedAttribute()
    {
        return $this->compedWeeksUsed();
    }

    /**
     * Set account as comped
     * @param array $params
     */
    public function setComped(array $params = [])
    {
        $this->getCompedAccount()->update(array_merge([
            'is_activated' => true,
        ], $params));

        $this->update([
            'auth_net_active' => true,
        ]);

        $this->subscriptions->each(function ($subscription) {
            $subscription->reactivate();
        });

        if ($this->hasShipDay()) {
            $this->setActiveWeeks();
        }
        $this->generateOrders();
        $this->logUserIsActive();
        $this->updateStatus();

        return $this;
    }

    /**
     * Set comped account options
     * @param array $options
     */
    public function setCompedOptions($options)
    {
        $this->getCompedAccount()->update($options);
        if (isset($options['amount'])) {
            $this->setCompedAmount($options['amount']);
        }

        return $this;
    }

    /**
     * Unset comped account
     * @return App\User
     */
    public function unsetComped()
    {
        $this->getCompedAccount()->unset();


        if (! $this->isAuthNetCustomer()) {
            $this->setAuthNetInactive();
            $this->suspendSubscriptions();
            $this->logUserIsCompedEnded();

            $this->activeWeeks->each(function ($week) {
                $this->kids->each(function ($kid) use ($week) {
                    $kid->deleteOrderForWeek($week);
                });

                $this->weeks()->newPivotStatement()
                    ->where('order_week_id', $week->id)
                    ->where('user_id', $this->id)
                    ->update([
                        'comped_amount' => null,
                        'is_comped_account' => false,
                    ]);
            });
        }

        $this->updateStatus();

        return $this;
    }

    /**
     * Check if account is currently comped
     * @return boolean
     */
    public function isCompedAccount()
    {
        return $this->getCompedAccount()->isActivated();
    }


    public function isSuspendedCompedAccount() {
        return ! $this->isCompedAccount() && (! $this->numberOfWeeksComped() && $this->compedWeeksUsed());
    }
    /**
     * Set how many weeks account is comped
     * @param mixed $weeksCount
     */
    public function setNumberOfWeeksComped($weeksCount)
    {
        return $this->getCompedAccount()->setNumberOfWeeks($weeksCount);
    }

    /**
     * Get number of weeks for when account is comped
     * @return integer
     */
    public function numberOfWeeksComped()
    {
        return $this->getCompedAccount()->numberOfWeeks();
    }

    /**
     * Get amount of used comped weeks
     * @return integer
     */
    public function compedWeeksUsed()
    {
        return $this->getCompedAccount()->weeksUsed();
    }

    /**
     * Get comped remaining weeks count
     * @return integer
     */
    public function remainingCompedWeeks()
    {
        return $this->getCompedAccount()->remainingWeeks();
    }

    /**
     * Allot comped amount per user level
     * @param double $amount
     */
    public function setCompedAmount($amount)
    {
        $this->getCompedAccount()->setAmount($amount);
        $this->setCompedAmountForActiveWeeks($amount);
    }

    /**
     * Set comped amout per each active week
     * @param double $amount
     */
    public function setCompedAmountForActiveWeeks($amount)
    {
        $this->weeks()->newPivotStatement()
            ->whereIn('order_week_id', $this->activeWeeks()->pluck('order_week_id'))
            ->where('user_id', $this->id)
            ->update(['comped_amount' => $amount > 0 ? $amount : null]);
    }

    /**
     * Get comped amout
     * @return double
     */
    public function compedAmount()
    {
        return $this->getCompedAccount()->amount();
    }

    /**
     * Check if user has comped amount alloted
     * @return boolean
     */
    public function hasCustomCompedAmount()
    {
        return $this->compedAmount() > 0;
    }

    /**
     * Check if comped amount was applied to specific week
     * @param  App\OrderWeek  $week
     * @return boolean
     */
    public function hasCustomCompedAmountPerWeek($week)
    {
        return $this->customCompedAmountForWeek($week) > 0;
    }

    /**
     * Get comped amount alloted for specific week
     * @param  App\OrderWeek $week
     * @return double
     */
    public function customCompedAmountForWeek($week)
    {
        return $this->getWeek($week)->pivot->comped_amount ?: $this->compedAmount();
    }

    /**
     * Get min alloted comped amount across all weeks
     * @return double
     */
    public function minCompedAmout()
    {
        return $this->activeWeeks
            ->pluck('pivot.comped_amount')
            ->push($this->compedAmount())
            ->reject(function ($amount) {
                return is_null($amount);
            })
            ->min();
    }

    public function showCompedBanner()
    {
        return $this->getCompedAccount()->showCompedBanner();
    }

    /**
     * Check if user was ever comped account
     * @return boolean
     */
    public function isEverComped()
    {
        return $this->compedAccount()->count() > 0;
    }

    /**
     * Query constraint
     * @param  Illuminate\Database\Eloquent\Builder
     * @return Illuminate\Database\Eloquent\Builder
     */
    public function scopeScheduledCompedToday($query)
    {
        return $query->whereHas('compedAccountSchedule', function ($query) {
            $query->whereDate('start_date', '=', Carbon::today());
        });
    }
    /**
     * Query constraint
     * @param  Illuminate\Database\Eloquent\Builder
     * @return Illuminate\Database\Eloquent\Builder
     */
    public function scopeScheduledUnsetCompedToday($query)
    {
        return $query->whereHas('compedAccountSchedule', function ($query) {
            $query->whereDate('end_date', '=', Carbon::today());
        });
    }
}
