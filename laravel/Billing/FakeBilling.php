<?php

namespace App\Billing;

use Log;
use App\Kid;
use App\User;
use App\Cards\Card;
use App\Billing\Authorization;
use App\Billing\BillableCustomer;
use App\Billing\AuthNetResponses\ChargeReponse;
use App\Billing\Exceptions\AuthNetCustomerException;
use App\Billing\Exceptions\AuthNetResponseException;
use App\Billing\AuthNetResponses\FakeAuthNetResponse;

class FakeBilling implements Billing
{

	protected $newCustomers = [];
	protected $totalAuthorizations = [];
	protected $totalCharges = [];
	protected $refunds = [];
	protected $shouldFail;

	public function __construct()
	{
		$this->newCustomers = collect();
		$this->totalAuthorizations = collect();
		$this->totalCharges = collect();
		$this->refunds = collect();
	}

	public function shouldFail()
	{
		$this->shouldFail = true;

		return $this;
	}

	public function newCustomer(Card $card)
	{
		$this->newCustomers[] = $card;

		return new class {
			public function getSuccess()
			{
				return [
					'customer_profile_id' => 1111,
					'customer_payment_profile_ids' => [2222],
					'customer_shipping_address_id_list' => [3333],
				];
			}
		};
	}

	public function createCustomerNewFlow($card, $addressData, $email)
	{
		$this->newCustomers[] = $card;

		return new class {
			public function getSuccess()
			{
				return [
					'customer_profile_id' => 1111,
					'customer_payment_profile_ids' => [2222],
					'customer_shipping_address_id_list' => [3333],
				];
			}
		};
	}

	public function authorizePaymentProfile($amount, Card $card = null)
	{
		if ($this->shouldFail) {
			throw new AuthNetResponseException(new FakeAuthNetResponse);
		}

		$this->totalAuthorizations[] = $amount;

		return new FakeAuthNetResponse;
	}

	public function authorizeCreditCard($amount, $card)
	{
		if ($this->shouldFail) {
			throw new AuthNetResponseException();
		}

		$this->totalAuthorizations[] = $amount;

		return new Authorization([
			'transactionId' => '1234',
			'amount' => $amount,
		]);
	}

	public function updateCustomer(Card $card)
	{
		Log::info('Updating customer CC details');
	}

	public function deleteCustomer(User $user)
	{
		throw new \Exception('Method not implemented');
	}

	public function newCustomerPaymentProfile(Card $card)
	{
		throw new \Exception('Method not implemented');
	}

	public function deleteCustomerPaymentProfile($paymentProfileId = null)
	{
		throw new \Exception('Method not implemented');
	}

	public function getDefaultPaymentProfile()
	{
		throw new AuthNetCustomerException();
	}

	public function subscription(Kid $kid)
	{
		throw new \Exception('Method not implemented');
	}

	public function updateSubscription(Kid $kid)
	{
		throw new \Exception('Method not implemented');
	}

	public function chargeCard($amount, $card, BillableCustomer $billableCustomer = null)
	{
		if ($amount == 70.03) {
			throw new AuthNetResponseException(new FakeAuthNetResponse);
		}

		return $this->charge($amount);
	}

	public function charge($amount, User $user = null)
	{
		if ($this->shouldFail) {
			throw new AuthNetResponseException(new FakeAuthNetResponse);
		}

		$this->totalCharges->push($amount);

		return new class {
			protected $success = [
				'transaction_response_code' => 'test_response_code',
				'transaction_id' => 1111,
				'code' => 'test_code_success',
				'description' => 'You have been charged',
			];

			protected $errors = [
				'message' => 'Charge failed',
				'code' => '0001',
			];

			public function getSuccess()
			{
				return $this->success;
			}

			public function getErrors()
			{
				return $this->errors;
			}
		};
	}

	public function refund($amount, $invoice)
	{
		if ($amount == 0) {
			throw new AuthNetResponseException(new class {
				protected $errors = ['message' => 'Unsuccesfull transaction'];
				public function getErrors()
				{
					return $this->errors;
				}
			});
		}

		$this->refunds->push($amount);

		return new class {
			public $transactionId = 'refund_transaction_1234';
		};
	}

	public function getTotalAuthorizations()
	{
		return $this->totalAuthorizations->sum();
	}

	public function totalRefunds()
	{
		return $this->refunds->sum();
	}

	public function getTotalCharges()
	{
		return $this->totalCharges->sum();
	}

	public function setUser($user)
	{
		$this->user = $user;

		return $this;
	}
}
