<?php

namespace App\Billing;

use App\Kid;
use App\User;
use App\Cards\Card;
use App\Billing\BillableCustomer;

interface Billing
{
    public function newCustomer(Card $card);

    public function authorizePaymentProfile($amount, Card $card = null);

    public function authorizeCreditCard($amount, $card);

    public function updateCustomer(Card $card);

    public function deleteCustomer(User $user);

    public function newCustomerPaymentProfile(Card $card);

    public function deleteCustomerPaymentProfile($paymentProfileId = null);

    public function getDefaultPaymentProfile();

    public function subscription(Kid $kid);

    public function updateSubscription(Kid $kid);

    public function charge($amount, User $user = null);

    public function chargeCard($amount, $card, BillableCustomer $billableCustomer = null);

    public function refund($amount, $invoice);
}
