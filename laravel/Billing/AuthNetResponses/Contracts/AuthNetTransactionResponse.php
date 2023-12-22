<?php

namespace App\Billing\AuthNetResponses\Contracts;

use App\Billing\Exceptions\AuthNetResponseException;

abstract class AuthNetTransactionResponse extends AuthNetResponse
{
    public function handleResponseFailure($response)
    {
        $tresponse = $response->getTransactionResponse();

        if ($tresponse->getErrors() != null) {
            $this->errors['code'] = $tresponse->getErrors()[0]->getErrorCode();
            $this->errors['message'] = $tresponse->getErrors()[0]->getErrorText();

            throw new AuthNetResponseException($this);
        }
    }

    public function handleGenericFailedResponse($response)
    {
        if ($response->getMessages()->getResultCode() != 'Ok') {
            $tresponse = $response->getTransactionResponse();

            if ($tresponse != null && $tresponse->getErrors() != null) {
                $this->errors['code'] = $tresponse->getErrors()[0]->getErrorCode();
                $this->errors['message'] = $tresponse->getErrors()[0]->getErrorText();
            } else {
                $this->errors['code'] = $response->getMessages()->getMessage()[0]->getCode();
                $this->errors['message'] = $response->getMessages()->getMessage()[0]->getText();
            }

            throw new AuthNetResponseException($this);
        }
    }
}
