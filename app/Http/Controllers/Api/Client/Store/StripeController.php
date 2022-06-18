<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Store;

use Stripe\StripeClient;
use Illuminate\Http\JsonResponse;
use Stripe\Exception\ApiErrorException;
use Pterodactyl\Exceptions\DisplayException;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;
use Pterodactyl\Contracts\Repository\SettingsRepositoryInterface;
use Pterodactyl\Http\Requests\Api\Client\Store\Gateways\StripeRequest;

class StripeController extends ClientApiController
{
    private SettingsRepositoryInterface $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        parent::__construct();
        $this->settings = $settings;
    }

    /**
     * @throws DisplayException|ApiErrorException
     */
    public function purchase(StripeRequest $request): JsonResponse
    {
        if (!$this->settings->get('jexactyl::store:stripe:enabled')) {
            throw new DisplayException('Unable to purchase via PayPal: module not enabled');
        }

        $client = new StripeClient(config('gateways.stripe.secret'));
        $amount = $request->input('amount');
        $cost = config('gateways.stripe.cost', 1.00) / 100 * $amount;
        $currency = config('gateways.currency', 'USD');
        $checkout = $client->checkout->sessions->create([
            'success_url' => route('api.client.store.stripe.success'),
            'cancel_url' => config('app.url') . '/store',
            'mode' => 'payment',
            'customer_email' => $request->user()->email,
            'metadata' => ['credit_amount' => $amount],
            'line_items' => [
                [
                    'price_data' => [
                        'currency' => $currency,
                        'unit_amount' => str_replace('.', '', $cost),
                        'product_data' => [
                            'name' => $amount . ' Credits | ' . $this->settings->get('settings::app:name'),
                        ],
                    ],
                ],
            ],
        ]);

        return new JsonResponse($checkout->url, 200, [], null, true);
    }
}