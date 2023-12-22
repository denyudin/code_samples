<?php

namespace App\Billing\AuthNetResponses;

use App\Billing\Exceptions\AuthNetResponseException;
use App\Billing\AuthNetResponses\Contracts\AuthNetTransactionResponse;

class AuthorizeCreditCardResponse extends AuthNetTransactionResponse
{
    public function handle()
    {
        $tresponse = $this->response->getTransactionResponse();

        if ($tresponse != null && $tresponse->getMessages() != null)
        {
            $this->success['transaction_response_code'] = $tresponse->getResponseCode();
            $this->success['transaction_id'] = $tresponse->getTransId();
            $this->success['code'] = $tresponse->getMessages()[0]->getCode();
            $this->success['description'] = $tresponse->getMessages()[0]->getDescription();
        } else {
            if ($tresponse->getErrors() != null) {
                $this->errors['code'] = $tresponse->getErrors()[0]->getErrorCode();
                $this->errors['message'] = $tresponse->getErrors()[0]->getErrorText();
                throw new AuthNetResponseException($this);
            }
        }

        return $this;
    }
}
