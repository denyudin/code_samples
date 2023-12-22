<?php

namespace App\ShipStation;

use App\ShipStation\ShippingGateWay;
use App\ShipStation\ShipStationOrder;
use App\ShipStation\ShipStationException;

class FakeShipStationGateWay implements ShippingGateWay
{
    protected $pushedOrders;

    protected $shouldFail = false;

    public function __construct()
    {
        $this->pushedOrders = collect();
    }

    public function shouldFail()
    {
        $this->shouldFail = true;
        return $this;
    }

    public function push($invoice)
    {
        if ($this->shouldFail) {
            throw new ShipStationException();
        }

        return $this->pushedOrders[] = new ShipStationOrder([
            'id' => '1',
            'orderKey' => 'TEST_ORDER_KEY_1234' . random_int(0, 100),
        ]);
    }

    public function pushedOrders()
    {
        return $this->pushedOrders;
    }
}
