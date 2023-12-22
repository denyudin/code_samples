<?php

namespace App\Mailers;

use App\EmailTemplate;

abstract class Mailer
{
    protected $view = 'mail.template';

    public function getContents($templateSlug, $data)
    {
        $emailTemplate = EmailTemplate::bySlug($templateSlug);

        return view($emailTemplate->path, $data)->render();
    }

    public function getView()
    {
        return $this->view;
    }

    public function setView($view)
    {
        $this->view = $view;

        return $this;
    }
}