<?php

namespace App\ShipStation;

interface ShippingGateWay
{
    public function push($invoice);
}
