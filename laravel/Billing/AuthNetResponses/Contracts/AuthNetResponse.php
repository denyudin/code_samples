<?php

namespace App\Billing\AuthNetResponses\Contracts;

use App\Billing\Exceptions\AuthNetResponseException;
use App\Billing\AuthNetResponses\Contracts\AuthNetTransactionResponse;

abstract class AuthNetResponse
{
    protected $response;

    protected $errors = [];

    protected $success = [];

    public function __construct($response)
    {
        if (is_null($response)) {
            throw new AuthNetResponseException();
        }

        $this->handleGenericFailedResponse($response);

        $this->handleResponseFailure($response);

        $this->response = $response;
    }

    abstract public function handle();

    abstract public function handleResponseFailure($response);

    abstract public function handleGenericFailedResponse($response);

    public function getErrors()
    {
        return $this->errors;
    }

    public function getSuccess()
    {
        return $this->success;
    }

}
